export type TestPriority = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'GRAY';

export type ResultStatus = 
  | 'Normal'
  | 'High'
  | 'Low'
  | 'Borderline High'
  | 'Borderline Low'
  | 'Critical High'
  | 'Critical Low'
  | 'Unverified';

export type MedicalCategory =
  | 'Complete Blood Count (CBC)'
  | 'Blood Sugar & Diabetes Screening'
  | 'Lipid Profile & Cholesterol'
  | 'Kidney Function'
  | 'Liver Function'
  | 'Complete Urine Examination (CUE)'
  | 'Thyroid Function'
  | 'Vitamins & Nutritional Markers'
  | 'Electrolytes & Minerals'
  | 'Inflammatory Markers'
  | 'Cardiac & Coagulation Markers'
  | 'Other Laboratory Tests';

export interface TestHistoryPoint {
  date: string;
  value: number;
  unit: string;
  status: ResultStatus;
}

export interface LabTest {
  id: string;
  name: string;
  shortName?: string;
  category: MedicalCategory;
  value: number | string;
  numericValue?: number;
  unit: string;
  refRange: {
    min?: number;
    max?: number;
    text: string;
  };
  status: ResultStatus;
  priority: TestPriority;
  isCalculated?: boolean;
  sourcePage?: number;
  
  // Interpretation
  plainMeaning: string; // 5th-grade level explanation
  whatItMeasures: string;
  whyItMatters: string;
  commonCauses: string[];
  relatedTests: string[];
  influencingFactors: string[];
  clinicalFollowUp: string;
  doctorQuestion: string;
  
  // Historical / Trends
  previousValue?: number | string;
  previousNumericValue?: number;
  previousDate?: string;
  history?: TestHistoryPoint[];
}

export interface KeyFinding {
  id: string;
  testId: string;
  testName: string;
  category: MedicalCategory;
  reportedResult: string;
  refRange: string;
  priority: TestPriority;
  priorityLabel: string;
  status: ResultStatus;
  plainLanguageExplanation: string;
  whyItMatters: string;
  recommendedFollowUp: string;
}

export interface ClinicalPattern {
  id: string;
  title: string;
  priority: TestPriority;
  supportingTestIds: string[];
  supportingResultsSummary: { name: string; value: string; status: ResultStatus }[];
  possibleMeaning: string;
  alternativeExplanations: string[];
  recommendedDoctorQuestions: string[];
}

export interface DoctorQuestion {
  id: string;
  question: string;
  relatedTestId?: string;
  relatedTestName?: string;
  whyItMatters: string;
  discussed: boolean;
  patientNotes?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ChecklistItem {
  id: string;
  task: string;
  details: string;
  completed: boolean;
  category: 'documents' | 'medications' | 'symptoms' | 'preparation';
}

export interface FollowUpItem {
  id: string;
  finding: string;
  whyItDeservesAttention: string;
  urgencyLevel: 'Emergency' | 'Prompt Clinical Review' | 'Routine Follow-Up';
  urgencyTier: 1 | 2 | 3;
  priority: TestPriority;
  whatToDiscuss: string;
  suggestedTimeframe: string;
}

export type PredictionCategory =
  | 'Cardiovascular & Arterial Plaque'
  | 'Insulin Resistance & Pancreatic Load'
  | 'Early Renal Function Decline'
  | 'Oxidative Stress & Liver Iron Load'
  | 'Cerebrovascular & Endothelial Injury'
  | 'Cancer Biomarkers & Cellular Turnover';

export interface EarlyPredictionItem {
  id: string;
  category: PredictionCategory;
  name: string;
  biomarkersUsed: string[];
  calculatedRatioOrScore?: {
    label: string;
    value: string | number;
    unit?: string;
    optimalRange: string;
  };
  riskTier: 'Optimal / Low Risk' | 'Moderate / Early Warning' | 'Elevated Risk' | 'Surveillance Stable';
  riskScorePercent: number; // 0 to 100 for gauge visualization
  plainMeaning: string;
  clinicalMechanism: string;
  importantCaveats: string[]; // Critical non-malignant/benign limitations
  doctorDiscussion: string;
}

export interface OriginalReportBoundingBox {
  id: string;
  testId: string;
  testName: string;
  page: number;
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  extractedText: string;
}

export interface PatientVitals {
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  bmiCategory?: 'Underweight' | 'Normal' | 'Overweight' | 'Obese Class I' | 'Obese Class II+';
  waistCircumferenceCm?: number;
  waistToHeightRatio?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  bpStage?: 'Normal' | 'Elevated' | 'Stage 1 Hypertension' | 'Stage 2 Hypertension' | 'Hypertensive Crisis';
  heartRateBpm?: number;
  spo2Percent?: number;
}

export interface PatientLifestyle {
  smokingStatus?: 'Never Smoker' | 'Former Smoker' | 'Current Smoker (Light)' | 'Current Smoker (Heavy)';
  smokingDetails?: string;
  alcoholIntake?: 'None' | 'Occasional' | 'Moderate' | 'Heavy';
  alcoholDetails?: string;
  physicalActivity?: 'Sedentary' | 'Light (1-2 days/wk)' | 'Moderate (3-4 days/wk)' | 'Active (5+ days/wk)';
  dietType?: 'Standard / Mixed' | 'Low-Carb / Keto' | 'Vegetarian / Plant-Based' | 'Mediterranean' | 'High-Sodium / Processed';
  sleepHoursPerNight?: number;
}

export interface PatientProfile {
  id: string;
  fullName: string;
  initials: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  mrn: string; // Medical Record Number
  referringDoctor?: string;
  vitals?: PatientVitals;
  lifestyle?: PatientLifestyle;
  preExistingDiseases?: string[];
}

export interface LabReport {
  id: string;
  patient: PatientProfile;
  reportDate: string;
  collectionDate: string;
  labName: string;
  labAddress: string;
  accreditation: string;
  status: 'Analysis Complete' | 'Partially Reviewed' | 'Manual Verification Needed';
  tests: LabTest[];
  keyFindings: KeyFinding[];
  patterns: ClinicalPattern[];
  doctorQuestions: DoctorQuestion[];
  checklist: ChecklistItem[];
  followUps: FollowUpItem[];
  earlyPredictions?: EarlyPredictionItem[];
  originalReportPages: {
    pageNumber: number;
    title: string;
    imageUrl?: string;
    fileMeta?: {
      name: string;
      size: string;
      type: string;
    };
    sections: {
      category: string;
      rawLines: string[];
    }[];
  }[];
  boundingBoxes: OriginalReportBoundingBox[];
}
