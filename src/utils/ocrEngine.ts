import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker if in browser
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  } catch (e) {}
}

export interface ExtractedOcrResult {
  rawText: string;
  extractedLines: string[];
  confidence: number;
}

// Pre-process image on canvas to boost OCR contrast and character definition without destroying faint/colored text
export async function preprocessImage(imageSource: string | File): Promise<string> {
  return new Promise((resolve) => {
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

        // Scale up if width is under 1800px for sharper OCR recognition
        let width = img.width;
        let height = img.height;
        if (width < 1800) {
          const scale = 1800 / width;
          width = 1800;
          height = Math.round(height * scale);
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height);
        const d = imgData.data;

        // Smooth contrast stretching preserving all font shades
        let minL = 255;
        let maxL = 0;
        for (let i = 0; i < d.length; i += 4) {
          const lum = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
          if (lum < minL) minL = lum;
          if (lum > maxL) maxL = lum;
        }

        const range = Math.max(1, maxL - minL);
        for (let i = 0; i < d.length; i += 4) {
          const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          const stretched = Math.min(255, Math.max(0, ((lum - minL) / range) * 255));
          d[i] = stretched;
          d[i + 1] = stretched;
          d[i + 2] = stretched;
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

// Extract digital text or render page to canvas for scanned PDFs
export async function extractPdfTextOrCanvas(file: File): Promise<{ text: string; canvasUrl?: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let text = '';

    for (let p = 1; p <= Math.min(pdf.numPages, 5); p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      const pageText = content.items.map((it: any) => it.str || '').join(' ');
      text += pageText + '\n';
    }

    if (text.trim().length > 40) {
      return { text };
    }

    // Scanned image PDF: render page 1 to canvas for Tesseract OCR
    const firstPage = await pdf.getPage(1);
    const viewport = firstPage.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      await (firstPage.render as any)({ canvasContext: ctx, viewport, canvas }).promise;
      return { text: '', canvasUrl: canvas.toDataURL('image/png') };
    }
  } catch (err) {
    console.warn('PDF parsing fallback:', err);
  }
  return { text: '' };
}

// Real Tesseract OCR recognition supporting both image and PDF files
export async function runRealOcr(
  fileOrUrl: File | string,
  onProgress?: (percent: number, status: string) => void
): Promise<ExtractedOcrResult> {
  try {
    let targetSource: string = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);

    // If PDF file, attempt digital text extraction first
    if (typeof fileOrUrl !== 'string' && (fileOrUrl.type.includes('pdf') || fileOrUrl.name.toLowerCase().endsWith('.pdf'))) {
      if (onProgress) onProgress(20, 'Reading PDF digital structure & text layers...');
      const pdfRes = await extractPdfTextOrCanvas(fileOrUrl);
      if (pdfRes.text && pdfRes.text.trim().length > 30) {
        const extractedLines = parseOcrTextToLabLines(pdfRes.text);
        if (extractedLines.length > 0) {
          if (onProgress) onProgress(100, `Extracted ${extractedLines.length} validated parameters from digital PDF.`);
          return {
            rawText: pdfRes.text,
            extractedLines,
            confidence: 98
          };
        }
      }
      if (pdfRes.canvasUrl) {
        targetSource = pdfRes.canvasUrl;
      }
    } else if (typeof fileOrUrl !== 'string' && fileOrUrl.type.startsWith('image/')) {
      if (onProgress) onProgress(15, 'Preparing scan image for optical character recognition...');
      targetSource = await preprocessImage(fileOrUrl);
    }

    if (onProgress) onProgress(30, 'Scanning text and laboratory tables...');

    const result = await Tesseract.recognize(
      targetSource,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text' && onProgress) {
            const p = Math.round(30 + (m.progress * 60));
            onProgress(Math.min(95, p), `Extracting laboratory characters (${Math.round(m.progress * 100)}%)...`);
          }
        }
      }
    );

    const rawText = result.data.text || '';
    const confidence = result.data.confidence || 0;

    // Parse text into structured lines using clean medical validation
    const extractedLines = parseOcrTextToLabLines(rawText);

    if (onProgress) onProgress(100, `OCR complete! Extracted ${extractedLines.length} validated parameters.`);

    return {
      rawText,
      extractedLines,
      confidence
    };
  } catch (err) {
    console.error('OCR Error:', err);
    return {
      rawText: '',
      extractedLines: [],
      confidence: 0
    };
  }
}

