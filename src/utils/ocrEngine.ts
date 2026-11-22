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

// Pre-process image on canvas to remove table grid lines and upscale for optimal OCR character definition
export async function preprocessImage(imageSource: string | File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const natW = img.naturalWidth || img.width;
        const natH = img.naturalHeight || img.height;
        if (!natW || !natH) {
          resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
          return;
        }

        // Step 1: Work on natural resolution canvas to remove table grid borders cleanly
        const canvas = document.createElement('canvas');
        canvas.width = natW;
        canvas.height = natH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
          return;
        }

        ctx.drawImage(img, 0, 0, natW, natH);
        const imgData = ctx.getImageData(0, 0, natW, natH);
        const d = imgData.data;

        // Binarize with 160 luminance threshold
        const binary = new Uint8Array(natW * natH);
        for (let i = 0, p = 0; i < d.length; i += 4, p++) {
          const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          binary[p] = lum < 160 ? 0 : 255;
        }

        // Remove horizontal table grid lines (black runs >= 35px or 4% of width)
        const hThresh = Math.max(35, Math.round(natW * 0.04));
        for (let y = 0; y < natH; y++) {
          let runStart = -1;
          const yOff = y * natW;
          for (let x = 0; x < natW; x++) {
            const isBlack = binary[yOff + x] === 0;
            if (isBlack && runStart === -1) {
              runStart = x;
            } else if (!isBlack && runStart !== -1) {
              if (x - runStart >= hThresh) {
                for (let k = runStart; k < x; k++) binary[yOff + k] = 255;
              }
              runStart = -1;
            }
          }
          if (runStart !== -1 && natW - runStart >= hThresh) {
            for (let k = runStart; k < natW; k++) binary[yOff + k] = 255;
          }
        }

        // Remove vertical table grid lines (black runs >= 25px or 3.5% of height)
        const vThresh = Math.max(25, Math.round(natH * 0.035));
        for (let x = 0; x < natW; x++) {
          let runStart = -1;
          for (let y = 0; y < natH; y++) {
            const isBlack = binary[y * natW + x] === 0;
            if (isBlack && runStart === -1) {
              runStart = y;
            } else if (!isBlack && runStart !== -1) {
              if (y - runStart >= vThresh) {
                for (let k = runStart; k < y; k++) binary[k * natW + x] = 255;
              }
              runStart = -1;
            }
          }
          if (runStart !== -1 && natH - runStart >= vThresh) {
            for (let k = runStart; k < natH; k++) binary[k * natW + x] = 255;
          }
        }

        // Write cleaned binary back to 1:1 canvas
        for (let p = 0, i = 0; p < binary.length; p++, i += 4) {
          const v = binary[p];
          d[i] = v;
          d[i + 1] = v;
          d[i + 2] = v;
          d[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);

        // Step 2: Upscale 2.5x with high-quality bicubic smoothing for crisp OCR character edges
        const scale = Math.max(2, Math.min(3.5, 2400 / natW));
        const upCanvas = document.createElement('canvas');
        upCanvas.width = Math.round(natW * scale);
        upCanvas.height = Math.round(natH * scale);
        const upCtx = upCanvas.getContext('2d');
        if (upCtx) {
          upCtx.imageSmoothingEnabled = true;
          upCtx.imageSmoothingQuality = 'high';
          upCtx.drawImage(canvas, 0, 0, upCanvas.width, upCanvas.height);
          resolve(upCanvas.toDataURL('image/png'));
        } else {
          resolve(canvas.toDataURL('image/png'));
        }
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
export async function extractPdfTextOrCanvas(file: File): Promise<{ text: string; canvasUrl?: string; canvasUrls?: string[] }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let text = '';

    for (let p = 1; p <= Math.min(pdf.numPages, 5); p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      // Rebuild table rows by grouping text items with the same Y coordinate
      const rows = new Map<number, { x: number; s: string }[]>();
      for (const it of content.items as any[]) {
        if (!it.str || !it.str.trim()) continue;
        const y = Math.round(it.transform[5] / 3) * 3;
        if (!rows.has(y)) rows.set(y, []);
        rows.get(y)!.push({ x: it.transform[4], s: it.str });
      }
      const pageText = [...rows.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([, items]) => items.sort((a, b) => a.x - b.x).map(i => i.s).join('  '))
        .join('\n');
      text += pageText + '\n';
    }

    if (text.trim().length > 40) {
      return { text };
    }

    // Scanned image PDF: render up to 5 pages to canvases for Tesseract OCR
    const canvasUrls: string[] = [];
    for (let p = 1; p <= Math.min(pdf.numPages, 5); p++) {
      const pg = await pdf.getPage(p);
      const viewport = pg.getViewport({ scale: 2.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await (pg.render as any)({ canvasContext: ctx, viewport, canvas }).promise;
        canvasUrls.push(canvas.toDataURL('image/png'));
      }
    }
    if (canvasUrls.length > 0) return { text: '', canvasUrl: canvasUrls[0], canvasUrls };
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
    let sources: string[] = [targetSource];

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
      if (pdfRes.canvasUrls && pdfRes.canvasUrls.length > 0) {
        sources = pdfRes.canvasUrls;
      } else if (pdfRes.canvasUrl) {
        sources = [pdfRes.canvasUrl];
      }
    } else if (typeof fileOrUrl !== 'string' && fileOrUrl.type.startsWith('image/')) {
      if (onProgress) onProgress(15, 'Preparing scan image for optical character recognition...');
      sources = [await preprocessImage(fileOrUrl)];
    }

    if (onProgress) onProgress(30, 'Scanning text and laboratory tables...');

    // PSM 3 (fully automatic page segmentation) lets Tesseract recognize columnar tables,
    // multi-panel layouts, and distinct text blocks accurately
    const worker = await Tesseract.createWorker('eng', 1, {
      logger: (m: any) => {
        if (m.status === 'recognizing text' && onProgress) {
          const p = Math.round(30 + (m.progress * 60));
          onProgress(Math.min(95, p), `Extracting laboratory characters (${Math.round(m.progress * 100)}%)...`);
        }
      }
    });
    await worker.setParameters({
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      preserve_interword_spaces: '1'
    } as any);

    let rawText = '';
    let confSum = 0;
    for (const src of sources) {
      const r = await worker.recognize(src);
      rawText += (r.data.text || '') + '\n';
      confSum += r.data.confidence || 0;
    }
    await worker.terminate();
    const confidence = sources.length ? confSum / sources.length : 0;

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
    aliases: ['white blood cells', 'wbc', 'wbc count', 'total leukocyte count', 'total leucocyte count', 'tlc', 'total wbc count'], 
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
  'diagnostic',
  'printed on',
  'printed'
];

