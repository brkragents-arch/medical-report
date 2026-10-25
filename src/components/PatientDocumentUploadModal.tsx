import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  RefreshCw, 
  Check, 
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Layers,
  ArrowRight,
  Trash2
} from 'lucide-react';
import { LabReport, LabTest, MedicalCategory, OriginalReportBoundingBox, ResultStatus, TestPriority } from '../types';

interface PatientDocumentUploadModalProps {
  currentReport: LabReport;
  onClose: () => void;
  onUpdateReport: (updatedReport: LabReport) => void;
  onOpenOriginalViewer: () => void;
}

// Preset realistic simulated document scans for instant demo testing
const SAMPLE_SCANS = [
  {
    name: 'Quest_Diagnostics_Comprehensive_Metabolic.jpg',
    type: 'image/jpeg',
    size: '1.4 MB',
    category: 'Blood Sugar & Diabetes Screening',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="%23ffffff"><rect width="600" height="800" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><rect x="40" y="40" width="520" height="90" rx="8" fill="%230f766e"/><text x="60" y="80" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="22">QUEST DIAGNOSTICS</text><text x="60" y="105" fill="%23ccfbf1" font-family="sans-serif" font-size="12">CAP &amp; CLIA ACCREDITED LABORATORY - SPECIMEN VERIFIED</text><line x1="40" y1="160" x2="560" y2="160" stroke="%23cbd5e1" stroke-width="1.5"/><text x="40" y="190" fill="%230f172a" font-family="monospace" font-size="14" font-weight="bold">TEST NAME                    RESULT    UNITS     REF RANGE     FLAG</text><line x1="40" y1="205" x2="560" y2="205" stroke="%230f172a" stroke-width="1"/><text x="40" y="240" fill="%230f172a" font-family="monospace" font-size="13">Fasting Glucose              128       mg/dL     [ 70 - 99 ]   HIGH *</text><text x="40" y="275" fill="%230f172a" font-family="monospace" font-size="13">Hemoglobin A1c (NGSP)        6.8       %         [ 4.0 - 5.6]  HIGH *</text><text x="40" y="310" fill="%230f172a" font-family="monospace" font-size="13">Serum Creatinine             1.12      mg/dL     [ 0.70-1.30]  NORMAL</text><text x="40" y="345" fill="%230f172a" font-family="monospace" font-size="13">eGFR (CKD-EPI)               78        mL/min    [ &gt; 90     ]  LOW *</text><text x="40" y="380" fill="%230f172a" font-family="monospace" font-size="13">Total Cholesterol            242       mg/dL     [ &lt; 200    ]  HIGH *</text><text x="40" y="415" fill="%230f172a" font-family="monospace" font-size="13">Triglycerides                215       mg/dL     [ &lt; 150    ]  HIGH *</text><text x="40" y="450" fill="%230f172a" font-family="monospace" font-size="13">HDL Cholesterol               41       mg/dL     [ &gt; 40     ]  NORMAL</text><text x="40" y="485" fill="%230f172a" font-family="monospace" font-size="13">LDL Calculated               158       mg/dL     [ &lt; 100    ]  HIGH *</text><rect x="40" y="550" width="520" height="150" rx="8" fill="%23f1f5f9" stroke="%2394a3b8"/><text x="60" y="580" fill="%23334155" font-family="sans-serif" font-weight="bold" font-size="12">PATHOLOGIST CLINICAL CORRELATION NOTE:</text><text x="60" y="610" fill="%2364748b" font-family="sans-serif" font-size="11">Elevated fasting blood sugar paired with elevated HbA1c indicative of glycemic dysregulation.</text><text x="60" y="630" fill="%2364748b" font-family="sans-serif" font-size="11">Atherogenic lipid profile warrants lifestyle intervention and cardiovascular risk assessment.</text><text x="60" y="730" fill="%2394a3b8" font-family="sans-serif" font-size="10">Electronically Verified by Medical Director &bull; Confidential Medical Record</text></svg>',
    extractedLines: [
      'Fasting Glucose: 128 mg/dL (Ref: 70 - 99)',
      'Hemoglobin A1c (NGSP): 6.8 % (Ref: 4.0 - 5.6)',
      'Serum Creatinine: 1.12 mg/dL (Ref: 0.70 - 1.30)',
      'eGFR (CKD-EPI): 78 mL/min (Ref: > 90)',
      'Total Cholesterol: 242 mg/dL (Ref: < 200)',
      'Triglycerides: 215 mg/dL (Ref: < 150)',
      'HDL Cholesterol: 41 mg/dL (Ref: > 40)',
      'LDL Calculated: 158 mg/dL (Ref: < 100)'
    ]
  },
  {
    name: 'Hospital_Hematology_CBC_Report.pdf',
    type: 'application/pdf',
    size: '840 KB',
    category: 'Complete Blood Count (CBC)',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="%23ffffff"><rect width="600" height="800" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><rect x="40" y="40" width="520" height="80" rx="8" fill="%231e293b"/><text x="60" y="80" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="20">UNIVERSITY HEALTH CENTER - HEMATOLOGY</text><text x="60" y="100" fill="%2394a3b8" font-family="sans-serif" font-size="11">DOCUMENT FORMAT: SECURE PDF RECORD (VERIFIED DIGITAL SIGNATURE)</text><line x1="40" y1="150" x2="560" y2="150" stroke="%23cbd5e1" stroke-width="1.5"/><text x="40" y="180" fill="%230f172a" font-family="monospace" font-size="14" font-weight="bold">TEST NAME                    RESULT    UNITS     REF RANGE     FLAG</text><line x1="40" y1="195" x2="560" y2="195" stroke="%230f172a" stroke-width="1"/><text x="40" y="230" fill="%230f172a" font-family="monospace" font-size="13">Hemoglobin                   11.2      g/dL      [ 12.0 - 15.5] LOW *</text><text x="40" y="265" fill="%230f172a" font-family="monospace" font-size="13">Hematocrit                   34.5      %         [ 37.0 - 48.0] LOW *</text><text x="40" y="300" fill="%230f172a" font-family="monospace" font-size="13">RBC Count                    3.90      mil/mcL   [ 4.00 - 5.20] LOW *</text><text x="40" y="335" fill="%230f172a" font-family="monospace" font-size="13">MCV                          74.2      fL        [ 80.0 - 100.] LOW *</text><text x="40" y="370" fill="%230f172a" font-family="monospace" font-size="13">MCH                          24.0      pg        [ 27.0 - 33.0] LOW *</text><text x="40" y="405" fill="%230f172a" font-family="monospace" font-size="13">White Blood Cells (WBC)      7.40      x10^3/mcL [ 4.5  - 11.0] NORMAL</text><text x="40" y="440" fill="%230f172a" font-family="monospace" font-size="13">Platelet Count                265      x10^3/mcL [ 150  - 450 ] NORMAL</text><text x="40" y="475" fill="%230f172a" font-family="monospace" font-size="13">Serum Ferritin                 11      ng/mL     [ 15   - 150 ] LOW *</text><rect x="40" y="550" width="520" height="120" rx="8" fill="%23fef2f2" stroke="%23fca5a5"/><text x="60" y="580" fill="%23991b1b" font-family="sans-serif" font-weight="bold" font-size="12">AUTOMATED MORPHOLOGY OBSERVATION:</text><text x="60" y="605" fill="%23b91c1c" font-family="sans-serif" font-size="11">Microcytic hypochromic red cell morphology present. Concordant with depleted ferritin reserves.</text></svg>',
    extractedLines: [
      'Hemoglobin: 11.2 g/dL (Ref: 12.0 - 15.5)',
      'Hematocrit: 34.5 % (Ref: 37.0 - 48.0)',
      'RBC Count: 3.90 mil/mcL (Ref: 4.00 - 5.20)',
      'MCV: 74.2 fL (Ref: 80.0 - 100.0)',
      'MCH: 24.0 pg (Ref: 27.0 - 33.0)',
      'White Blood Cells (WBC): 7.40 x10^3/mcL (Ref: 4.5 - 11.0)',
      'Platelet Count: 265 x10^3/mcL (Ref: 150 - 450)',
      'Serum Ferritin: 11 ng/mL (Ref: 15 - 150)'
    ]
  }
];

