import Tesseract from 'tesseract.js';

export interface ExtractedOcrResult {
  rawText: string;
  extractedLines: string[];
  confidence: number;
}

// Pre-process image on canvas to boost OCR contrast and accuracy
export async function preprocessImage(imageSource: string | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
          return;
        }

        // Scale up if too small
        let width = img.width;
        let height = img.height;
        if (width < 1200) {
          const scale = 1200 / width;
          width = 1200;
          height = Math.round(height * scale);
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Get image data for grayscale & contrast enhancement
        const imgData = ctx.getImageData(0, 0, width, height);
        const d = imgData.data;

        // Contrast factor
        const contrast = 35; // boost contrast
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < d.length; i += 4) {
          // Grayscale (ITU-R BT.601)
          const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // Contrast
          const adjusted = Math.min(255, Math.max(0, factor * (gray - 128) + 128));
          d[i] = adjusted;
          d[i + 1] = adjusted;
          d[i + 2] = adjusted;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
      }
    };
    img.onerror = () => {
      resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(imageSource);
    }
  });
}

// Real Tesseract OCR recognition
export async function runRealOcr(
  fileOrUrl: File | string,
  onProgress?: (percent: number, status: string) => void
): Promise<ExtractedOcrResult> {
  try {
    if (onProgress) onProgress(15, 'Preparing scan image for optical character recognition...');

    // If it's an image, preprocess it
    let targetSource: string = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);
    if (typeof fileOrUrl !== 'string' && fileOrUrl.type.startsWith('image/')) {
      targetSource = await preprocessImage(fileOrUrl);
    }

    if (onProgress) onProgress(30, 'Running neural OCR text extraction...');

    const result = await Tesseract.recognize(
      targetSource,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text' && onProgress) {
            const p = Math.round(30 + (m.progress * 60));
            onProgress(Math.min(95, p), `Extracting characters (${Math.round(m.progress * 100)}%)...`);
          }
        }
      }
    );

    const rawText = result.data.text || '';
    const confidence = result.data.confidence || 0;

    // Parse text into structured lines
    const extractedLines = parseOcrTextToLabLines(rawText);

    if (onProgress) onProgress(100, `OCR complete! Extracted ${extractedLines.length} clinical parameters.`);

    return {
      rawText,
      extractedLines,
      confidence
    };
  } catch (err) {
    console.error('OCR Error:', err);
    // Return empty result on failure so caller can handle fallback
    return {
      rawText: '',
      extractedLines: [],
      confidence: 0
    };
  }
}