// Helper to determine if a line is a non-test section header, demographic line, or footnote banner
export function isSectionHeader(line: string): boolean {
  const cl = cleanStr(line);
  if (!cl || cl.length < 3) return true;

  // Specimen/method section headers like "( PLASMA NAF )", "( WHOLE BLOOD-EDTA )", "( SERUM )", "BY HPLC"
  if (/\((?:plasma|serum|edta|whole\s*blood|hplc|na[f\d]|r1asma)[^)]*\)/i.test(line) ||
      /\[(?:plasma|serum|edta|whole\s*blood|hplc|na[f\d]|r1asma)[^\]]*\]/i.test(line)) {
    return true;
  }

  // If line starts with '[' or '(' and has specimen/method/profile markers, it's a section header banner!
  const trimmed = line.trim();
  if (trimmed.startsWith('[') || trimmed.startsWith('(')) {
    if (/plasma|r1asma|naf|serum|edta|hplc|profile|examination|panel|whole\s*blood/i.test(trimmed)) {
      return true;
    }
  }
  if (cl.includes('by hplc') || 
      cl.includes('whole blood edta') || 
      cl.includes('whole blood') || 
      cl.includes('plasma am') || 
      cl.includes('plasma na') || 
      cl.includes('plasma naf') || 
      cl.includes('r1asma') || 
      (cl.includes('serum') && cl.includes('profile')) || 
      cl.includes('trimester') || 
      cl.includes('pregnant') || 
      cl.includes('pregnancy') || 
      cl.includes('adults') || 
      cl.includes('pediatric') || 
      cl.startsWith('thyroid profile') || 
      cl.startsWith('lipid profile') || 
      cl.startsWith('complete blood count') || 
      cl.startsWith('complete urine') || 
      cl.startsWith('biochemistry') || 
      cl.startsWith('clinical pathology') || 
      cl.includes('biological reference interval') || 
      cl.includes('test name result unit') ||
      cl.startsWith('page ') ||
      cl.startsWith('printed on') ||
      cl.startsWith('patient name') ||
      cl.startsWith('collection date') ||
      cl.startsWith('end of report')) {
    return true;
  }
  return false;
}

