import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  UserPlus,
  UserCheck,
  Layers,
  HelpCircle,
  Calendar,
  Droplet
} from 'lucide-react';
import { LabReport, LabTest, MedicalCategory, PatientProfile, ResultStatus, TestPriority } from '../types';

interface AddReportModalProps {
  patientList: PatientProfile[];
  currentPatientId?: string;
  onClose: () => void;
  onAddReport: (newReport: LabReport) => void;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

const PRESET_SAMPLE_TEXT = `Fasting Blood Glucose: 142 mg/dL (Ref: 70 - 99)
HbA1c: 7.4 % (Ref: 4.0 - 5.6)
Total Cholesterol: 235 mg/dL (Ref: < 200)
LDL Cholesterol: 155 mg/dL (Ref: < 100)
Triglycerides: 210 mg/dL (Ref: < 150)
Serum Creatinine: 1.05 mg/dL (Ref: 0.70 - 1.30)
eGFR: 82 mL/min (Ref: > 90)
Hemoglobin: 12.8 g/dL (Ref: 13.5 - 17.5)
Platelet Count: 215 x10^3/mcL (Ref: 150 - 450)
ALT / SGPT: 48 U/L (Ref: 7 - 40)
TSH: 5.8 mIU/L (Ref: 0.45 - 4.50)
25-OH Vitamin D: 16.2 ng/mL (Ref: >= 30.0)`;

export const AddReportModal: React.FC<AddReportModalProps> = ({
  patientList,
  currentPatientId,
  onClose,
  onAddReport
}) => {
  // Mode: Existing Patient vs New Patient
  const [patientMode, setPatientMode] = useState<'existing' | 'new'>(
    patientList.length > 0 ? 'existing' : 'new'
  );
  const [selectedExistingId, setSelectedExistingId] = useState<string>(
    currentPatientId || (patientList.length > 0 ? patientList[0].id : '')
  );

  // Patient Fields
  const [patientName, setPatientName] = useState('Jordan Taylor');
  const [dob, setDob] = useState('1982-05-18');
  const [age, setAge] = useState<number>(44);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [mrn, setMrn] = useState(`MRN-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`);
  const [referringDoctor, setReferringDoctor] = useState('Dr. Marcus Lee, MD');
  const [labName, setLabName] = useState('Quest & Labcorp Diagnostic Services');
  const [collectionDate, setCollectionDate] = useState('October 23, 2026 (08:00 AM)');

  // Quick Raw Text
  const [rawText, setRawText] = useState(PRESET_SAMPLE_TEXT);

  // When switching existing patient selection, pre-populate details
  useEffect(() => {
    if (patientMode === 'existing') {
      const found = patientList.find(p => p.id === selectedExistingId);
      if (found) {
        setPatientName(found.fullName);
        setDob(found.dob || '1980-01-01');
        setAge(found.age);
        setGender(found.gender);
        setBloodGroup(found.bloodGroup || 'O+');
        setMrn(found.mrn);
        setReferringDoctor(found.referringDoctor || 'Attending Physician');
      }
    } else {
      // New patient defaults
      setPatientName('');
      setDob('1990-01-01');
      setAge(36);
      setGender('Female');
      setBloodGroup('O+');
      setMrn(`MRN-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`);
      setReferringDoctor('');
    }
  }, [patientMode, selectedExistingId, patientList]);

  // Auto-calculate age whenever DOB changes
  const handleDobChange = (newDob: string) => {
    setDob(newDob);
    if (newDob) {
      const birthDate = new Date(newDob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge > 0 && calculatedAge < 125) {
        setAge(calculatedAge);
      }
    }
  };

  // Parse Text into structured tests
  const handleParseAndCreate = () => {
    const lines = rawText.split('\n').filter(l => l.trim().length > 0);
    const parsedTests: LabTest[] = [];

    lines.forEach((line, idx) => {
      const colonParts = line.split(':');
      if (colonParts.length < 2) return;

      const name = colonParts[0].trim();
      const rest = colonParts.slice(1).join(':').trim();

      let valueStr = '';
      let unit = '';
      let refText = 'Standard reference interval';
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
      if (valMatch) {
        numericVal = parseFloat(valMatch[1]);
        valueStr = valMatch[1];
        unit = valMatch[2].trim();
      } else {
        valueStr = cleanBeforeRef;
      }

      // Determine category
      let category: MedicalCategory = 'Other Laboratory Tests';
      const lowerName = name.toLowerCase();
      if (lowerName.includes('glucose') || lowerName.includes('hba1c') || lowerName.includes('sugar')) {
        category = 'Blood Sugar & Diabetes Screening';
      } else if (lowerName.includes('cholesterol') || lowerName.includes('ldl') || lowerName.includes('hdl') || lowerName.includes('triglyceride')) {
        category = 'Lipid Profile & Cholesterol';
      } else if (lowerName.includes('creatinine') || lowerName.includes('egfr') || lowerName.includes('bun') || lowerName.includes('uric')) {
        category = 'Kidney Function';
      } else if (lowerName.includes('alt') || lowerName.includes('ast') || lowerName.includes('bilirubin') || lowerName.includes('albumin')) {
        category = 'Liver Function';
      } else if (lowerName.includes('tsh') || lowerName.includes('t3') || lowerName.includes('t4')) {
        category = 'Thyroid Function';
      } else if (lowerName.includes('vitamin') || lowerName.includes('ferritin') || lowerName.includes('iron') || lowerName.includes('b12')) {
        category = 'Vitamins & Nutritional Markers';
      } else if (lowerName.includes('hemoglobin') || lowerName.includes('rbc') || lowerName.includes('wbc') || lowerName.includes('platelet') || lowerName.includes('mcv')) {
        category = 'Complete Blood Count (CBC)';
      }

      // Determine status & priority
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

      parsedTests.push({
        id: `t-custom-${idx + 1}`,
        name,
        category,
        value: numericVal !== undefined ? numericVal : valueStr,
        numericValue: numericVal,
        unit,
        refRange: { min: minVal, max: maxVal, text: refText },
        status,
        priority,
        plainMeaning: `${name} measures key biochemical activity in your body.`,
        whatItMeasures: `${name} concentration in blood sample.`,
        whyItMatters: status === 'Normal' 
          ? 'Within standard reference range.' 
          : `Reported value (${valueStr} ${unit}) is outside standard laboratory limits (${refText}).`,
        commonCauses: ['Physiological adaptation', 'Dietary intake', 'Medication or individual baseline'],
        relatedTests: [],
        influencingFactors: ['Fasting status', 'Hydration', 'Time of day'],
        clinicalFollowUp: status === 'Normal' ? 'Routine follow-up.' : 'Review during your upcoming clinician consultation.',
        doctorQuestion: `My ${name} is ${valueStr} ${unit} (${status}). What do you recommend as the next step?`
      });
    });

    const initials = (patientName || 'Patient')
      .split(' ')
      .filter(p => p.length > 0)
      .map(p => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'PT';

    // Construct or preserve Patient Profile
    const patientId = patientMode === 'existing' && selectedExistingId 
      ? selectedExistingId 
      : `p-custom-${Date.now()}`;

    const existingPatient = patientMode === 'existing' ? patientList.find(p => p.id === selectedExistingId) : null;

    const patient: PatientProfile = {
      id: patientId,
      fullName: patientName || 'Unnamed Patient',
      initials,
      age: Number(age) || 40,
      gender,
      dob: dob || '1985-01-01',
      bloodGroup: bloodGroup || 'O+',
      mrn: mrn || `MRN-${Math.floor(1000 + Math.random() * 9000)}`,
      referringDoctor: referringDoctor || 'Attending Physician',
      vitals: existingPatient?.vitals || {
        heightCm: 172,
        weightKg: 72,
        bmi: 24.3,
        bmiCategory: 'Normal',
        waistCircumferenceCm: 82,
        waistToHeightRatio: 0.48,
        bpSystolic: 120,
        bpDiastolic: 80,
        bpStage: 'Normal',
        heartRateBpm: 72,
        spo2Percent: 98
      },
      lifestyle: existingPatient?.lifestyle || {
        smokingStatus: 'Never Smoker',
        alcoholIntake: 'Occasional',
        physicalActivity: 'Moderate (3-4 days/wk)',
        dietType: 'Standard / Mixed',
        sleepHoursPerNight: 7.5
      },
      preExistingDiseases: existingPatient?.preExistingDiseases || []
    };

    // Build key findings
    const abnormalTests = parsedTests.filter(t => t.status !== 'Normal');
    const keyFindings = abnormalTests.map((t, idx) => ({
      id: `kf-c-${idx + 1}`,
      testId: t.id,
      testName: t.name,
      category: t.category,
      reportedResult: `${t.value} ${t.unit}`,
      refRange: t.refRange.text,
      priority: t.priority,
      priorityLabel: t.priority === 'ORANGE' ? 'Prompt Medical Review' : 'Follow-Up Recommended',
      status: t.status,
      plainLanguageExplanation: `Your ${t.name} result is ${t.status.toLowerCase()} relative to the laboratory's reference range (${t.refRange.text}).`,
      whyItMatters: t.whyItMatters,
      recommendedFollowUp: `Discuss this ${t.status.toLowerCase()} ${t.name} with your doctor to explore lifestyle or clinical steps.`
    }));

    if (keyFindings.length === 0 && parsedTests.length > 0) {
      keyFindings.push({
        id: 'kf-normal-c',
        testId: parsedTests[0]?.id || 't-1',
        testName: 'General Wellness Panel',
        category: 'Blood Sugar & Diabetes Screening',
        reportedResult: 'All values within reference intervals',
        refRange: 'Standard intervals',
        priority: 'GREEN',
        priorityLabel: 'No Significant Abnormality Identified in Reviewed Results',
        status: 'Normal',
        plainLanguageExplanation: 'All parsed laboratory tests fall within expected laboratory reference ranges.',
        whyItMatters: 'Reassuring baseline health parameters.',
        recommendedFollowUp: 'Routine preventive health maintenance.'
      });
    }

    const doctorQuestions = abnormalTests.slice(0, 6).map((t, idx) => ({
      id: `dq-c-${idx + 1}`,
      question: t.doctorQuestion,
      relatedTestName: t.name,
      whyItMatters: t.whyItMatters,
      discussed: false,
      priority: 'high' as const
    }));

    if (doctorQuestions.length === 0) {
      doctorQuestions.push({
        id: 'dq-c-1',
        question: 'Are there any age-appropriate preventive health screenings recommended for me this year?',
        whyItMatters: 'Keeps routine preventive healthcare up to date.',
        discussed: false,
        priority: 'low'
      });
    }

    const newReport: LabReport = {
      id: `rep-custom-${Date.now()}`,
      patient,
      reportDate: 'October 23, 2026',
      collectionDate,
      labName,
      labAddress: 'Clinical Diagnostic Pathologists Network',
      accreditation: 'CAP & CLIA Accredited',
      status: 'Analysis Complete',
      tests: parsedTests,
      keyFindings,
      patterns: [],
      doctorQuestions,
      checklist: [
        {
          id: 'chk-c-1',
          task: 'Bring medication and supplement list to appointment',
          details: 'Write down all current medicines and supplements.',
          completed: false,
          category: 'medications'
        },
        {
          id: 'chk-c-2',
          task: 'Bring previous lab reports for comparison',
          details: 'Helps doctor see trends over time.',
          completed: false,
          category: 'documents'
        }
      ],
      followUps: abnormalTests.map((t, idx) => ({
        id: `fu-c-${idx + 1}`,
        finding: `${t.name}: ${t.value} ${t.unit} (${t.status})`,
        whyItDeservesAttention: t.whyItMatters,
        urgencyLevel: t.priority === 'ORANGE' ? 'Prompt Clinical Review' : 'Routine Follow-Up',
        urgencyTier: t.priority === 'ORANGE' ? 2 : 3,
        priority: t.priority,
        whatToDiscuss: `Review ${t.name} and discuss whether lifestyle changes or repeat testing is appropriate.`,
        suggestedTimeframe: t.priority === 'ORANGE' ? 'Within 1 to 2 weeks' : 'At upcoming appointment'
      })),
      originalReportPages: [
        {
          pageNumber: 1,
          title: `Laboratory Requisition: ${patient.fullName}`,
          sections: [
            {
              category: 'LABORATORY REPORT VALUES',
              rawLines: lines
            }
          ]
        }
      ],
      boundingBoxes: parsedTests.map((t, idx) => ({
        id: `b-c-${idx + 1}`,
        testId: t.id,
        testName: t.name,
        page: 1,
        xPercent: 5,
        yPercent: 10 + idx * 6,
        widthPercent: 90,
        heightPercent: 4,
        extractedText: `${t.name}: ${t.value} ${t.unit} [${t.refRange.text}] ${t.status}`
      }))
    };

    onAddReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Add Laboratory Report
              </h2>
              <p className="text-xs text-slate-500">
                Attach tests to an existing patient or register a new patient in MediInsight AI.
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

        {/* Step 1: Patient Selection & Demographics */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-5 text-xs space-y-3.5">
          {/* Patient Mode Toggle */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[11px]">1</span>
              <span className="font-bold text-slate-900 text-xs">Patient Selection & Demographics</span>
            </div>

            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPatientMode('existing')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center space-x-1.5 ${
                  patientMode === 'existing'
                    ? 'bg-teal-600 text-white shadow-2xs'
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
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ New Patient</span>
              </button>
            </div>
          </div>

          {/* Existing Patient Dropdown Selector */}
          {patientMode === 'existing' && (
            <div className="bg-teal-50/60 p-3 rounded-lg border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-teal-950 font-bold text-xs flex items-center">
                <span>Select Target Patient:</span>
              </label>
              <select
                value={selectedExistingId}
                onChange={e => setSelectedExistingId(e.target.value)}
                className="bg-white border border-teal-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600 sm:w-72"
              >
                {patientList.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.fullName} ({p.gender}, Age {p.age} &bull; Blood: {p.bloodGroup} &bull; {p.mrn})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Patient Details Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {/* Full Name */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Patient Full Name</label>
              <input
                type="text"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                disabled={patientMode === 'existing'}
                placeholder="e.g. Jane Doe"
                className={`w-full border rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-hidden ${
                  patientMode === 'existing' ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed' : 'bg-white border-slate-300 focus:border-teal-500'
                }`}
              />
            </div>

            {/* Date of Birth (DOB) */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-teal-600" />
                Date of Birth (DOB)
              </label>
              <input
                type="date"
                value={dob}
                onChange={e => handleDobChange(e.target.value)}
                disabled={patientMode === 'existing'}
                className={`w-full border rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-hidden ${
                  patientMode === 'existing' ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed' : 'bg-white border-slate-300 focus:border-teal-500'
                }`}
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                <Droplet className="w-3.5 h-3.5 mr-1 text-rose-500" />
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={e => setBloodGroup(e.target.value)}
                disabled={patientMode === 'existing'}
                className={`w-full border rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-hidden font-bold ${
                  patientMode === 'existing' ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed' : 'bg-white border-slate-300 focus:border-teal-500'
                }`}
              >
                {BLOOD_GROUPS.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Age & Gender */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Age & Gender</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(parseInt(e.target.value) || 0)}
                  disabled={patientMode === 'existing'}
                  className={`w-16 border rounded-lg px-2 py-1.5 text-xs text-slate-900 ${
                    patientMode === 'existing' ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed' : 'bg-white border-slate-300'
                  }`}
                />
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  disabled={patientMode === 'existing'}
                  className={`flex-1 border rounded-lg px-2 py-1.5 text-xs text-slate-900 ${
                    patientMode === 'existing' ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed' : 'bg-white border-slate-300'
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* MRN */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Medical Record Number (MRN)</label>
              <input
                type="text"
                value={mrn}
                onChange={e => setMrn(e.target.value)}
                disabled={patientMode === 'existing'}
                className={`w-full border rounded-lg px-2.5 py-1.5 text-xs text-slate-900 ${
                  patientMode === 'existing' ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed' : 'bg-white border-slate-300'
                }`}
              />
            </div>

            {/* Laboratory Facility */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Laboratory Facility</label>
              <input
                type="text"
                value={labName}
                onChange={e => setLabName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            {/* Sample Collection Date */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Collection Date & Time</label>
              <input
                type="text"
                value={collectionDate}
                onChange={e => setCollectionDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            {/* Referring Physician */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Referring Physician</label>
              <input
                type="text"
                value={referringDoctor}
                onChange={e => setReferringDoctor(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Laboratory Test Results */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs flex items-center">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[11px] mr-2">2</span>
              Enter or Paste Laboratory Tests
            </h4>
            <span className="text-[11px] text-teal-700 font-medium flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Automated Clinical AI Parser
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Paste one test per line in standard format: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">Test Name: Result Unit (Ref: min - max)</code>
          </p>

          <textarea
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            rows={8}
            className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-teal-500 focus:bg-white text-slate-800 leading-relaxed"
            placeholder="Paste lab results here..."
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{rawText.split('\n').filter(l => l.trim()).length} test parameters detected</span>
            <button
              onClick={() => setRawText(PRESET_SAMPLE_TEXT)}
              className="text-teal-700 hover:underline font-semibold"
            >
              Reset to Sample Data
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleParseAndCreate}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate & Analyze Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