// Known medical test aliases for high-accuracy matching
const KNOWN_TESTS: { name: string; aliases: string[]; defaultUnit: string; defaultRef: string }[] = [
  // CBC
  { name: 'Hemoglobin', aliases: ['hemoglobin', 'haemoglobin', 'hb', 'hgb'], defaultUnit: 'g/dL', defaultRef: '13.5 - 17.5' },
  { name: 'Hematocrit', aliases: ['hematocrit', 'haematocrit', 'hct', 'pcv'], defaultUnit: '%', defaultRef: '40.0 - 52.0' },
  { name: 'RBC Count', aliases: ['rbc count', 'rbc', 'red blood cells', 'red blood cell count', 'erythrocyte count'], defaultUnit: 'x10^6/mcL', defaultRef: '4.30 - 5.90' },
  { name: 'White Blood Cells (WBC)', aliases: ['white blood cells', 'wbc', 'wbc count', 'total leukocyte count', 'tlc', 'leukocyte count'], defaultUnit: 'x10^3/mcL', defaultRef: '4.50 - 11.00' },
  { name: 'Platelet Count', aliases: ['platelet count', 'platelets', 'plt', 'thrombocyte count'], defaultUnit: 'x10^3/mcL', defaultRef: '150 - 450' },
  { name: 'MCV', aliases: ['mcv', 'mean corpuscular volume'], defaultUnit: 'fL', defaultRef: '80.0 - 100.0' },
  { name: 'MCH', aliases: ['mch', 'mean corpuscular hemoglobin'], defaultUnit: 'pg', defaultRef: '27.0 - 33.0' },
  { name: 'MCHC', aliases: ['mchc', 'mean corpuscular hemoglobin conc'], defaultUnit: 'g/dL', defaultRef: '31.5 - 35.5' },
  { name: 'RDW', aliases: ['rdw-cv', 'rdw', 'red cell distribution width'], defaultUnit: '%', defaultRef: '11.5 - 14.5' },
  { name: 'Neutrophils', aliases: ['neutrophils', 'absolute neutrophils', 'neutrophil %', 'polymorphs', 'segs'], defaultUnit: '%', defaultRef: '40 - 75' },
  { name: 'Lymphocytes', aliases: ['lymphocytes', 'absolute lymphocytes', 'lymphocyte %', 'lymphs'], defaultUnit: '%', defaultRef: '20 - 45' },
  { name: 'Monocytes', aliases: ['monocytes', 'absolute monocytes', 'monocyte %'], defaultUnit: '%', defaultRef: '2 - 10' },
  { name: 'Eosinophils', aliases: ['eosinophils', 'absolute eosinophils', 'eosinophil %'], defaultUnit: '%', defaultRef: '1 - 6' },
  { name: 'ESR', aliases: ['esr', 'erythrocyte sedimentation rate', 'sed rate'], defaultUnit: 'mm/hr', defaultRef: '0 - 20' },

  // Diabetes & Glycemic
  { name: 'Fasting Blood Glucose', aliases: ['fasting blood glucose', 'fasting blood sugar', 'fasting glucose', 'fbs', 'fbg', 'glucose fasting', 'blood sugar fasting'], defaultUnit: 'mg/dL', defaultRef: '70 - 99' },
  { name: 'Postprandial Blood Glucose', aliases: ['postprandial blood glucose', 'post prandial glucose', 'ppbs', 'ppbg', 'post glucose', '2 hr pp glucose'], defaultUnit: 'mg/dL', defaultRef: '< 140' },
  { name: 'Hemoglobin A1c (HbA1c)', aliases: ['hemoglobin a1c', 'hba1c', 'glycated hemoglobin', 'a1c', 'glycohemoglobin'], defaultUnit: '%', defaultRef: '4.0 - 5.6' },
  { name: 'Fasting Serum Insulin', aliases: ['fasting serum insulin', 'fasting insulin', 'serum insulin', 'insulin fasting'], defaultUnit: 'uIU/mL', defaultRef: '2.6 - 24.9' },
  { name: 'HOMA-IR', aliases: ['homa-ir', 'homa ir', 'insulin resistance index'], defaultUnit: '', defaultRef: '< 2.0' },

  // Lipids & Cardiac
  { name: 'Total Cholesterol', aliases: ['total cholesterol', 'cholesterol total', 'serum cholesterol'], defaultUnit: 'mg/dL', defaultRef: '< 200' },
  { name: 'Triglycerides', aliases: ['triglycerides', 'serum triglycerides', 'tgl', 'tg'], defaultUnit: 'mg/dL', defaultRef: '< 150' },
  { name: 'HDL Cholesterol', aliases: ['hdl cholesterol', 'hdl', 'high density lipoprotein', 'hdl-c'], defaultUnit: 'mg/dL', defaultRef: '> 40' },
  { name: 'LDL Cholesterol', aliases: ['ldl cholesterol', 'ldl', 'low density lipoprotein', 'ldl-c', 'ldl calculated'], defaultUnit: 'mg/dL', defaultRef: '< 100' },
  { name: 'VLDL Cholesterol', aliases: ['vldl cholesterol', 'vldl', 'vldl-c'], defaultUnit: 'mg/dL', defaultRef: '< 30' },
  { name: 'Non-HDL Cholesterol', aliases: ['non-hdl cholesterol', 'non hdl', 'non-hdl'], defaultUnit: 'mg/dL', defaultRef: '< 130' },
  { name: 'Total / HDL Ratio', aliases: ['total / hdl ratio', 'cholesterol / hdl ratio', 'tc/hdl ratio', 'chol/hdl'], defaultUnit: '', defaultRef: '< 4.0' },
  { name: 'Triglyceride / HDL Ratio', aliases: ['triglyceride / hdl ratio', 'tg/hdl ratio', 'tgl/hdl'], defaultUnit: '', defaultRef: '< 3.0' },
  { name: 'High-Sensitivity CRP (hs-CRP)', aliases: ['hs-crp', 'hscrp', 'high sensitivity crp', 'crp hs', 'c-reactive protein'], defaultUnit: 'mg/L', defaultRef: '< 1.00' },
  { name: 'Lipoprotein(a)', aliases: ['lipoprotein(a)', 'lipoprotein a', 'lp(a)', 'lpa'], defaultUnit: 'mg/dL', defaultRef: '< 30' },
  { name: 'Apolipoprotein B', aliases: ['apolipoprotein b', 'apob', 'apo-b', 'apolipoprotein-b'], defaultUnit: 'mg/dL', defaultRef: '< 90' },
  { name: 'Plasma Homocysteine', aliases: ['plasma homocysteine', 'homocysteine', 'serum homocysteine'], defaultUnit: 'umol/L', defaultRef: '< 12.0' },

  // Kidney
  { name: 'Serum Creatinine', aliases: ['serum creatinine', 'creatinine', 's.creatinine', 'creat'], defaultUnit: 'mg/dL', defaultRef: '0.70 - 1.30' },
  { name: 'eGFR', aliases: ['egfr', 'estimated gfr', 'gfr (ckd-epi)', 'gfr'], defaultUnit: 'mL/min/1.73m2', defaultRef: '> 90' },
  { name: 'Blood Urea Nitrogen (BUN)', aliases: ['blood urea nitrogen', 'bun', 'urea nitrogen', 'serum urea', 'urea'], defaultUnit: 'mg/dL', defaultRef: '7 - 20' },
  { name: 'Serum Cystatin C', aliases: ['serum cystatin c', 'cystatin c', 'cystatin-c'], defaultUnit: 'mg/L', defaultRef: '0.50 - 0.96' },
  { name: 'Serum Uric Acid', aliases: ['serum uric acid', 'uric acid', 'urate'], defaultUnit: 'mg/dL', defaultRef: '3.5 - 7.2' },

  // Liver
  { name: 'Total Bilirubin', aliases: ['total bilirubin', 'bilirubin total', 's.bilirubin total'], defaultUnit: 'mg/dL', defaultRef: '0.2 - 1.2' },
  { name: 'Direct Bilirubin', aliases: ['direct bilirubin', 'bilirubin direct', 'conjugated bilirubin'], defaultUnit: 'mg/dL', defaultRef: '0.0 - 0.3' },
  { name: 'SGOT (AST)', aliases: ['sgot', 'ast', 'aspartate aminotransferase', 'sgot/ast'], defaultUnit: 'U/L', defaultRef: '10 - 40' },
  { name: 'SGPT (ALT)', aliases: ['sgpt', 'alt', 'alanine aminotransferase', 'sgpt/alt'], defaultUnit: 'U/L', defaultRef: '7 - 45' },
  { name: 'Alkaline Phosphatase (ALP)', aliases: ['alkaline phosphatase', 'alp', 'alk phos'], defaultUnit: 'U/L', defaultRef: '44 - 147' },
  { name: 'Serum Albumin', aliases: ['serum albumin', 'albumin', 's.albumin'], defaultUnit: 'g/dL', defaultRef: '3.5 - 5.0' },
  { name: 'Serum Total Protein', aliases: ['total protein', 'protein total', 'serum protein'], defaultUnit: 'g/dL', defaultRef: '6.0 - 8.3' },

  // Thyroid & Endocrine
  { name: 'TSH', aliases: ['tsh', 'thyroid stimulating hormone', 's.tsh', 'ultrasensitive tsh'], defaultUnit: 'mIU/L', defaultRef: '0.45 - 4.50' },
  { name: 'Free T4', aliases: ['free t4', 'ft4', 'free thyroxine'], defaultUnit: 'ng/dL', defaultRef: '0.82 - 1.77' },
  { name: 'Free T3', aliases: ['free t3', 'ft3', 'free triiodothyronine'], defaultUnit: 'pg/mL', defaultRef: '2.0 - 4.4' },

  // Vitamins & Minerals
  { name: '25-OH Vitamin D', aliases: ['25-oh vitamin d', 'vitamin d', 'vit d', '25-hydroxy vitamin d', '25-hydroxyvitamin d'], defaultUnit: 'ng/mL', defaultRef: '>= 30.0' },
  { name: 'Vitamin B12', aliases: ['vitamin b12', 'vit b12', 'b12', 'cobalamin', 'cyanocobalamin'], defaultUnit: 'pg/mL', defaultRef: '200 - 900' },
  { name: 'Serum Ferritin', aliases: ['serum ferritin', 'ferritin', 's.ferritin'], defaultUnit: 'ng/mL', defaultRef: '30 - 300' },
  { name: 'Serum Calcium', aliases: ['serum calcium', 'calcium', 'total calcium', 's.calcium'], defaultUnit: 'mg/dL', defaultRef: '8.5 - 10.2' },
  { name: 'Serum Potassium', aliases: ['serum potassium', 'potassium', 'k+', 's.potassium'], defaultUnit: 'mEq/L', defaultRef: '3.5 - 5.1' },
  { name: 'Serum Sodium', aliases: ['serum sodium', 'sodium', 'na+', 's.sodium'], defaultUnit: 'mEq/L', defaultRef: '135 - 145' },

  // Markers
  { name: 'Carcinoembryonic Antigen (CEA)', aliases: ['cea', 'carcinoembryonic antigen'], defaultUnit: 'ng/mL', defaultRef: '< 3.0' },
  { name: 'Lactate Dehydrogenase (LDH)', aliases: ['ldh', 'lactate dehydrogenase'], defaultUnit: 'U/L', defaultRef: '120 - 240' },
  { name: 'PSA (Prostate-Specific Antigen)', aliases: ['psa', 'total psa', 'prostate specific antigen'], defaultUnit: 'ng/mL', defaultRef: '< 4.0' }
];