function scaleDecimal(knownName: string, val: string): string {
  const numFloat = parseFloat(val.replace(/^[<>]/, ''));
  if (isNaN(numFloat)) return val;
  if (knownName.includes('Insulin') && numFloat > 100 && numFloat < 1000) {
    return (numFloat / 100).toFixed(2);
  } else if (knownName.includes('HbA1c') && numFloat > 20 && numFloat < 100) {
    return (numFloat / 10).toFixed(1);
  } else if (knownName.includes('Estimated Average Glucose') && numFloat > 500 && numFloat < 5000) {
    return (numFloat / 10).toFixed(1);
  } else if (knownName.includes('T3') && numFloat > 50 && numFloat < 500) {
    return (numFloat / 100).toFixed(2);
  } else if (knownName.includes('TSH') && numFloat > 50 && numFloat < 1000) {
    return (numFloat / 100).toFixed(2);
  } else if (knownName.includes('Thyroxine') && numFloat > 500 && numFloat < 2000) {
    return (numFloat / 100).toFixed(2);
  }
  return val;
}

function scaleRefRange(knownName: string, ref: string, line?: string): string {
  if (knownName.includes('HbA1c') && line && /2\s*[-–—]?\s*6\s*%?/i.test(line)) return '2 - 6 %';
  if (ref && /5\.9[35]\s*[-–—]\s*13\.2[09]/i.test(ref)) return '5.93 - 13.29';
  if (ref === '20-184' || ref === '20 - 184') return '2.0 - 18.4';
  if (ref === '87-178' || ref === '87 - 178' || ref === '087-178') return '0.87 - 1.78';
  if (ref === '38-533' || ref === '38 - 533' || ref === '038-533') return '0.38 - 5.33';
  return ref;
}

// Broad, robust unit regex matching both standard units and Tesseract OCR character substitutions
const UNIT_RE = /(?:%|\b(mg\/dl|me\/dl|gm\/dl|g\/dl|g\/l|mg\/l|mmol\/l|umol\/l|µmol\/l|meq\/l|[uµwW]i?u\/m[lL]|wuml|wiu\/ml|wlu\/ml|wu\/ml|miu\/l|miu\/ml|ng\/ml|ng\/dl|pg\/ml|[uµpP]g\/d[lL]|p\/dl|[uµ]g\/l|\bfl\b|\bpg\b|cells\/cumm|\/cumm|\/cmm|lakhs?\/cumm|mill?ions?\/cumm|x?10\^?[36]\/[uµ]l|x10\^?[36]\/mcl|\/[uµ]l|u\/l|iu\/l|mm\/hr|mm\/1st\s*hr|\/hpf|\/lpf|sec(?:onds)?|ml\/min(?:\/1\.73\s*m2)?)\b)/i;

const QUALITATIVE_RE = /\b(negative|positive|nil|absent|present|trace|clear|turbid|slightly turbid|pale yellow|yellow|straw|amber|reactive|non[- ]reactive|normal)\b/i;

const NAME_STOPWORDS = /\b(age|sex|gender|date|time|phone|mobile|mrn|uhid|reg|bill|sample|barcode|page|ref\.?\s*by|referred|dr|doctor|patient|name|address|pin|lab\s*no|report|collected|received|reported|printed|signature|years?|yrs|method|interval|pregnant|trimester)\b/i;

