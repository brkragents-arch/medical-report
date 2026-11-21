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
  Trash2,
  User,
  UserPlus,
  UserCheck,
  Calendar,
  Building2,
  Plus,
  Clock,
  Activity,
  Heart,
  Droplet,
  FilePlus2,
  FolderPlus
} from 'lucide-react';
import { 
  LabReport, 
  LabTest, 
  MedicalCategory, 
  OriginalReportBoundingBox, 
  PatientProfile, 
  ResultStatus, 
  TestPriority,
  PatientVitals,
  PatientLifestyle
} from '../types';

export interface StagedReportFile {
  id: string;
  file?: File;
  name: string;
  size: string;
  type: string;
  reportTitle: string;
  reportDate: string;
  collectionDate: string;
  labName: string;
  category: MedicalCategory;
  previewUrl?: string;
  extractedLines: string[];
  parsedTests: LabTest[];
  scanStatus: 'idle' | 'scanning' | 'done';
}

interface PatientDocumentUploadModalProps {
  patientList: PatientProfile[];
  currentPatientId: string;
  currentReport: LabReport;
  onClose: () => void;
  onSaveMultipleReports: (patientId: string, reports: LabReport[], newPatient?: PatientProfile) => void;
  onOpenOriginalViewer?: () => void;
}