// Parser that takes messy OCR text and extracts clean medical parameter lines
export function parseOcrTextToLabLines(ocrText: string): string[] {
  if (!ocrText || ocrText.trim().length === 0) return [];

  const rawLines = ocrText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 3);
  const foundLines: string[] = [];
  const matchedTests = new Set<string>();

  // Pass 1: Look for known tests across lines
  for (const line of rawLines) {
    const lowerLine = line.toLowerCase();

    for (const test of KNOWN_TESTS) {
      if (matchedTests.has(test.name)) continue;

      const hasAlias = test.aliases.some(alias => {
        const regex = new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
        return regex.test(lowerLine);
      });

      if (hasAlias) {
        // Extract numbers from this line
        const numbersMatch = line.match(/[-+]?[0-9]*\.?[0-9]+/g);
        if (numbersMatch && numbersMatch.length > 0) {
          // Typically the first or second number is the result value
          const val = parseFloat(numbersMatch[0]);
          if (!isNaN(val)) {
            // Check if there is an explicit reference range in the line
            let refStr = test.defaultRef;
            const refMatch = line.match(/(\d+(\.\d+)?)\s*[-–—to]\s*(\d+(\.\d+)?)/i) || line.match(/[<>]=?\s*(\d+(\.\d+)?)/i);
            if (refMatch) {
              refStr = refMatch[0].trim();
            }

            // Check if unit is in the line, else default
            let unitStr = test.defaultUnit;
            const unitMatch = line.match(/(mg\/dL|g\/dL|mmol\/L|uIU\/mL|mIU\/L|ng\/mL|pg\/mL|umol\/L|fL|pg|%|x10\^3\/mcL|x10\^6\/mcL|U\/L|mm\/hr|mEq\/L)/i);
            if (unitMatch) {
              unitStr = unitMatch[0];
            }

            foundLines.push(`${test.name}: ${val} ${unitStr} (Ref: ${refStr})`);
            matchedTests.add(test.name);
            break;
          }
        }
      }
    }
  }

  // Pass 2: If lines have general "Name: Value Unit (Ref: ...)" format
  if (foundLines.length < 3) {
    for (const line of rawLines) {
      const generalMatch = line.match(/^([A-Za-z0-9\s()/-]{3,35})\s*[:\s|]\s*([0-9.]+)\s*([A-Za-z/%^0-9]*)\s*(\(Ref:?[^)]*\)|\[[^\]]*\])?/i);
      if (generalMatch) {
        const name = generalMatch[1].trim();
        const val = generalMatch[2].trim();
        const unit = generalMatch[3].trim();
        const ref = generalMatch[4] ? generalMatch[4].trim() : '(Ref: Standard range)';

        // Filter out dates, times, barcodes
        if (!name.match(/date|time|page|patient|doctor|phone|ref|sample|hospital|laboratory|dr\.|mrn|id|age|sex|gender/i)) {
          if (!matchedTests.has(name) && !isNaN(parseFloat(val))) {
            foundLines.push(`${name}: ${val} ${unit} ${ref.startsWith('(') ? ref : `(${ref})`}`);
            matchedTests.add(name);
          }
        }
      }
    }
  }

  return foundLines;
}