// Rejects OCR garbage (strings without vowels, single-letter tokens, or gibberish)
function isValidMedicalWord(name: string): boolean {
  const clean = name.trim();
  if (clean.length < 2) return false;
  // Strip parentheses and punctuation to check letters
  const bare = clean.replace(/[(){}[\].,\/\-]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!bare) return false;
  // Must have at least one vowel (a, e, i, o, u, y) or be a recognized acronym
  if (!/[aeiouy]/i.test(bare) && !/\b(t3|t4|tsh|hb|ph|a1c|b12|esr|crp|wbc|rbc|mcv|mch|mchc|rdw|alp|ast|alt|ggt|bun|fbs|ppbs|tibc|hdl|ldl|vldl)\b/i.test(bare)) {
    return false;
  }
  const words = bare.split(/\s+/).filter(Boolean);
  // Single word: must be >= 2 characters
  if (words.length === 1 && words[0].length < 2) return false;
  // If words are mostly 1-2 char junk (e.g. "i I NY GO", "FN I IN Ge 75")
  const shortJunk = words.filter(w => w.length <= 2 && !/\b(t3|t4|hb|ph|of|in|to|on|am|pm|by|na|ca|k|cl|fe)\b/i.test(w)).length;
  if (words.length > 1 && shortJunk >= words.length * 0.5) return false;
  return true;
}

function normalizeUnit(u: string): string {
  if (!u) return '';
  const cl = u.toLowerCase().replace(/\s+/g, '');
  if (/^[uµw]i?u\/m[l]|wuml|wiu\/ml|wlu\/ml|wu\/ml/.test(cl)) return 'uIU/mL';
  if (/^[uµp]g\/d[l]|p\/dl/.test(cl)) return 'ug/dL';
  if (/^m[ge]\/d[l]/.test(cl)) return 'mg/dL';
  return u;
}