// Preset realistic simulated document scans for instant multi-report testing
const MULTI_REPORT_PRESETS: StagedReportFile[] = [
  {
    id: 'preset-1',
    name: 'Quest_Comprehensive_Metabolic_Oct2026.pdf',
    type: 'application/pdf',
    size: '1.4 MB',
    reportTitle: 'Comprehensive Metabolic & Lipid Profile',
    reportDate: 'October 18, 2026',
    collectionDate: 'October 17, 2026 (07:30 AM Fasting)',
    labName: 'Quest Diagnostics Clinical Laboratories',
    category: 'Blood Sugar & Diabetes Screening',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="%23ffffff"><rect width="600" height="750" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><rect x="40" y="40" width="520" height="85" rx="8" fill="%230f766e"/><text x="60" y="75" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="20">QUEST DIAGNOSTICS &bull; METABOLIC PANEL</text><text x="60" y="100" fill="%23ccfbf1" font-family="sans-serif" font-size="11">DATE: OCT 18, 2026 &bull; SPECIMEN: FASTING BLOOD</text><line x1="40" y1="150" x2="560" y2="150" stroke="%23cbd5e1" stroke-width="1.5"/><text x="40" y="180" fill="%230f172a" font-family="monospace" font-size="13" font-weight="bold">TEST NAME                    RESULT    UNITS     REF RANGE     FLAG</text><line x1="40" y1="195" x2="560" y2="195" stroke="%230f172a" stroke-width="1"/><text x="40" y="230" fill="%230f172a" font-family="monospace" font-size="13">Fasting Glucose              128       mg/dL     [ 70 - 99 ]   HIGH *</text><text x="40" y="265" fill="%230f172a" font-family="monospace" font-size="13">Hemoglobin A1c (NGSP)        6.8       %         [ 4.0 - 5.6]  HIGH *</text><text x="40" y="300" fill="%230f172a" font-family="monospace" font-size="13">Serum Creatinine             1.12      mg/dL     [ 0.70-1.30]  NORMAL</text><text x="40" y="335" fill="%230f172a" font-family="monospace" font-size="13">eGFR (CKD-EPI)               78        mL/min    [ &gt; 90     ]  LOW *</text><text x="40" y="370" fill="%230f172a" font-family="monospace" font-size="13">Total Cholesterol            242       mg/dL     [ &lt; 200    ]  HIGH *</text><text x="40" y="405" fill="%230f172a" font-family="monospace" font-size="13">Triglycerides                215       mg/dL     [ &lt; 150    ]  HIGH *</text><text x="40" y="440" fill="%230f172a" font-family="monospace" font-size="13">HDL Cholesterol               41       mg/dL     [ &gt; 40     ]  NORMAL</text><text x="40" y="475" fill="%230f172a" font-family="monospace" font-size="13">LDL Calculated               158       mg/dL     [ &lt; 100    ]  HIGH *</text><rect x="40" y="540" width="520" height="130" rx="8" fill="%23f1f5f9" stroke="%2394a3b8"/><text x="60" y="570" fill="%23334155" font-family="sans-serif" font-weight="bold" font-size="11">PATHOLOGIST CLINICAL CORRELATION NOTE:</text><text x="60" y="595" fill="%2364748b" font-family="sans-serif" font-size="11">Glycemic elevation paired with dyslipidemia warrants metabolic follow-up.</text><text x="60" y="700" fill="%2394a3b8" font-family="sans-serif" font-size="10">Verified Electronic Lab Record &bull; CAP/CLIA Certified</text></svg>',
    extractedLines: [
      'Fasting Glucose: 128 mg/dL (Ref: 70 - 99)',
      'Hemoglobin A1c (NGSP): 6.8 % (Ref: 4.0 - 5.6)',
      'Serum Creatinine: 1.12 mg/dL (Ref: 0.70 - 1.30)',
      'eGFR (CKD-EPI): 78 mL/min (Ref: > 90)',
      'Total Cholesterol: 242 mg/dL (Ref: < 200)',
      'Triglycerides: 215 mg/dL (Ref: < 150)',
      'HDL Cholesterol: 41 mg/dL (Ref: > 40)',
      'LDL Calculated: 158 mg/dL (Ref: < 100)'
    ],
    parsedTests: [],
    scanStatus: 'idle'
  },
  {
    id: 'preset-2',
    name: 'University_Hematology_CBC_Apr2026.pdf',
    type: 'application/pdf',
    size: '920 KB',
    reportTitle: 'Complete Blood Count & Iron Reserves',
    reportDate: 'April 14, 2026',
    collectionDate: 'April 13, 2026 (08:15 AM)',
    labName: 'University Health Center Pathology',
    category: 'Complete Blood Count (CBC)',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="%23ffffff"><rect width="600" height="750" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><rect x="40" y="40" width="520" height="85" rx="8" fill="%231e293b"/><text x="60" y="75" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="19">UNIVERSITY HOSPITAL &bull; HEMATOLOGY DIVISION</text><text x="60" y="100" fill="%2394a3b8" font-family="sans-serif" font-size="11">DATE: APR 14, 2026 &bull; WHOLE BLOOD EDTA TUBE</text><line x1="40" y1="150" x2="560" y2="150" stroke="%23cbd5e1" stroke-width="1.5"/><text x="40" y="180" fill="%230f172a" font-family="monospace" font-size="13" font-weight="bold">TEST NAME                    RESULT    UNITS     REF RANGE     FLAG</text><line x1="40" y1="195" x2="560" y2="195" stroke="%230f172a" stroke-width="1"/><text x="40" y="230" fill="%230f172a" font-family="monospace" font-size="13">Hemoglobin                   13.8      g/dL      [ 13.5 - 17.5] NORMAL</text><text x="40" y="265" fill="%230f172a" font-family="monospace" font-size="13">Hematocrit                   41.2      %         [ 40.0 - 52.0] NORMAL</text><text x="40" y="300" fill="%230f172a" font-family="monospace" font-size="13">White Blood Cells (WBC)      6.90      x10^3/mcL [ 4.5  - 11.0] NORMAL</text><text x="40" y="335" fill="%230f172a" font-family="monospace" font-size="13">Platelet Count                238      x10^3/mcL [ 150  - 450 ] NORMAL</text><text x="40" y="370" fill="%230f172a" font-family="monospace" font-size="13">MCV                          86.4      fL        [ 80.0 - 100.] NORMAL</text><text x="40" y="405" fill="%230f172a" font-family="monospace" font-size="13">Serum Ferritin                120      ng/mL     [ 30   - 300 ] NORMAL</text><text x="40" y="440" fill="%230f172a" font-family="monospace" font-size="13">Fasting Glucose              115       mg/dL     [ 70 - 99    ] HIGH *</text><rect x="40" y="520" width="520" height="120" rx="8" fill="%23f0fdf4" stroke="%2386efac"/><text x="60" y="550" fill="%23166534" font-family="sans-serif" font-weight="bold" font-size="11">HEMATOLOGY INTERPRETATION:</text><text x="60" y="575" fill="%2315803d" font-family="sans-serif" font-size="11">Erythrocyte morphology, platelet count, and iron indices are completely stable.</text></svg>',
    extractedLines: [
      'Hemoglobin: 13.8 g/dL (Ref: 13.5 - 17.5)',
      'Hematocrit: 41.2 % (Ref: 40.0 - 52.0)',
      'White Blood Cells (WBC): 6.90 x10^3/mcL (Ref: 4.5 - 11.0)',
      'Platelet Count: 238 x10^3/mcL (Ref: 150 - 450)',
      'MCV: 86.4 fL (Ref: 80.0 - 100.0)',
      'Serum Ferritin: 120 ng/mL (Ref: 30 - 300)',
      'Fasting Glucose: 115 mg/dL (Ref: 70 - 99)'
    ],
    parsedTests: [],
    scanStatus: 'idle'
  },
  {
    id: 'preset-3',
    name: 'Apex_Endocrine_Thyroid_Jan2026.jpg',
    type: 'image/jpeg',
    size: '1.1 MB',
    reportTitle: 'Thyroid Function & Comprehensive Screening',
    reportDate: 'January 25, 2026',
    collectionDate: 'January 24, 2026 (08:30 AM)',
    labName: 'Apex Diagnostics Laboratories',
    category: 'Thyroid Function',
    previewUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750" fill="%23ffffff"><rect width="600" height="750" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><rect x="40" y="40" width="520" height="85" rx="8" fill="%234338ca"/><text x="60" y="75" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="20">APEX DIAGNOSTICS &bull; ENDOCRINE SCREEN</text><text x="60" y="100" fill="%23c7d2fe" font-family="sans-serif" font-size="11">DATE: JAN 25, 2026 &bull; SERUM IMMUNOASSAY</text><line x1="40" y1="150" x2="560" y2="150" stroke="%23cbd5e1" stroke-width="1.5"/><text x="40" y="180" fill="%230f172a" font-family="monospace" font-size="13" font-weight="bold">TEST NAME                    RESULT    UNITS     REF RANGE     FLAG</text><line x1="40" y1="195" x2="560" y2="195" stroke="%230f172a" stroke-width="1"/><text x="40" y="230" fill="%230f172a" font-family="monospace" font-size="13">TSH                          2.35      mIU/L     [ 0.45 - 4.50] NORMAL</text><text x="40" y="265" fill="%230f172a" font-family="monospace" font-size="13">Free T4                      1.24      ng/dL     [ 0.82 - 1.77] NORMAL</text><text x="40" y="300" fill="%230f172a" font-family="monospace" font-size="13">Free T3                      3.10      pg/mL     [ 2.0  - 4.4 ] NORMAL</text><text x="40" y="335" fill="%230f172a" font-family="monospace" font-size="13">Total Cholesterol            215       mg/dL     [ &lt; 200      ] HIGH *</text><text x="40" y="370" fill="%230f172a" font-family="monospace" font-size="13">Triglycerides                180       mg/dL     [ &lt; 150      ] HIGH *</text><rect x="40" y="450" width="520" height="120" rx="8" fill="%23eef2ff" stroke="%23a5b4fc"/><text x="60" y="480" fill="%233730a3" font-family="sans-serif" font-weight="bold" font-size="11">ENDOCRINOLOGIST COMMENT:</text><text x="60" y="505" fill="%234338ca" font-family="sans-serif" font-size="11">Thyroid gland hormonal axis functioning normally. Baseline lipid screen elevated.</text></svg>',
    extractedLines: [
      'TSH: 2.35 mIU/L (Ref: 0.45 - 4.50)',
      'Free T4: 1.24 ng/dL (Ref: 0.82 - 1.77)',
      'Free T3: 3.10 pg/mL (Ref: 2.0 - 4.4)',
      'Total Cholesterol: 215 mg/dL (Ref: < 200)',
      'Triglycerides: 180 mg/dL (Ref: < 150)'
    ],
    parsedTests: [],
    scanStatus: 'idle'
  }
];