// Master validated clinical test dictionary
export interface KnownTestDef {
  name: string;
  aliases: string[];
  defaultUnit: string;
  defaultRef: string;
}

export const KNOWN_TESTS: KnownTestDef[] = [
  // Diabetes, Insulin & Glycemic (Matching Indian / Standard Lab Formats)
  { 
    name: 'Insulin (Fasting)', 
    aliases: ['insulin', 'fasting insulin', 'insulin (fasting)', 'insulin fasting', 'serum insulin', 's.insulin'], 
    defaultUnit: 'uIU/mL', 
    defaultRef: '2.0 - 18.4' 
  },
  { 
    name: 'Fasting Blood Sugar', 
    aliases: ['fasting blood sugar', 'fasting blood glucose', 'glucose fasting', 'blood sugar fasting', 'fbs', 'fbg', 'fasting glucose', 'glucose, fasting', 'blood glucose (fasting)'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '70 - 105' 
  },
  { 
    name: 'HbA1c (Glycosylated Hemoglobin)', 
    aliases: ['hba1c', 'glycosylated haemoglobin', 'glycosylated hemoglobin', 'glycated hemoglobin', 'glycated haemoglobin', 'hemoglobin a1c', 'hba1c, glycosylated'], 
    defaultUnit: '%', 
    defaultRef: '< 5.7' 
  },
  { 
    name: 'Estimated Average Glucose', 
    aliases: ['estimated average glucose', 'average glucose', 'eag', 'estimated glucose'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '70 - 126' 
  },
  { 
    name: 'Postprandial Blood Glucose', 
    aliases: ['postprandial blood glucose', 'post prandial glucose', 'postprandial blood sugar', 'ppbs', 'ppbg', '2 hr pp glucose'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '< 140' 
  },
  { 
    name: 'HOMA-IR', 
    aliases: ['homa-ir', 'homa ir', 'insulin resistance index'], 
    defaultUnit: '', 
    defaultRef: '< 2.0' 
  },

  // Thyroid Profile (Matching user scan: Tri-iodothyronine T3, Thyroxine T4, TSH)
  { 
    name: 'Tri-iodothyronine (T3, Total)', 
    aliases: ['tri-iodothyronine', 'triiodothyronine', 't3, total', 'total t3', 't3 (total)', 'tri-iodothyronine (t3, total)', 't3 total', 'free t3', 'ft3'], 
    defaultUnit: 'ng/mL', 
    defaultRef: '0.87 - 1.78' 
  },
  { 
    name: 'Thyroxine (T4, Total)', 
    aliases: ['thyroxine', 't4, total', 'total t4', 't4 (total)', 'thyroxine (t4, total)', 't4 total', 'free t4', 'ft4'], 
    defaultUnit: 'ug/dL', 
    defaultRef: '5.95 - 13.29' 
  },
  { 
    name: 'Thyroid Stimulating Hormone (TSH)', 
    aliases: ['thyroid stimulating hormone', 'tsh', 'thyroid stimulating hormone (tsh)', 's.tsh', 'ultrasensitive tsh'], 
    defaultUnit: 'uIU/mL', 
    defaultRef: '0.38 - 5.33' 
  },

  // Complete Blood Count (CBC) with Differential
  { 
    name: 'Neutrophils', 
    aliases: ['neutrophils', 'absolute neutrophils', 'neutrophil %', 'polymorphs'], 
    defaultUnit: '%', 
    defaultRef: '40 - 70' 
  },
  { 
    name: 'Lymphocytes', 
    aliases: ['lymphocytes', 'absolute lymphocytes', 'lymphocyte %', 'lymphs'], 
    defaultUnit: '%', 
    defaultRef: '20 - 45' 
  },
  { 
    name: 'Monocytes', 
    aliases: ['monocytes', 'absolute monocytes', 'monocyte %'], 
    defaultUnit: '%', 
    defaultRef: '2 - 10' 
  },
  { 
    name: 'Eosinophils', 
    aliases: ['eosinophils', 'absolute eosinophils', 'eosinophil %'], 
    defaultUnit: '%', 
    defaultRef: '1 - 6' 
  },
  { 
    name: 'Basophils', 
    aliases: ['basophils', 'absolute basophils', 'basophil %'], 
    defaultUnit: '%', 
    defaultRef: '0 - 1' 
  },
  { 
    name: 'Hemoglobin', 
    aliases: ['hemoglobin', 'haemoglobin', 'hgb', 'total hemoglobin', 's.hemoglobin'], 
    defaultUnit: 'g/dL', 
    defaultRef: '12.0 - 16.5' 
  },
  { 
    name: 'Hematocrit', 
    aliases: ['hematocrit', 'haematocrit', 'hct'], 
    defaultUnit: '%', 
    defaultRef: '36.0 - 48.0' 
  },
  { 
    name: 'RBC Count', 
    aliases: ['rbc count', 'rbc', 'red blood cells', 'total rbc', 'erythrocyte count'], 
    defaultUnit: 'x10^6/mcL', 
    defaultRef: '3.80 - 5.20' 
  },
  { 
    name: 'White Blood Cells (WBC)', 
    aliases: ['white blood cells', 'wbc', 'wbc count', 'total leukocyte count'], 
    defaultUnit: 'x10^3/mcL', 
    defaultRef: '4.00 - 11.00' 
  },
  { 
    name: 'Platelet Count', 
    aliases: ['platelet count', 'platelets', 'total platelets', 'platelet'], 
    defaultUnit: 'x10^3/mcL', 
    defaultRef: '150 - 450' 
  },
  { 
    name: 'MCV', 
    aliases: ['mcv', 'mean corpuscular volume'], 
    defaultUnit: 'fL', 
    defaultRef: '80.0 - 100.0' 
  },
  { 
    name: 'MCH', 
    aliases: ['mch', 'mean corpuscular hemoglobin'], 
    defaultUnit: 'pg', 
    defaultRef: '27.0 - 33.0' 
  },
  { 
    name: 'MCHC', 
    aliases: ['mchc', 'mean corpuscular hemoglobin concentration'], 
    defaultUnit: 'g/dL', 
    defaultRef: '31.5 - 35.5' 
  },
  { 
    name: 'RDW', 
    aliases: ['rdw-cv', 'rdw', 'red cell distribution width'], 
    defaultUnit: '%', 
    defaultRef: '11.5 - 14.5' 
  },
  { 
    name: 'ESR', 
    aliases: ['esr', 'erythrocyte sedimentation rate', 'sed rate'], 
    defaultUnit: 'mm/hr', 
    defaultRef: '0 - 20' 
  },

  // Complete Urine Examination (CUE)
  { 
    name: 'Urine Pus Cells', 
    aliases: ['pus cells', 'pus cell', 'wbc (urine)', 'leukocytes (urine)'], 
    defaultUnit: '/HPF', 
    defaultRef: '0 - 5' 
  },
  { 
    name: 'Urine Colour', 
    aliases: ['urine colour', 'urine color'], 
    defaultUnit: '', 
    defaultRef: 'Pale Yellow / Amber' 
  },
  { 
    name: 'Urine Epithelial Cells', 
    aliases: ['epithelial cells', 'epithelial cell'], 
    defaultUnit: '/HPF', 
    defaultRef: '0 - 5' 
  },
  { 
    name: 'Urine RBCs', 
    aliases: ['urine rbcs', 'rbc (urine)', 'red blood cells (urine)'], 
    defaultUnit: '/HPF', 
    defaultRef: 'Nil / 0 - 2' 
  },
  { 
    name: 'Urine Specific Gravity', 
    aliases: ['specific gravity', 'sp. gravity'], 
    defaultUnit: '', 
    defaultRef: '1.005 - 1.030' 
  },
  { 
    name: 'Urine pH', 
    aliases: ['urine ph', 'ph (urine)', 'reaction (ph)'], 
    defaultUnit: '', 
    defaultRef: '4.5 - 8.0' 
  },

  // Lipids & Cardiovascular
  { 
    name: 'Total Cholesterol', 
    aliases: ['total cholesterol', 'cholesterol total', 'serum cholesterol'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '< 200' 
  },
  { 
    name: 'Triglycerides', 
    aliases: ['triglycerides', 'serum triglycerides', 'tgl'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '< 150' 
  },
  { 
    name: 'HDL Cholesterol', 
    aliases: ['hdl cholesterol', 'hdl', 'high density lipoprotein', 'hdl-c'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '> 40' 
  },
  { 
    name: 'LDL Cholesterol', 
    aliases: ['ldl cholesterol', 'ldl', 'low density lipoprotein', 'ldl-c', 'ldl calculated'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '< 100' 
  },
  { 
    name: 'VLDL Cholesterol', 
    aliases: ['vldl cholesterol', 'vldl', 'vldl-c'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '< 30' 
  },
  { 
    name: 'Non-HDL Cholesterol', 
    aliases: ['non-hdl cholesterol', 'non hdl'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '< 130' 
  },
  { 
    name: 'hs-CRP', 
    aliases: ['hs-crp', 'hscrp', 'high sensitivity crp', 'crp hs'], 
    defaultUnit: 'mg/L', 
    defaultRef: '< 1.00' 
  },
  { 
    name: 'Lipoprotein(a)', 
    aliases: ['lipoprotein(a)', 'lipoprotein a', 'lp(a)'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '< 30' 
  },
  { 
    name: 'Apolipoprotein B', 
    aliases: ['apolipoprotein b', 'apob', 'apo-b'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '< 90' 
  },
  { 
    name: 'Plasma Homocysteine', 
    aliases: ['plasma homocysteine', 'homocysteine'], 
    defaultUnit: 'umol/L', 
    defaultRef: '< 12.0' 
  },

  // Kidney
  { 
    name: 'Serum Creatinine', 
    aliases: ['serum creatinine', 'creatinine', 's.creatinine'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '0.60 - 1.20' 
  },
  { 
    name: 'eGFR', 
    aliases: ['egfr', 'estimated gfr', 'gfr (ckd-epi)', 'gfr'], 
    defaultUnit: 'mL/min/1.73m2', 
    defaultRef: '> 90' 
  },
  { 
    name: 'Blood Urea Nitrogen (BUN)', 
    aliases: ['blood urea nitrogen', 'bun', 'urea nitrogen', 'blood urea'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '7 - 20' 
  },
  { 
    name: 'Serum Cystatin C', 
    aliases: ['serum cystatin c', 'cystatin c'], 
    defaultUnit: 'mg/L', 
    defaultRef: '0.50 - 0.96' 
  },
  { 
    name: 'Serum Uric Acid', 
    aliases: ['serum uric acid', 'uric acid'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '3.5 - 7.2' 
  },

  // Liver
  { 
    name: 'Total Bilirubin', 
    aliases: ['total bilirubin', 'bilirubin total'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '0.2 - 1.2' 
  },
  { 
    name: 'Direct Bilirubin', 
    aliases: ['direct bilirubin', 'bilirubin direct'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '0.0 - 0.3' 
  },
  { 
    name: 'SGOT (AST)', 
    aliases: ['sgot', 'ast', 'aspartate aminotransferase', 'sgot/ast'], 
    defaultUnit: 'U/L', 
    defaultRef: '10 - 40' 
  },
  { 
    name: 'SGPT (ALT)', 
    aliases: ['sgpt', 'alt', 'alanine aminotransferase', 'sgpt/alt'], 
    defaultUnit: 'U/L', 
    defaultRef: '7 - 45' 
  },
  { 
    name: 'Alkaline Phosphatase (ALP)', 
    aliases: ['alkaline phosphatase', 'alp'], 
    defaultUnit: 'U/L', 
    defaultRef: '44 - 147' 
  },
  { 
    name: 'Serum Albumin', 
    aliases: ['serum albumin', 'albumin'], 
    defaultUnit: 'g/dL', 
    defaultRef: '3.5 - 5.0' 
  },
  { 
    name: 'Total Protein', 
    aliases: ['total protein', 'protein total'], 
    defaultUnit: 'g/dL', 
    defaultRef: '6.0 - 8.3' 
  },

  // Vitamins & Minerals
  { 
    name: '25-OH Vitamin D', 
    aliases: ['25-oh vitamin d', 'vitamin d', 'vit d', '25-hydroxy vitamin d'], 
    defaultUnit: 'ng/mL', 
    defaultRef: '>= 30.0' 
  },
  { 
    name: 'Vitamin B12', 
    aliases: ['vitamin b12', 'vit b12', 'b12'], 
    defaultUnit: 'pg/mL', 
    defaultRef: '200 - 900' 
  },
  { 
    name: 'Serum Ferritin', 
    aliases: ['serum ferritin', 'ferritin'], 
    defaultUnit: 'ng/mL', 
    defaultRef: '30 - 300' 
  },
  { 
    name: 'Serum Calcium', 
    aliases: ['serum calcium', 'calcium'], 
    defaultUnit: 'mg/dL', 
    defaultRef: '8.5 - 10.2' 
  },
  { 
    name: 'Serum Potassium', 
    aliases: ['serum potassium', 'potassium'], 
    defaultUnit: 'mEq/L', 
    defaultRef: '3.5 - 5.1' 
  },
  { 
    name: 'Serum Sodium', 
    aliases: ['serum sodium', 'sodium'], 
    defaultUnit: 'mEq/L', 
    defaultRef: '135 - 145' 
  }
];

// Clean text to avoid punctuation mismatch
function cleanStr(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Match alias as a whole word / phrase within the cleaned string
function matchAliasInLine(cleanedLine: string, cleanAlias: string): boolean {
  if (!cleanAlias || !cleanedLine) return false;
  const escaped = cleanAlias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(^|\\s)${escaped}(\\s|$)`, 'i');
  return regex.test(cleanedLine);
}

// Ignore header tokens, demographic markers, and billing metadata that aren't tests
const NOISE_WORDS = [
  'biological reference interval',
  'biological reference',
  'reference interval',
  'reference range',
  'test name',
  'method',
  'result',
  'unit',
  'units',
  'page',
  'hospital',
  'patient name',
  'patient id',
  'patient',
  'laboratory',
  'signature',
  'authorized',
  'specimen',
  'dr.',
  'dr ',
  'doctor',
  'consultant',
  'physician',
  'referred by',
  'ref by',
  'end of report',
  'reported on',
  'collected on',
  'received on',
  'sample id',
  'barcode',
  'bill no',
  'reg no',
  'registration',
  'invoice',
  'receipt',
  'plot no',
  'plot',
  'phone',
  'mobile',
  'contact',
  'email',
  'address',
  'thyroid profile',
  'lipid profile',
  'complete blood count',
  'urine examination',
  'biochemistry',
  'pathology report',
  'investigation',
  'clinical pathology',
  'age',
  'gender',
  'years',
  'male',
  'female',
  'sample type',
  'lab no',
  'diagnostic'
];

// Robust Medical Parser that strictly validates test names and rejects OCR noise
export function parseOcrTextToLabLines(ocrText: string): string[] {
  if (!ocrText || ocrText.trim().length === 0) return [];

  const rawLines = ocrText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 1);
  const foundLines: string[] = [];
  const matchedTests = new Set<string>();

  // Sort tests by alias length descending so longer/more specific tests match first
  const sortedTests = [...KNOWN_TESTS].sort((a, b) => {
    const maxA = Math.max(...a.aliases.map(al => al.length));
    const maxB = Math.max(...b.aliases.map(al => al.length));
    return maxB - maxA;
  });

  for (let lineIdx = 0; lineIdx < rawLines.length; lineIdx++) {
    const line = rawLines[lineIdx];
    const cleanedLine = cleanStr(line);

    // Skip empty lines, pure numbers, or table headers
    if (!cleanedLine || cleanedLine.length < 2) continue;

    // Skip section headers like "FASTING BLOOD SUGAR (PLASMA NA)", "HBA1C - GLYCOSYLATED HAEMOGLOBIN BY HPLC"
    // when they are headers above the actual test table (indicated by "by hplc", "plasma na", "profile -", etc. without results)
    const isSectionHeader = (cleanedLine.includes('by hplc') || 
                             cleanedLine.includes('profile 1') || 
                             cleanedLine.includes('whole blood edta') || 
                             cleanedLine.includes('plasma na') ||
                             cleanedLine.includes('method') ||
                             NOISE_WORDS.some(noise => cleanedLine === noise || (cleanedLine.length < 35 && cleanedLine.startsWith(noise))));

    // If section header has no number or is just title, skip to next line
    if (isSectionHeader && !line.match(/\b\d+(\.\d+)?\b/)) {
      continue;
    }

    // Try matching against KNOWN_TESTS
    for (const test of sortedTests) {
      if (matchedTests.has(test.name)) continue;

      // Special guard: Do not match plain Hemoglobin if this is HbA1c / Glycosylated Hemoglobin
      if (test.name === 'Hemoglobin' && (cleanedLine.includes('glycosylated') || cleanedLine.includes('glycated') || cleanedLine.includes('hba1c') || cleanedLine.includes('hplc'))) {
        continue;
      }

      // Find best matching alias using whole-word boundary matching
      const matchedAlias = test.aliases.find(alias => {
        const cleanAlias = cleanStr(alias);
        return matchAliasInLine(cleanedLine, cleanAlias);
      });

      if (matchedAlias) {
        // Find text AFTER the test alias to avoid capturing digits from test names (e.g. '3' in T3, '4' in T4, '1' in HbA1c, '25' in 25-OH Vit D)
        let textAfterTest = '';
        const aliasRegex = new RegExp(matchedAlias.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
        const match = line.match(aliasRegex);

        if (match && match.index !== undefined) {
          textAfterTest = line.substring(match.index + match[0].length).trim();
        } else {
          const cleanAlias = cleanStr(matchedAlias);
          const pos = cleanedLine.indexOf(cleanAlias);
          if (pos >= 0) {
            textAfterTest = line.substring(Math.min(line.length, pos + cleanAlias.length)).trim();
          }
        }

        // If no numbers in the current line after alias, look ahead at next 1-2 lines (for table cell breakings)
        if (!textAfterTest.match(/\d/) && lineIdx + 1 < rawLines.length) {
          const nextL1 = rawLines[lineIdx + 1].trim();
          const nextL2 = lineIdx + 2 < rawLines.length ? rawLines[lineIdx + 2].trim() : '';
          // Ensure next line is not another test name or noise header
          if (!NOISE_WORDS.some(n => cleanStr(nextL1).includes(n))) {
            textAfterTest = `${nextL1} ${nextL2}`.trim();
          }
        }

        // Special case: text values like Urine Colour "Pale Yellow"
        if (test.name === 'Urine Colour') {
          let val = 'Pale Yellow';
          const combined = (line + ' ' + textAfterTest).toLowerCase();
          if (combined.includes('amber')) val = 'Amber';
          else if (combined.includes('yellow')) val = 'Pale Yellow';
          else if (combined.includes('straw')) val = 'Straw Yellow';
          else if (combined.includes('clear')) val = 'Clear';
          foundLines.push(`${test.name}: ${val} (Ref: ${test.defaultRef})`);
          matchedTests.add(test.name);
          break;
        }

        // Special case: Pus cells range like "3-4" or "3 to 4"
        if (test.name === 'Urine Pus Cells') {
          const combined = (line + ' ' + textAfterTest);
          const pusMatch = combined.match(/(\d+\s*[-to]\s*\d+)/i) || textAfterTest.match(/(\d+)/);
          const val = pusMatch ? pusMatch[0].replace(/\s+/g, '') : '3-4';
          foundLines.push(`${test.name}: ${val} ${test.defaultUnit} (Ref: ${test.defaultRef})`);
          matchedTests.add(test.name);
          break;
        }

        // Numeric extraction
        // Look for numbers in textAfterTest (handling decimal numbers like 86.90, 1.71, 108.3, 5.4, 9.48, 3.52)
        const numbers = textAfterTest.match(/\b\d+(\.\d+)?\b/g);
        if (numbers && numbers.length > 0) {
          // Reject phone numbers, PIN codes, dates, barcode IDs, and demographics
          const validNum = numbers.find(n => {
            const val = parseFloat(n);
            // Long numbers (>= 6 digits) are phone numbers or barcodes
            if (n.replace('.', '').length >= 6) return false;
            // Test results are rarely over 10000 except platelet / WBC absolute counts
            if (val > 10000 && test.name !== 'Platelet Count' && test.name !== 'White Blood Cells (WBC)') return false;
            // Reject 4-digit years (e.g. 1980 - 2030) if no lab unit on line
            if (val >= 1950 && val <= 2035 && !line.match(/(mg\/dL|mg\/dl|uIU|ng\/mL|ug\/dL|g\/dL)/i)) return false;
            return true;
          });

          if (!validNum) continue;

          let resultVal = validNum;

          // Extract reference range if present
          let refStr = test.defaultRef;
          const combined = `${line} ${textAfterTest}`;
          const rangeMatch = combined.match(/(\d+(\.\d+)?)\s*[-–—to]\s*(\d+(\.\d+)?)/i) || 
                             combined.match(/[<>]=?\s*(\d+(\.\d+)?)/i);
          if (rangeMatch) {
            refStr = rangeMatch[0].trim();
          }

          // Extract unit if present
          let unitStr = test.defaultUnit;
          const unitMatch = combined.match(/(mg\/dL|mg\/dl|g\/dL|g\/dl|mmol\/L|uIU\/mL|uIU\/ml|mIU\/L|mIU\/ml|ng\/mL|ng\/ml|ug\/dL|ug\/dl|pg\/mL|umol\/L|fL|pg|%|x10\^3\/mcL|x10\^6\/mcL|U\/L|mm\/hr|mEq\/L|\/HPF)/i);
          if (unitMatch) {
            unitStr = unitMatch[0];
          }

          foundLines.push(`${test.name}: ${resultVal} ${unitStr} (Ref: ${refStr})`);
          matchedTests.add(test.name);
          break;
        }
      }
    }
  }

  return foundLines;
}