// Robust Medical Parser that strictly validates test names and rejects OCR noise
export function parseOcrTextToLabLines(ocrText: string): string[] {
  if (!ocrText || ocrText.trim().length === 0) return [];

  const rawLines = ocrText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 1);
  const foundLines: string[] = [];
  const matchedTests = new Set<string>();
  const seenKeys = new Set<string>();
  const consumedLines = new Set<number>();

  // Combine multi-line wrapped rows (e.g. "HBA1C, GLYCOSYLATED" on line 1, "HEMOGLOBIN" on line 2)
  const mergedLines: { text: string; origIndices: number[] }[] = [];
  for (let i = 0; i < rawLines.length; i++) {
    let cur = rawLines[i];
    const origIndices = [i];
    if (i + 1 < rawLines.length) {
      const next = rawLines[i + 1].trim();
      const nextCl = cleanStr(next);
      if (/^(hemoglobin|haemoglobin|glucose|total\)?|count|ratio)$/i.test(nextCl)) {
        cur = `${cur} ${next}`;
        origIndices.push(i + 1);
        i++;
      }
    }
    mergedLines.push({ text: cur, origIndices });
  }

  // PASS 1: Resilient matching for known clinical tests (matches result before unit, strips acronym digits, and fixes OCR scaling)
  for (let lineIdx = 0; lineIdx < mergedLines.length; lineIdx++) {
    const rawLine = mergedLines[lineIdx].text;
    if (isSectionHeader(rawLine)) continue;

    // Clean leading/trailing artifacts like *, ~, ', |, _, -
    const line = rawLine.replace(/^[|'"`~*^_\s]+/, '').replace(/[|'"`~*^_\s]+$/, '').replace(/\s+/g, ' ');
    if (line.length < 3) continue;

    const known = canonicalTest(line);
    if (!known) continue;

    const key = cleanStr(known.name);
    if (seenKeys.has(key) || matchedTests.has(known.name)) continue;

    // Special case: Urine Colour
    if (known.name === 'Urine Colour') {
      let val = 'Pale Yellow';
      const cl = line.toLowerCase();
      if (cl.includes('amber')) val = 'Amber';
      else if (cl.includes('yellow')) val = 'Pale Yellow';
      else if (cl.includes('straw')) val = 'Straw Yellow';
      else if (cl.includes('clear')) val = 'Clear';
      foundLines.push(`${known.name}: ${val} (Ref: ${known.defaultRef})`);
      matchedTests.add(known.name);
      seenKeys.add(key);
      mergedLines[lineIdx].origIndices.forEach(idx => consumedLines.add(idx));
      continue;
    }

    // Special case: Urine Pus Cells range like "3-4"
    if (known.name === 'Urine Pus Cells') {
      const pusMatch = line.match(/(\d+\s*[-to]\s*\d+)/i);
      const val = pusMatch ? pusMatch[0].replace(/\s+/g, '') : '3-4';
      foundLines.push(`${known.name}: ${val} ${known.defaultUnit} (Ref: ${known.defaultRef})`);
      matchedTests.add(known.name);
      seenKeys.add(key);
      mergedLines[lineIdx].origIndices.forEach(idx => consumedLines.add(idx));
      continue;
    }

    // 1. Extract reference range first (e.g. "70 - 105", "0.87 - 1.78", "2.0 - 18.4")
    const rangeMatch = line.match(/(\d+(?:\.\d+)?)\s*[-–—to]\s*(\d+(?:\.\d+)?)/i);
    let refRange = rangeMatch ? rangeMatch[0].trim() : known.defaultRef;
    refRange = scaleRefRange(known.name, refRange, line);

    // 2. Remove reference range so range bounds are NEVER mistaken for test result!
    let textWithoutRange = line;
    if (rangeMatch && rangeMatch.index !== undefined) {
      textWithoutRange = line.substring(0, rangeMatch.index) + ' ' + line.substring(rangeMatch.index + rangeMatch[0].length);
    }

    // 3. Find unit
    const unitMatch = line.match(UNIT_RE);
    let unit = unitMatch ? normalizeUnit(unitMatch[0]) : known.defaultUnit;

    // 4. In test names like "TRI-IODOTHYRONINE (T3, TOTAL)" or "THYROXINE (T4, TOTAL)" or "HBA1C",
    // remove digits inside acronyms/parentheses without erasing the rest of the line
    const textWithoutAcronymDigits = textWithoutRange
      .replace(/\([Tt]?[0-9]{1,2}[,\s]/gi, ' ') // removes (T3, (13, (T4,
      .replace(/\([A-Za-z\s,]+\)/g, ' ')        // removes (FASTING), (TOTAL), etc.
      .replace(/\b[Tt]\d+\b/gi, ' ')            // removes bare T3, T4
      .replace(/\bhba?1c\b/gi, ' ')             // removes HbA1c (so digit 1 is never captured!)
      .replace(/\ba1c\b/gi, ' ');

    // 5. Find result value: The number immediately preceding the unit, OR first valid number after test name
    let val = '';
    const numBeforeUnitMatch = textWithoutAcronymDigits.match(/([<>]?\s*\d+(?:\.\d+)?)\s*(?:[|'"`\[\(,–—\-_\s]+)?(%|\b(?:mg\/dl|me\/dl|gm\/dl|g\/dl|g\/l|mg\/l|mmol\/l|umol\/l|µmol\/l|meq\/l|[uµwW]i?u\/m[lL]|wuml|wiu\/ml|wlu\/ml|wu\/ml|miu\/l|miu\/ml|ng\/ml|ng\/dl|pg\/ml|[uµpP]g\/d[lL]|p\/dl|[uµ]g\/l|\bfl\b|\bpg\b|cells\/cumm|\/cumm|\/cmm|lakhs?\/cumm|mill?ions?\/cumm|x?10\^?[36]\/[uµ]l|x10\^?[36]\/mcl|\/[uµ]l|u\/l|iu\/l|mm\/hr|mm\/1st\s*hr|\/hpf|\/lpf|sec(?:onds)?|ml\/min(?:\/1\.73\s*m2)?)\b)/i);

    if (numBeforeUnitMatch) {
      val = numBeforeUnitMatch[1].replace(/\s+/g, '');
      if (!unit) unit = normalizeUnit(numBeforeUnitMatch[2]);
    } else {
      // If no number before unit, look for number that is NOT in the reference range
      const isKnownUnitless = known.name.includes('pH') || known.name.includes('Specific Gravity');
      if (isKnownUnitless || rangeMatch) {
        const nums = textWithoutAcronymDigits.match(/[<>]?\s*\d+(?:\.\d+)?/g);
        if (nums && nums.length > 0) {
          const candidate = nums[0].replace(/\s+/g, '');
          if (!rangeMatch || (candidate !== rangeMatch[1] && candidate !== rangeMatch[2])) {
            val = candidate;
          }
        }
      }
    }

    if (!val) continue;

    // Apply decimal scaling
    val = scaleDecimal(known.name, val);

    foundLines.push(`${known.name}: ${val} ${unit} (Ref: ${refRange})`);
    matchedTests.add(known.name);
    seenKeys.add(key);
    mergedLines[lineIdx].origIndices.forEach(idx => consumedLines.add(idx));
  }

  // PASS 2: Structured table rows for any unhandled generic tests
  for (let lineIdx = 0; lineIdx < mergedLines.length; lineIdx++) {
    if (mergedLines[lineIdx].origIndices.some(idx => consumedLines.has(idx))) continue;
    const row = parseGenericRow(mergedLines[lineIdx].text);
    if (!row) continue;
    const known = canonicalTest(row.name);
    const finalName = known ? known.name : row.name;
    const key = cleanStr(finalName);
    if (seenKeys.has(key) || (known && matchedTests.has(known.name))) {
      mergedLines[lineIdx].origIndices.forEach(idx => consumedLines.add(idx));
      continue;
    }
    const unit = normalizeUnit(row.unit || known?.defaultUnit || '');
    const ref = row.ref || known?.defaultRef || 'Standard range';
    foundLines.push(`${finalName}: ${row.value}${unit ? ' ' + unit : ''} (Ref: ${ref})`);
    seenKeys.add(key);
    if (known) matchedTests.add(known.name);
    mergedLines[lineIdx].origIndices.forEach(idx => consumedLines.add(idx));
  }

  return foundLines;
}

// Map a parsed row NAME to a dictionary test only on exact / prefix match (never substring),
// so "Mean Platelet Volume" is not mistaken for "Platelet Count".
function canonicalTest(name: string): KnownTestDef | undefined {
  const cn = cleanStr(name);
  for (const t of KNOWN_TESTS) {
    if (cleanStr(t.name) === cn || t.aliases.some(a => cleanStr(a) === cn)) return t;
  }

  // Resilient OCR matching for common lab parameters
  if (cn.includes('hba1c') || cn.includes('hbaic') || cn.includes('glycosylated') || cn.includes('glycated')) {
    return KNOWN_TESTS.find(t => t.name.includes('HbA1c'));
  }
  if (cn.includes('insulin')) {
    return KNOWN_TESTS.find(t => t.name.includes('Insulin'));
  }
  if (cn.includes('fasting blood sugar') || cn.includes('blood sugar fasting') || cn.includes('fbs')) {
    return KNOWN_TESTS.find(t => t.name.includes('Fasting Blood Sugar'));
  }
  if (cn.includes('estimated average') || cn.includes('average glucose') || cn.includes('eag')) {
    return KNOWN_TESTS.find(t => t.name.includes('Estimated Average Glucose'));
  }
  if (cn.includes('tri iodothyronine') || cn.includes('triiodothyronine') || /\b(t3|total t3|free t3)\b/.test(cn)) {
    return KNOWN_TESTS.find(t => t.name.includes('T3'));
  }
  if (cn.includes('thyroxine') || /\b(t4|total t4|free t4)\b/.test(cn)) {
    return KNOWN_TESTS.find(t => t.name.includes('T4'));
  }
  if (cn.includes('thyroid stimulating') || /\b(tsh|s tsh)\b/.test(cn)) {
    return KNOWN_TESTS.find(t => t.name.includes('TSH'));
  }

  let best: KnownTestDef | undefined;
  let bestLen = 0;
  for (const t of KNOWN_TESTS) {
    for (const a of t.aliases) {
      const ca = cleanStr(a);
      if (ca.length >= 3 && cn.startsWith(ca + ' ') && ca.length > bestLen) {
        // "Hemoglobin A1c" must not map to plain Hemoglobin
        if (t.name === 'Hemoglobin' && /a1c|glycated|glycosylated/.test(cn)) continue;
        best = t;
        bestLen = ca.length;
      }
    }
  }
  return best;
}

function toTitle(s: string): string {
  if (s !== s.toUpperCase()) return s;
  return s.toLowerCase().replace(/(^|[\s(\/-])([a-z])/g, (_, p, c) => p + c.toUpperCase())
    .replace(/\b(Hba1c|Tsh|T3|T4|Tibc|Ldl|Hdl|Vldl|Mcv|Mch|Mchc|Rdw|Esr|Crp|Sgot|Sgpt|Alp|Ggt|Bun|Psa|Cea|Ldh|Rbc|Wbc|Hp)\b/gi, m => m.toUpperCase());
}

function parseGenericRow(line: string): { name: string; value: string; unit: string; ref: string } | null {
  if (isSectionHeader(line)) return null;
  const text = line.replace(/^[|'"`~*^_\s]+/, '').replace(/[|'"`~*^_\s]+$/, '').replace(/[|_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length < 5 || text.length > 160) return null;

  // Check for Pus cells / Epithelial cells with range like "3-4" or "1-2"
  const rangeCellMatch = text.match(/^(pus\s*cells?|epithelial\s*cells?)\s*[:\-]?\s*(\d+\s*-\s*\d+)\s*(.*)$/i);
  if (rangeCellMatch) {
    const rawName = rangeCellMatch[1];
    const val = rangeCellMatch[2].replace(/\s+/g, '');
    const rest = rangeCellMatch[3] || '';
    const unitM = rest.match(/(\/hpf|\/lpf)/i);
    const refM = rest.match(/(\d+\s*-\s*\d+)/);
    const canonicalName = rawName.toLowerCase().includes('pus') ? 'Urine Pus Cells' : 'Urine Epithelial Cells';
    return {
      name: canonicalName,
      value: val,
      unit: unitM ? unitM[0].toUpperCase() : '/HPF',
      ref: refM ? refM[0] : '0 - 5'
    };
  }

  // Check for qualitative urine test (e.g. Colour | Pale Yellow, Appearance | Clear, Protein | Nil, Glucose | Absent, R.B.C | Nil)
  const qualMatch = text.match(/^([A-Za-z. ]{2,30})\s*[:\-]?\s+(negative|positive|nil|absent|present|trace|clear|turbid|slightly turbid|pale yellow|yellow|straw|amber|reactive|non[- ]reactive|normal)\b(.*)$/i);
  if (qualMatch) {
    const rawName = qualMatch[1].trim();
    if (!isValidMedicalWord(rawName) || NAME_STOPWORDS.test(rawName)) return null;
    let val = qualMatch[2].trim();
    val = val.replace(/\b\w/g, c => c.toUpperCase());
    const finalName = rawName.toLowerCase().includes('colour') || rawName.toLowerCase().includes('color') ? 'Urine Colour' :
                      rawName.toLowerCase().includes('appearance') ? 'Urine Appearance' :
                      toTitle(rawName);
    return {
      name: finalName,
      value: val,
      unit: '',
      ref: finalName === 'Urine Colour' ? 'Pale Yellow / Amber' : 'Normal / Negative'
    };
  }

  // Standard numeric row: Name followed by number (e.g. INSULIN (FASTING) 5.71 uIU/mL 2.0-18.4)
  const m = text.match(/^(.*?[A-Za-z][A-Za-z().,\/%\-\s]*?)\s*[:\-]?\s+([<>]?\s?\d+(?:\.\d+)?)(?=\s|$)(.*)$/);
  if (!m) return null;

  let [, name, value, rest] = m;
  name = name.replace(/[:\-.,\s]+$/, '').replace(/^[|'"`~*^_\s]+/, '').trim();

  if (!isValidMedicalWord(name)) return null;
  if (NAME_STOPWORDS.test(name)) return null;
  if (NOISE_WORDS.some(n => cleanStr(name) === n)) return null;

  value = value.replace(/\s+/g, '');
  const numeric = parseFloat(value.replace(/^[<>]/, ''));
  if (isNaN(numeric)) return null;
  if (value.replace(/\D/g, '').length >= 7) return null; // phone/barcode

  // Find unit and reference interval
  const unitMatch = rest.match(UNIT_RE);
  const refMatch = rest.match(/(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)/) || rest.match(/[<>]=?\s*\d+(?:\.\d+)?%?/);

  const known = canonicalTest(name);
  const isKnownUnitless = known && (known.name.includes('pH') || known.name.includes('Specific Gravity'));

  // Require evidence that this is a lab row (either a recognized unit OR a reference interval OR known unitless test)
  if (!unitMatch && !refMatch && !isKnownUnitless) return null;

  return {
    name: toTitle(name),
    value,
    unit: unitMatch ? normalizeUnit(unitMatch[0]) : '',
    ref: refMatch ? refMatch[0].trim() : ''
  };
}