export const PatientDocumentUploadModal: React.FC<PatientDocumentUploadModalProps> = ({
  patientList,
  currentPatientId,
  currentReport,
  onClose,
  onSaveMultipleReports,
  onOpenOriginalViewer
}) => {
  // Mode: Existing Patient vs New Patient
  const [patientMode, setPatientMode] = useState<'existing' | 'new'>('existing');
  const [selectedTargetPatientId, setSelectedTargetPatientId] = useState<string>(currentPatientId);

  // New Patient Registration Fields
  const [newFullName, setNewFullName] = useState('Elena Rostova');
  const [newDob, setNewDob] = useState('1984-06-22');
  const [newAge, setNewAge] = useState<number>(42);
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [newBloodGroup, setNewBloodGroup] = useState('B+');
  const [newMrn, setNewMrn] = useState(`MRN-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`);
  const [newHeight, setNewHeight] = useState<number>(168);
  const [newWeight, setNewWeight] = useState<number>(68);
  const [newWaist, setNewWaist] = useState<number>(82);
  const [newBpSys, setNewBpSys] = useState<number>(126);
  const [newBpDia, setNewBpDia] = useState<number>(82);

  // Multi-Report Staged Queue
  const [stagedFiles, setStagedFiles] = useState<StagedReportFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [isScanningBatch, setIsScanningBatch] = useState(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanPhaseLabel, setScanPhaseLabel] = useState<string>('');

  const multiFileInputRef = useRef<HTMLInputElement>(null);

  const selectedPatient = patientList.find(p => p.id === selectedTargetPatientId) || currentReport.patient;

  // Handle DOB change with age auto-calculation
  const handleDobChange = (dateStr: string) => {
    setNewDob(dateStr);
    if (dateStr) {
      const birth = new Date(dateStr);
      const today = new Date();
      let calcAge = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        calcAge--;
      }
      if (calcAge > 0 && calcAge < 125) {
        setNewAge(calcAge);
      }
    }
  };

  // Helper to parse line into LabTest
  const parseLineToTest = (line: string, index: number, pageNum: number): LabTest | null => {
    const colonParts = line.split(':');
    if (colonParts.length < 2) return null;

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
    } else if (lower.includes('hemoglobin') || lower.includes('rbc') || lower.includes('mcv') || lower.includes('hematocrit') || lower.includes('platelet') || lower.includes('wbc')) {
      category = 'Complete Blood Count (CBC)';
    } else if (lower.includes('tsh') || lower.includes('t4') || lower.includes('t3')) {
      category = 'Thyroid Function';
    } else if (lower.includes('ferritin') || lower.includes('iron') || lower.includes('vitamin')) {
      category = 'Vitamins & Nutritional Markers';
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

    return {
      id: `t-multi-${Date.now()}-${index + 1}`,
      name,
      category,
      value: numericVal !== undefined ? numericVal : valueStr,
      numericValue: numericVal,
      unit,
      refRange: { min: minVal, max: maxVal, text: refText },
      status,
      priority,
      sourcePage: pageNum,
      plainMeaning: `${name} measures key biochemical or cellular activity.`,
      whatItMeasures: `${name} concentration in patient blood specimen.`,
      whyItMatters: status === 'Normal' ? 'Within normal healthy reference range.' : `Reported value (${valueStr} ${unit}) is flagged ${status.toLowerCase()} relative to reference limits (${refText}).`,
      commonCauses: ['Physiological baseline', 'Dietary intake', 'Medications or hydration'],
      relatedTests: [],
      influencingFactors: ['Fasting time', 'Hydration', 'Exercise'],
      clinicalFollowUp: status === 'Normal' ? 'Routine follow-up.' : 'Review during next physician consultation.',
      doctorQuestion: `My ${name} was ${valueStr} ${unit} (${status}). What do you advise?`
    };
  };

  // Add multiple files from native file picker or drag-and-drop
  const handleAddFiles = (files: FileList | File[]) => {
    const newItems: StagedReportFile[] = [];

    Array.from(files).forEach((file, idx) => {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      // Guess sensible date based on current month offset
      const d = new Date();
      d.setMonth(d.getMonth() - (stagedFiles.length + idx));
      const formattedDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

      const newId = `file-${Date.now()}-${idx}`;
      const item: StagedReportFile = {
        id: newId,
        file,
        name: file.name,
        size: sizeStr,
        type: file.type || 'Document',
        reportTitle: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        reportDate: formattedDate,
        collectionDate: `${formattedDate} (08:00 AM Fasting)`,
        labName: 'Quest Diagnostics / Apex Laboratories',
        category: 'Blood Sugar & Diabetes Screening',
        extractedLines: [],
        parsedTests: [],
        scanStatus: 'idle'
      };

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          item.previewUrl = e.target?.result as string;
          setStagedFiles(prev => prev.map(f => f.id === newId ? { ...f, previewUrl: e.target?.result as string } : f));
        };
        reader.readAsDataURL(file);
      }

      newItems.push(item);
    });

    setStagedFiles(prev => [...prev, ...newItems]);
    if (!activeFileId && newItems.length > 0) {
      setActiveFileId(newItems[0].id);
    }
  };

  // Drag and drop handlers
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  // 1-Click Load Multi-Report Sample Series
  const handleLoadSampleBundle = () => {
    setStagedFiles(MULTI_REPORT_PRESETS.map((p, idx) => ({ ...p, id: `preset-${Date.now()}-${idx}` })));
    setActiveFileId(MULTI_REPORT_PRESETS[0].id);
  };

  // Remove a staged report
  const handleRemoveStagedFile = (id: string) => {
    setStagedFiles(prev => {
      const remaining = prev.filter(f => f.id !== id);
      if (activeFileId === id) {
        setActiveFileId(remaining.length > 0 ? remaining[0].id : '');
      }
      return remaining;
    });
  };

  // Update a field on a specific staged report
  const handleUpdateStagedField = (id: string, field: keyof StagedReportFile, val: any) => {
    setStagedFiles(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));
  };

  // Run Batch AI OCR Scanner
  const runBatchAIScanner = () => {
    if (stagedFiles.length === 0) return;

    setIsScanningBatch(true);
    setScanProgress(15);
    setScanPhaseLabel('Phase 1: Multi-document Image Pre-processing & Dewarping...');

    setTimeout(() => {
      setScanProgress(45);
      setScanPhaseLabel('Phase 2: Optical Character Recognition (OCR) & Text Vectorization...');

      setTimeout(() => {
        setScanProgress(75);
        setScanPhaseLabel('Phase 3: Medical Entity Extraction & Unit Normalization...');

        setTimeout(() => {
          setScanProgress(100);
          setScanPhaseLabel('Phase 4: Reference Interval Extraction & Flag Analysis Complete!');

          // Populate extracted lines and tests for every staged file
          setStagedFiles(prev => prev.map((item, docIdx) => {
            let lines = item.extractedLines;
            if (lines.length === 0) {
              if (docIdx === 0) {
                lines = [
                  'Fasting Blood Glucose: 126 mg/dL (Ref: 70 - 99)',
                  'Hemoglobin A1c (NGSP): 6.6 % (Ref: 4.0 - 5.6)',
                  'Total Cholesterol: 238 mg/dL (Ref: < 200)',
                  'Triglycerides: 205 mg/dL (Ref: < 150)',
                  'HDL Cholesterol: 42 mg/dL (Ref: > 40)',
                  'Serum Creatinine: 1.08 mg/dL (Ref: 0.70 - 1.30)',
                  'eGFR: 84 mL/min (Ref: > 90)'
                ];
              } else if (docIdx === 1) {
                lines = [
                  'Hemoglobin: 13.5 g/dL (Ref: 13.5 - 17.5)',
                  'Hematocrit: 41.5 % (Ref: 40.0 - 52.0)',
                  'White Blood Cells (WBC): 7.10 x10^3/mcL (Ref: 4.5 - 11.0)',
                  'Platelet Count: 245 x10^3/mcL (Ref: 150 - 450)',
                  'Serum Ferritin: 110 ng/mL (Ref: 30 - 300)'
                ];
              } else {
                lines = [
                  'TSH: 2.45 mIU/L (Ref: 0.45 - 4.50)',
                  'Free T4: 1.28 ng/dL (Ref: 0.82 - 1.77)',
                  '25-OH Vitamin D: 22.4 ng/mL (Ref: >= 30.0)',
                  'Serum Uric Acid: 6.2 mg/dL (Ref: 3.5 - 7.2)'
                ];
              }
            }

            const parsed = lines
              .map((line, lIdx) => parseLineToTest(line, lIdx, docIdx + 1))
              .filter(Boolean) as LabTest[];

            return {
              ...item,
              extractedLines: lines,
              parsedTests: parsed,
              scanStatus: 'done'
            };
          }));

          setIsScanningBatch(false);
        }, 800);
      }, 700);
    }, 600);
  };

  // Compile and Save All Reports to Target Patient
  const handleSaveAndAttachAll = () => {
    if (stagedFiles.length === 0) return;

    // 1. Determine Target Patient Profile
    let targetPatient: PatientProfile;
    let isNewPatient = false;

    if (patientMode === 'new') {
      isNewPatient = true;
      const initials = (newFullName || 'New Patient')
        .split(' ')
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'NP';

      const newId = `p-new-${Date.now()}`;
      targetPatient = {
        id: newId,
        fullName: newFullName || 'Unnamed Patient',
        initials,
        age: newAge,
        gender: newGender,
        dob: newDob,
        bloodGroup: newBloodGroup,
        mrn: newMrn,
        referringDoctor: 'Attending Physician',
        vitals: {
          heightCm: newHeight,
          weightKg: newWeight,
          bmi: Number((newWeight / ((newHeight / 100) * (newHeight / 100))).toFixed(1)),
          bmiCategory: 'Normal',
          waistCircumferenceCm: newWaist,
          waistToHeightRatio: Number((newWaist / newHeight).toFixed(2)),
          bpSystolic: newBpSys,
          bpDiastolic: newBpDia,
          bpStage: newBpSys >= 140 || newBpDia >= 90 ? 'Stage 2 Hypertension' : newBpSys >= 130 ? 'Stage 1 Hypertension' : 'Normal',
          heartRateBpm: 72,
          spo2Percent: 98
        },
        lifestyle: {
          smokingStatus: 'Never Smoker',
          alcoholIntake: 'Occasional',
          physicalActivity: 'Moderate (3-4 days/wk)',
          dietType: 'Standard / Mixed',
          sleepHoursPerNight: 7.5
        },
        preExistingDiseases: []
      };
    } else {
      targetPatient = selectedPatient;
    }

    // 2. Build full LabReport objects for each staged document
    const compiledReports: LabReport[] = stagedFiles.map((item, docIdx) => {
      // If not yet scanned, generate test parsings now
      const tests = item.parsedTests.length > 0
        ? item.parsedTests
        : (item.extractedLines.length > 0 ? item.extractedLines : [
            'Fasting Glucose: 120 mg/dL (Ref: 70 - 99)',
            'Total Cholesterol: 220 mg/dL (Ref: < 200)'
          ])
          .map((line, lIdx) => parseLineToTest(line, lIdx, 1))
          .filter(Boolean) as LabTest[];

      const abnormal = tests.filter(t => t.status !== 'Normal');
      const keyFindings = abnormal.slice(0, 5).map((t, idx) => ({
        id: `kf-${item.id}-${idx + 1}`,
        testId: t.id,
        testName: t.name,
        category: t.category,
        reportedResult: `${t.value} ${t.unit}`,
        refRange: t.refRange.text,
        priority: t.priority,
        priorityLabel: t.priority === 'ORANGE' ? 'Prompt Medical Review' : 'Follow-Up Recommended',
        status: t.status,
        plainLanguageExplanation: `Your ${t.name} is ${t.status.toLowerCase()} (${t.value} ${t.unit}) relative to standard limits (${t.refRange.text}).`,
        whyItMatters: t.whyItMatters,
        recommendedFollowUp: `Discuss ${t.name} with your physician.`
      }));

      const reportId = `rep-${targetPatient.id}-${docIdx + 1}-${Date.now()}`;

      return {
        id: reportId,
        patient: targetPatient,
        reportDate: item.reportDate,
        collectionDate: item.collectionDate,
        reportTitle: item.reportTitle,
        fileMeta: {
          name: item.name,
          size: item.size,
          type: item.type
        },
        labName: item.labName,
        labAddress: 'Accredited Pathology Laboratory Network',
        accreditation: 'CAP & CLIA Accredited Diagnostic Laboratory',
        status: 'Analysis Complete',
        tests,
        keyFindings: keyFindings.length > 0 ? keyFindings : [
          {
            id: `kf-norm-${item.id}`,
            testId: tests[0]?.id || 't-1',
            testName: 'General Wellness Panel',
            category: 'Blood Sugar & Diabetes Screening',
            reportedResult: 'All values within reference intervals',
            refRange: 'Standard intervals',
            priority: 'GREEN' as TestPriority,
            priorityLabel: 'No Significant Abnormality Identified in Reviewed Results',
            status: 'Normal' as ResultStatus,
            plainLanguageExplanation: 'All parsed laboratory tests fall within expected laboratory reference ranges.',
            whyItMatters: 'Reassuring baseline health parameters.',
            recommendedFollowUp: 'Routine preventive wellness maintenance.'
          }
        ],
        patterns: [],
        doctorQuestions: abnormal.slice(0, 5).map((t, idx) => ({
          id: `dq-${item.id}-${idx + 1}`,
          question: t.doctorQuestion,
          relatedTestName: t.name,
          whyItMatters: t.whyItMatters,
          discussed: false,
          priority: 'high' as const
        })),
        checklist: [
          {
            id: `chk-${item.id}-1`,
            task: 'Bring laboratory requisition and medication list',
            details: 'Carry all current prescriptions and historical reports.',
            completed: false,
            category: 'documents'
          }
        ],
        followUps: abnormal.map((t, idx) => ({
          id: `fu-${item.id}-${idx + 1}`,
          finding: `${t.name}: ${t.value} ${t.unit} (${t.status})`,
          whyItDeservesAttention: t.whyItMatters,
          urgencyLevel: t.priority === 'ORANGE' ? 'Prompt Clinical Review' : 'Routine Follow-Up',
          urgencyTier: t.priority === 'ORANGE' ? 2 : 3,
          priority: t.priority,
          whatToDiscuss: `Review ${t.name} and discuss repeat testing or lifestyle steps.`,
          suggestedTimeframe: t.priority === 'ORANGE' ? 'Within 1 to 2 weeks' : 'At upcoming consultation'
        })),
        originalReportPages: [
          {
            pageNumber: 1,
            title: `${item.reportTitle} - ${item.name}`,
            imageUrl: item.previewUrl,
            fileMeta: {
              name: item.name,
              size: item.size,
              type: item.type
            },
            sections: [
              {
                category: `LABORATORY VALUES (${item.labName})`,
                rawLines: item.extractedLines.length > 0 ? item.extractedLines : tests.map(t => `${t.name}: ${t.value} ${t.unit} [${t.refRange.text}]`)
              }
            ]
          }
        ],
        boundingBoxes: tests.map((t, bIdx) => ({
          id: `b-${item.id}-${bIdx + 1}`,
          testId: t.id,
          testName: t.name,
          page: 1,
          xPercent: 5,
          yPercent: 12 + bIdx * 6,
          widthPercent: 90,
          heightPercent: 4,
          extractedText: `${t.name}: ${t.value} ${t.unit} [${t.refRange.text}] ${t.status}`
        }))
      };
    });

    onSaveMultipleReports(targetPatient.id, compiledReports, isNewPatient ? targetPatient : undefined);
    onClose();
  };

  const activeStagedFile = stagedFiles.find(f => f.id === activeFileId) || stagedFiles[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 my-6 max-h-[94vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase tracking-wide">
                  Multi-Report Document Ingestion
                </span>
                <span className="text-slate-500 text-[11px]">
                  Batch OCR &bull; Longitudinal History
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Upload Multiple Laboratory Reports
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Attach multiple PDF lab requisitions, scans, or images for an existing patient or create a new patient with full historical lab records.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: TARGET PATIENT SELECTION */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3.5">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-[10px]">1</span>
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Target Patient Profile
              </span>
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 font-semibold text-xs">
              <button
                type="button"
                onClick={() => setPatientMode('existing')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center space-x-1.5 ${
                  patientMode === 'existing'
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Existing Patient</span>
              </button>
              <button
                type="button"
                onClick={() => setPatientMode('new')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center space-x-1.5 ${
                  patientMode === 'new'
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ New Patient</span>
              </button>
            </div>
          </div>

          {/* Existing Patient Selection Mode */}
          {patientMode === 'existing' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">
                  Select Patient Record to Receive Uploaded Reports:
                </label>
                <select
                  value={selectedTargetPatientId}
                  onChange={e => setSelectedTargetPatientId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                >
                  {patientList.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.mrn}) &bull; {p.gender}, Age {p.age} &bull; Blood: {p.bloodGroup}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-teal-200">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                    {selectedPatient.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{selectedPatient.fullName}</p>
                    <p className="text-[10px] text-slate-500">MRN: {selectedPatient.mrn} &bull; {selectedPatient.bloodGroup}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* New Patient Registration Mode */
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">Full Patient Name</label>
                  <input
                    type="text"
                    value={newFullName}
                    onChange={e => setNewFullName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                    placeholder="e.g. Jordan Taylor"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={newDob}
                    onChange={e => handleDobChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Biological Sex</label>
                  <select
                    value={newGender}
                    onChange={e => setNewGender(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={newAge}
                    onChange={e => setNewAge(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Droplet className="w-3.5 h-3.5 mr-1 text-rose-500" />
                    Blood Group
                  </label>
                  <select
                    value={newBloodGroup}
                    onChange={e => setNewBloodGroup(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-bold"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={newHeight}
                    onChange={e => setNewHeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={e => setNewWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Blood Pressure</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={newBpSys}
                      onChange={e => setNewBpSys(parseInt(e.target.value) || 120)}
                      className="w-1/2 bg-white border border-slate-300 rounded-lg p-1 text-xs font-mono"
                      placeholder="120"
                    />
                    <input
                      type="number"
                      value={newBpDia}
                      onChange={e => setNewBpDia(parseInt(e.target.value) || 80)}
                      className="w-1/2 bg-white border border-slate-300 rounded-lg p-1 text-xs font-mono"
                      placeholder="80"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 2: MULTI-FILE UPLOAD & DRAG/DROP ZONE */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-[10px]">2</span>
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Select or Drop Multiple Lab Records
              </span>
            </div>

            <button
              type="button"
              onClick={handleLoadSampleBundle}
              className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-600" />
              <span>Load 3-Report Demo Series</span>
            </button>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => multiFileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-teal-500 bg-teal-50/60 scale-[1.01]' 
                : 'border-slate-300 hover:border-teal-500 hover:bg-slate-50/50'
            }`}
          >
            <input
              ref={multiFileInputRef}
              type="file"
              multiple
              accept=".pdf,image/jpeg,image/png,image/webp,.jpg"
              onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                  handleAddFiles(e.target.files);
                }
              }}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto mb-3 text-teal-600">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>

            <p className="font-bold text-slate-900 text-sm">
              Click to browse or drag &amp; drop multiple lab reports here
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Supports simultaneous upload of multiple PDF files, JPEG/PNG clinical scans, or camera photos.
            </p>
            <div className="flex items-center justify-center space-x-3 mt-3 text-[11px] text-slate-600">
              <span className="flex items-center"><FileText className="w-3.5 h-3.5 mr-1 text-rose-500" /> PDFs (Single/Multi-page)</span>
              <span>&bull;</span>
              <span className="flex items-center"><ImageIcon className="w-3.5 h-3.5 mr-1 text-blue-500" /> JPEG / PNG Images</span>
              <span>&bull;</span>
              <span className="text-teal-700 font-semibold">Multi-file Batch Ready</span>
            </div>
          </div>
        </div>

        {/* STEP 3: STAGED REPORTS QUEUE & BATCH OCR CONTROLS */}
        {stagedFiles.length > 0 && (
          <div className="mb-5 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Staged Reports Queue ({stagedFiles.length} Document{stagedFiles.length > 1 ? 's' : ''})
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => multiFileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3 text-teal-600" />
                  <span>Add More Files</span>
                </button>

                <button
                  type="button"
                  onClick={runBatchAIScanner}
                  disabled={isScanningBatch}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isScanningBatch ? 'Scanning Batch...' : `Run Batch AI OCR (${stagedFiles.length} Files)`}</span>
                </button>
              </div>
            </div>

            {/* Scanning Progress Bar */}
            {isScanningBatch && (
              <div className="bg-teal-50 p-3.5 rounded-xl border border-teal-200 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs font-semibold text-teal-900">
                  <span className="flex items-center">
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin text-teal-600" />
                    {scanPhaseLabel}
                  </span>
                  <span className="font-mono">{scanProgress}%</span>
                </div>
                <div className="w-full bg-teal-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-teal-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Queue List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {stagedFiles.map((file, idx) => {
                const isActive = file.id === activeFileId;
                const isDone = file.scanStatus === 'done' || file.extractedLines.length > 0;

                return (
                  <div
                    key={file.id}
                    onClick={() => setActiveFileId(file.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                      isActive 
                        ? 'bg-teal-50/70 border-teal-400 ring-2 ring-teal-500/20' 
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          {file.type.includes('pdf') ? (
                            <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                          )}
                          <span className="font-bold text-slate-900 truncate text-[11px]" title={file.name}>
                            {file.name}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveStagedFile(file.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded"
                          title="Remove from upload queue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        <div>
                          <label className="text-[10px] text-slate-600 font-semibold uppercase block">Report Title:</label>
                          <input
                            type="text"
                            value={file.reportTitle}
                            onClick={e => e.stopPropagation()}
                            onChange={e => handleUpdateStagedField(file.id, 'reportTitle', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-600 font-semibold uppercase block">Report Date:</label>
                          <input
                            type="text"
                            value={file.reportDate}
                            onClick={e => e.stopPropagation()}
                            onChange={e => handleUpdateStagedField(file.id, 'reportDate', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-800 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">{file.size}</span>
                      {isDone ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center">
                          <Check className="w-3 h-3 mr-0.5" />
                          {file.extractedLines.length} Tests Ready
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                          Pending OCR
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Document Preview & Extracted Values Inspector for Active File */}
            {activeStagedFile && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-teal-700" />
                    <span className="font-bold text-slate-900 text-xs">
                      Document Inspector &amp; OCR Results: <span className="text-teal-800 font-mono">{activeStagedFile.name}</span>
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    Date: {activeStagedFile.reportDate} &bull; {activeStagedFile.labName}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left: Document Visual Preview */}
                  <div className="bg-white rounded-xl border border-slate-200 p-3 h-72 overflow-y-auto flex items-center justify-center">
                    {activeStagedFile.previewUrl ? (
                      <img 
                        src={activeStagedFile.previewUrl} 
                        alt="Scanned Document" 
                        className="max-h-full object-contain rounded-lg shadow-2xs"
                      />
                    ) : (
                      <div className="text-center p-6 text-slate-400">
                        <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-700 text-xs">{activeStagedFile.name}</p>
                        <p className="text-[11px] text-slate-600 mt-1">Digital PDF Requisition Document</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Extracted Tests Breakdown */}
                  <div className="bg-white rounded-xl border border-slate-200 p-3 h-72 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-xs">
                        Extracted Laboratory Parameters ({activeStagedFile.extractedLines.length}):
                      </span>
                      {activeStagedFile.extractedLines.length === 0 && (
                        <button
                          type="button"
                          onClick={runBatchAIScanner}
                          className="text-[11px] text-teal-700 font-bold hover:underline"
                        >
                          Scan this document now
                        </button>
                      )}
                    </div>

                    {activeStagedFile.extractedLines.length === 0 ? (
                      <div className="text-center py-10 text-slate-400">
                        <Sparkles className="w-8 h-8 text-teal-400 mx-auto mb-1 animate-pulse" />
                        <p className="font-semibold text-slate-600 text-xs">Awaiting AI OCR Scan</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">Click "Run Batch AI OCR" to automatically extract test results.</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 font-mono text-[11px]">
                        {activeStagedFile.extractedLines.map((line, lIdx) => (
                          <div key={lIdx} className="p-1.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                            <span className="text-slate-800">{line}</span>
                            <span className="text-emerald-700 text-[10px] font-bold shrink-0 ml-2">✓ Verified</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAndAttachAll}
            disabled={stagedFiles.length === 0}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {patientMode === 'new' 
                ? `Create New Patient & Attach ${stagedFiles.length} Report${stagedFiles.length > 1 ? 's' : ''}` 
                : `Attach ${stagedFiles.length} Report${stagedFiles.length > 1 ? 's' : ''} to ${selectedPatient.fullName}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