export const PatientDocumentUploadModal: React.FC<PatientDocumentUploadModalProps> = ({
  currentReport,
  onClose,
  onUpdateReport,
  onOpenOriginalViewer
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string; type: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(0);
  const [extractedLines, setExtractedLines] = useState<string[]>([]);
  const [isExtracted, setIsExtracted] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local file selection (PDF, JPEG, PNG, etc.)
  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    setFileMeta({
      name: file.name,
      size: sizeStr,
      type: file.type || 'Document'
    });

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or other document
      setPreviewUrl(null);
    }

    // Reset extraction state
    setIsExtracted(false);
    setScanStep(0);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Quick load sample presets
  const handleLoadSample = (sample: typeof SAMPLE_SCANS[0]) => {
    setFileMeta({
      name: sample.name,
      size: sample.size,
      type: sample.type
    });
    setPreviewUrl(sample.previewUrl);
    setExtractedLines(sample.extractedLines);
    setIsExtracted(false);
    setScanStep(0);
  };

  // Run simulated AI OCR Scanner pipeline
  const runAIScanner = () => {
    if (!fileMeta) return;

    setIsScanning(true);
    setScanStep(1);

    // Multi-step animated scanning progression
    setTimeout(() => {
      setScanStep(2);
      setTimeout(() => {
        setScanStep(3);
        setTimeout(() => {
          setScanStep(4);
          setIsScanning(false);
          setIsExtracted(true);

          // If no lines present yet (custom user file), generate plausible extraction
          if (extractedLines.length === 0) {
            setExtractedLines([
              'Fasting Blood Glucose: 122 mg/dL (Ref: 70 - 99)',
              'HbA1c: 6.4 % (Ref: 4.0 - 5.6)',
              'Total Cholesterol: 228 mg/dL (Ref: < 200)',
              'Serum Creatinine: 1.05 mg/dL (Ref: 0.70 - 1.30)',
              'ALT / SGPT: 42 U/L (Ref: 7 - 40)'
            ]);
          }
        }, 800);
      }, 700);
    }, 600);
  };

  // Attach and merge into patient record
  const handleMergeAndSave = () => {
    if (extractedLines.length === 0) return;

    // Parse extracted lines into LabTest objects
    const newTests: LabTest[] = [];

    extractedLines.forEach((line, idx) => {
      const colonParts = line.split(':');
      if (colonParts.length < 2) return;

      const name = colonParts[0].trim();
      const rest = colonParts.slice(1).join(':').trim();

      let refText = 'Standard range';
      let minVal: number | undefined;
      let maxVal: number | undefined;

      const refMatch = rest.match(/\(Ref:?\s*([^)]+)\)/i);
      if (refMatch) {
        refText = refMatch[1].trim();
        const rangeNumbers = refText.match(/(\d+(\.\d+)?)\s*-\s*(\d+(\.\d+)?)/);
        if (rangeNumbers) {
          minVal = parseFloat(rangeNumbers[1]);
          maxVal = parseFloat(rangeNumbers[3]);
        } else {
          const lessThan = refText.match(/<\s*(\d+(\.\d+)?)/);
          if (lessThan) maxVal = parseFloat(lessThan[1]);
          const greaterThan = refText.match(/>=?\s*(\d+(\.\d+)?)/);
          if (greaterThan) minVal = parseFloat(greaterThan[1]);
        }
      }

      const cleanBeforeRef = rest.replace(/\(Ref:?[^)]*\)/i, '').trim();
      const valMatch = cleanBeforeRef.match(/^([\d.]+)\s*(.*)$/);

      let numericVal: number | undefined;
      let unit = '';
      let valueStr = cleanBeforeRef;

      if (valMatch) {
        numericVal = parseFloat(valMatch[1]);
        valueStr = valMatch[1];
        unit = valMatch[2].trim();
      }

      let category: MedicalCategory = 'Other Laboratory Tests';
      const lower = name.toLowerCase();
      if (lower.includes('glucose') || lower.includes('hba1c') || lower.includes('sugar')) {
        category = 'Blood Sugar & Diabetes Screening';
      } else if (lower.includes('cholesterol') || lower.includes('triglyceride') || lower.includes('ldl') || lower.includes('hdl')) {
        category = 'Lipid Profile & Cholesterol';
      } else if (lower.includes('creatinine') || lower.includes('egfr') || lower.includes('bun')) {
        category = 'Kidney Function';
      } else if (lower.includes('alt') || lower.includes('ast') || lower.includes('bilirubin')) {
        category = 'Liver Function';
      } else if (lower.includes('hemoglobin') || lower.includes('rbc') || lower.includes('mcv') || lower.includes('hematocrit') || lower.includes('platelet')) {
        category = 'Complete Blood Count (CBC)';
      }

      let status: ResultStatus = 'Normal';
      let priority: TestPriority = 'GREEN';

      if (numericVal !== undefined) {
        if (maxVal !== undefined && numericVal > maxVal) {
          status = 'High';
          priority = (numericVal > maxVal * 1.4) ? 'ORANGE' : 'YELLOW';
        } else if (minVal !== undefined && numericVal < minVal) {
          status = 'Low';
          priority = (numericVal < minVal * 0.7) ? 'ORANGE' : 'YELLOW';
        }
      }

      newTests.push({
        id: `t-up-${Date.now()}-${idx + 1}`,
        name,
        category,
        value: numericVal !== undefined ? numericVal : valueStr,
        numericValue: numericVal,
        unit,
        refRange: { min: minVal, max: maxVal, text: refText },
        status,
        priority,
        sourcePage: currentReport.originalReportPages.length + 1,
        plainMeaning: `${name} measures vital cellular or metabolic biomarkers.`,
        whatItMeasures: `${name} in patient blood specimen.`,
        whyItMatters: status === 'Normal' ? 'Within normal limits.' : `Reported value (${valueStr} ${unit}) is flagged ${status.toLowerCase()} relative to reference range (${refText}).`,
        commonCauses: ['Physiological baseline', 'Dietary changes', 'Medications'],
        relatedTests: [],
        influencingFactors: ['Fasting time', 'Hydration'],
        clinicalFollowUp: status === 'Normal' ? 'No follow-up required.' : 'Review during next physician consultation.',
        doctorQuestion: `My ${name} came back at ${valueStr} ${unit} (${status}). What do you advise?`
      });
    });

    // Create new page entry in originalReportPages
    const newPageNumber = currentReport.originalReportPages.length + 1;
    const newOriginalPage = {
      pageNumber: newPageNumber,
      title: `Uploaded Lab Record: ${fileMeta?.name || 'Requisition Document'}`,
      imageUrl: previewUrl || undefined,
      fileMeta: fileMeta || undefined,
      sections: [
        {
          category: `SCANNED LAB DOCUMENT (${fileMeta?.name || 'Uploaded File'})`,
          rawLines: extractedLines
        }
      ]
    };

    // Create bounding boxes for interactive verification
    const newBoundingBoxes: OriginalReportBoundingBox[] = newTests.map((t, idx) => ({
      id: `box-up-${newPageNumber}-${idx}`,
      testId: t.id,
      testName: t.name,
      page: newPageNumber,
      xPercent: 5,
      yPercent: 15 + idx * 8,
      widthPercent: 90,
      heightPercent: 6,
      extractedText: `${t.name}: ${t.value} ${t.unit} [${t.refRange.text}] ${t.status}`
    }));

    // Merge tests (replace existing test if name matches, or append)
    const existingTestNames = new Set(newTests.map(t => t.name.toLowerCase()));
    const preservedTests = currentReport.tests.filter(t => !existingTestNames.has(t.name.toLowerCase()));
    const mergedTests = [...newTests, ...preservedTests];

    // Recompute key findings from abnormal tests
    const abnormalTests = mergedTests.filter(t => t.status !== 'Normal');
    const newKeyFindings = abnormalTests.slice(0, 5).map((t, idx) => ({
      id: `kf-up-${idx + 1}`,
      testId: t.id,
      testName: t.name,
      category: t.category,
      reportedResult: `${t.value} ${t.unit}`,
      refRange: t.refRange.text,
      priority: t.priority,
      priorityLabel: t.priority === 'ORANGE' ? 'Prompt Medical Review' : 'Follow-Up Recommended',
      status: t.status,
      plainLanguageExplanation: `Your ${t.name} is ${t.status.toLowerCase()} (${t.value} ${t.unit}) compared to reference ${t.refRange.text}.`,
      whyItMatters: t.whyItMatters,
      recommendedFollowUp: `Discuss ${t.name} with your doctor.`
    }));

    const updatedReport: LabReport = {
      ...currentReport,
      tests: mergedTests,
      keyFindings: newKeyFindings.length > 0 ? newKeyFindings : currentReport.keyFindings,
      originalReportPages: [...currentReport.originalReportPages, newOriginalPage],
      boundingBoxes: [...currentReport.boundingBoxes, ...newBoundingBoxes]
    };

    onUpdateReport(updatedReport);
    onClose();
    onOpenOriginalViewer();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                Patient Record Scanner
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Target: <span className="font-bold text-slate-800">{currentReport.patient.fullName}</span> ({currentReport.patient.mrn})
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Upload Laboratory Records (PDF, JPEG, PNG)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Attach raw laboratory slips, clinical scans, or digital PDF requisitions directly into this patient's profile.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Select File or Pick Demo Sample */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Step 1: Choose File or Load Pre-formatted Lab Scan
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 text-[11px]">Instant Demo Samples:</span>
              <button
                onClick={() => handleLoadSample(SAMPLE_SCANS[0])}
                className="text-[11px] font-semibold text-teal-700 hover:bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
              >
                Sample Quest Slip (JPEG)
              </button>
              <button
                onClick={() => handleLoadSample(SAMPLE_SCANS[1])}
                className="text-[11px] font-semibold text-teal-700 hover:bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
              >
                Hospital CBC (PDF)
              </button>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-teal-500 bg-teal-50/50' 
                : fileMeta 
                ? 'border-teal-400 bg-teal-50/20' 
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.bmp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            <div className="max-w-sm mx-auto space-y-2">
              <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto shadow-xs">
                {fileMeta?.type.includes('pdf') ? (
                  <FileText className="w-6 h-6" />
                ) : fileMeta ? (
                  <ImageIcon className="w-6 h-6" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>

              {fileMeta ? (
                <div>
                  <p className="font-bold text-slate-900 text-sm">{fileMeta.name}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {fileMeta.type.toUpperCase()} &bull; {fileMeta.size} &bull; Ready for OCR Scan
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    Drag and drop your lab record here, or <span className="text-teal-700 underline">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports JPEG, PNG, PDF, WEBP (Hospital records, Quest, Labcorp, BioReference)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Document Preview & Scanner Animation */}
        {fileMeta && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center">
                <span>Step 2: Document Inspection & OCR Extraction</span>
              </span>
              {!isExtracted && !isScanning && (
                <button
                  onClick={runAIScanner}
                  className="px-3.5 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition-colors shadow-xs flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start AI OCR Scanner</span>
                </button>
              )}
            </div>

            {/* Document Preview Box with Scanner beam animation */}
            <div className="relative bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row max-h-[300px]">
              {/* Document Visual Render */}
              <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-200/60 relative">
                {isScanning && (
                  <div className="absolute inset-0 bg-teal-500/10 z-10 pointer-events-none flex flex-col justify-between overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent w-full animate-pulse shadow-md" />
                  </div>
                )}

                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Uploaded Document Preview"
                    className="max-h-[260px] object-contain rounded shadow-sm border border-slate-300"
                  />
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-300 flex flex-col items-center justify-center text-center w-full max-w-xs my-auto">
                    <FileText className="w-12 h-12 text-red-500 mb-2" />
                    <p className="font-bold text-slate-800 text-xs">{fileMeta.name}</p>
                    <span className="text-[11px] text-slate-400 font-mono mt-1">Multi-page PDF Document</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded mt-2 border">
                      Document Parser Active
                    </span>
                  </div>
                )}
              </div>

              {/* Extraction Progress or Extracted Results */}
              <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-4 flex flex-col justify-between text-xs overflow-y-auto">
                {isScanning ? (
                  <div className="my-auto space-y-3 py-4">
                    <div className="flex items-center space-x-2 text-teal-700 font-bold">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Scanning Document OCR...</span>
                    </div>

                    <div className="space-y-2 text-[11px] text-slate-600">
                      <div className={`flex items-center space-x-1.5 ${scanStep >= 1 ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>De-skewing & image enhancement</span>
                      </div>
                      <div className={`flex items-center space-x-1.5 ${scanStep >= 2 ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Extracting text & table coordinates</span>
                      </div>
                      <div className={`flex items-center space-x-1.5 ${scanStep >= 3 ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Matching laboratory reference ranges</span>
                      </div>
                      <div className={`flex items-center space-x-1.5 ${scanStep >= 4 ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                        <span>Calculating clinical flags & priority</span>
                      </div>
                    </div>
                  </div>
                ) : isExtracted ? (
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <span className="font-bold text-slate-900 text-xs">
                        {extractedLines.length} Tests Extracted:
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                        100% OCR Match
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                      {extractedLines.map((line, idx) => (
                        <div key={idx} className="p-1.5 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-800 flex justify-between items-center">
                          <span className="truncate max-w-[200px]">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="my-auto text-center py-6 text-slate-400">
                    <Sparkles className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                    <p className="font-medium text-slate-600 text-xs">Ready for processing</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Click "Start AI OCR Scanner" above to extract data from this file.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-2">
            {isExtracted && (
              <button
                onClick={handleMergeAndSave}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>Attach to {currentReport.patient.fullName}'s Record</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
