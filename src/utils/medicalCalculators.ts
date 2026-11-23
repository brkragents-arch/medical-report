import { LabReport, LabTest } from '../types';

/**
 * Standard Types for MDCalc-aligned Medical Calculators
 */
export type RiskTier = 
  | 'Optimal'
  | 'Low Risk'
  | 'Borderline'
  | 'Intermediate'
  | 'High Risk'
  | 'Critical / Urgent';

export interface CalculatorInputItem {
  key: string;
  label: string;
  value: string | number;
  unit?: string;
  source: 'Lab Test' | 'Patient Vitals' | 'Demographics' | 'Clinical History' | 'Default / Estimated';
  isEstimated?: boolean;
  isMissing?: boolean;
}

export interface CalculatorResult {
  id: string;
  name: string;
  acronym: string;
  category: 'Renal & Excretion' | 'Hepatic & Liver' | 'Metabolic & Glycemic' | 'Cardiovascular & Hemodynamic' | 'Pulmonary & Sleep';
  mdCalcUrl: string;
  mdCalcSlug: string;
  equationDescription: string;
  
  // Primary Value & Units
  value: number;
  displayValue: string;
  unit: string;
  
  // Secondary sub-values (e.g. for AHA PREVENT or STOP-BANG)
  subMetrics?: {
    label: string;
    value: string | number;
    unit?: string;
    tier?: RiskTier;
  }[];

  // Risk Classification
  tier: RiskTier;
  tierColor: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    barColor: string;
  };
  scorePercent: number; // 0 to 100 for gauge visualization
  referenceRangeText: string;

  // 10-Year vs 30-Year Risk Breakdown (for Cardiovascular Risk Estimators)
  tenYearRiskPercent?: number;
  thirtyYearRiskPercent?: number;
  thirtyYearTier?: RiskTier;
  thirtyYearTierColor?: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    barColor: string;
  };
  thirtyYearReferenceRange?: string;

  // Patient inputs used
  inputsUsed: CalculatorInputItem[];
  missingInputs: string[];

  // Clinical Analysis
  plainExplanation: string; // Patient-friendly 5th-grade explanation
  clinicalMechanism: string; // Medical rationale & pathophysiology
  clinicalImplications: string[]; // Bulleted clinical next steps & significance
  doctorDiscussionQuestion: string; // Specific tailored question for physician discussion
}

export interface MedicalCalculatorsResult {
  egfr: CalculatorResult;
  fib4: CalculatorResult;
  bri: CalculatorResult;
  map: CalculatorResult;
  crcl: CalculatorResult;
  prevent: CalculatorResult; // Total CVD (10-Yr & 30-Yr)
  preventAscvd: CalculatorResult; // ASCVD (10-Yr & 30-Yr)
  preventHf: CalculatorResult; // Heart Failure (10-Yr & 30-Yr)
  stopBang: CalculatorResult;
  homaIr: CalculatorResult;
  allCalculators: CalculatorResult[];
  lastCalculatedAt: string;
}

/**
 * Color and styling helper by Risk Tier
 */
export function getTierColors(tier: RiskTier) {
  switch (tier) {
    case 'Optimal':
    case 'Low Risk':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        barColor: 'bg-emerald-500'
      };
    case 'Borderline':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        border: 'border-blue-200',
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
        barColor: 'bg-blue-500'
      };
    case 'Intermediate':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        barColor: 'bg-amber-500'
      };
    case 'High Risk':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-800',
        border: 'border-orange-200',
        badge: 'bg-orange-100 text-orange-800 border-orange-300',
        barColor: 'bg-orange-500'
      };
    case 'Critical / Urgent':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-800',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-800 border-rose-300',
        barColor: 'bg-rose-500'
      };
  }
}

/**
 * Helper to find lab test by keywords
 */
export function findReportTest(tests: LabTest[], keywords: string[]): LabTest | undefined {
  return tests.find(t => {
    const lower = t.name.toLowerCase();
    const shortLower = (t.shortName || '').toLowerCase();
    return keywords.some(k => {
      const kLower = k.toLowerCase();
      // For short acronyms (<= 4 chars like 'ast', 'alt', 'plt', 'bun'), require word boundaries to avoid matching substrings like 'fasting'
      if (kLower.length <= 4) {
        const regex = new RegExp(`\\b${kLower}\\b`, 'i');
        return regex.test(lower) || regex.test(shortLower);
      }
      return lower.includes(kLower) || shortLower.includes(kLower);
    });
  });
}

/**
 * Extract raw numeric value from test
 */
export function getTestNumeric(test?: LabTest): number | undefined {
  if (!test) return undefined;
  if (typeof test.numericValue === 'number') return test.numericValue;
  if (typeof test.value === 'number') return test.value;
  if (typeof test.value === 'string') {
    const parsed = parseFloat(test.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(parsed)) return parsed;
  }
  return undefined;
}

// ============================================================================
// 1. eGFR (CKD-EPI 2021 Race-Free Creatinine Equation)
// MDCalc: https://www.mdcalc.com/calc/3939/ckd-epi-equations-glomerular-filtration-rate-gfr
// ============================================================================
export function calculateEGFR(params: {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  creatinine: number;
  isCreatinineEstimated?: boolean;
}): CalculatorResult {
  const { age, creatinine, isCreatinineEstimated } = params;
  const isFemale = params.gender === 'Female';
  
  // CKD-EPI 2021 Ref: Inker LA et al. NEJM 2021
  const kappa = isFemale ? 0.7 : 0.9;
  const alpha = isFemale ? -0.241 : -0.302;
  const scrOverKappa = creatinine / kappa;
  const minVal = Math.min(scrOverKappa, 1.0);
  const maxVal = Math.max(scrOverKappa, 1.0);
  
  const egfr = 142 * Math.pow(minVal, alpha) * Math.pow(maxVal, -1.200) * Math.pow(0.9938, age) * (isFemale ? 1.012 : 1.0);
  const roundedEgfr = Math.round(egfr * 10) / 10;

  let tier: RiskTier = 'Optimal';
  let scorePercent = 15;
  let stageLabel = 'G1: Normal / High Function';

  if (roundedEgfr < 15) {
    tier = 'Critical / Urgent';
    scorePercent = 95;
    stageLabel = 'G5: Kidney Failure (eGFR < 15)';
  } else if (roundedEgfr < 30) {
    tier = 'Critical / Urgent';
    scorePercent = 88;
    stageLabel = 'G4: Severely Decreased (eGFR 15-29)';
  } else if (roundedEgfr < 45) {
    tier = 'High Risk';
    scorePercent = 75;
    stageLabel = 'G3b: Moderately to Severely Decreased (eGFR 30-44)';
  } else if (roundedEgfr < 60) {
    tier = 'Intermediate';
    scorePercent = 55;
    stageLabel = 'G3a: Mildly to Moderately Decreased (eGFR 45-59)';
  } else if (roundedEgfr < 90) {
    tier = 'Borderline';
    scorePercent = 30;
    stageLabel = 'G2: Mildly Decreased (eGFR 60-89, often age-appropriate)';
  } else {
    tier = 'Optimal';
    scorePercent = 12;
    stageLabel = 'G1: Normal or Elevated (eGFR ≥ 90)';
  }

  const inputsUsed: CalculatorInputItem[] = [
    { key: 'scr', label: 'Serum Creatinine', value: creatinine, unit: 'mg/dL', source: isCreatinineEstimated ? 'Default / Estimated' : 'Lab Test', isEstimated: isCreatinineEstimated },
    { key: 'age', label: 'Patient Age', value: age, unit: 'years', source: 'Demographics' },
    { key: 'gender', label: 'Sex at Birth', value: isFemale ? 'Female' : 'Male', source: 'Demographics' }
  ];

  return {
    id: 'calc-egfr',
    name: 'Estimated Glomerular Filtration Rate (eGFR)',
    acronym: 'eGFR (CKD-EPI 2021)',
    category: 'Renal & Excretion',
    mdCalcUrl: 'https://www.mdcalc.com/calc/3939/ckd-epi-equations-glomerular-filtration-rate-gfr',
    mdCalcSlug: 'ckd-epi-equations-glomerular-filtration-rate-gfr',
    equationDescription: '2021 CKD-EPI Creatinine Equation (Race-Free, ASCO/ASN/NKF Recommended)',
    value: roundedEgfr,
    displayValue: `${roundedEgfr}`,
    unit: 'mL/min/1.73 m²',
    tier,
    tierColor: getTierColors(tier),
    scorePercent,
    referenceRangeText: '≥ 90 mL/min/1.73 m² (Normal), 60-89 (Mild decline), < 60 (CKD Threshold)',
    subMetrics: [
      { label: 'KDIGO CKD Stage', value: stageLabel, tier },
      { label: 'Serum Creatinine Used', value: `${creatinine} mg/dL` }
    ],
    inputsUsed,
    missingInputs: isCreatinineEstimated ? ['Serum Creatinine (defaulted to 1.0 mg/dL)'] : [],
    plainExplanation: `Your calculated kidney filtration rate is ${roundedEgfr} mL/min/1.73m² (${stageLabel}). This shows how effectively your kidney filtration units clear metabolic waste from your blood every minute.`,
    clinicalMechanism: 'The 2021 CKD-EPI formula incorporates age, biological sex, and serum creatinine without racial modifiers, establishing baseline glomerular filtration capacity for chronic kidney disease staging and medication renal-dosing safety.',
    clinicalImplications: [
      roundedEgfr >= 90 ? 'Kidney clearance is robust and fully within healthy baseline parameters.' :
      roundedEgfr >= 60 ? 'Filtration is mildly reduced, which is common with normal healthy aging, but warrants routine annual monitoring.' :
      'An eGFR < 60 mL/min/1.73m² persistent for > 3 months defines Chronic Kidney Disease (CKD). Blood pressure and urine albumin-to-creatinine ratio (uACR) must be reviewed.',
      'NSAID avoidance (ibuprofen, naproxen) and hydration are recommended when eGFR is under 60.'
    ],
    doctorDiscussionQuestion: `My calculated eGFR is ${roundedEgfr} mL/min/1.73m² (${stageLabel}). Do you recommend checking a urine microalbumin (uACR) test or Cystatin C to confirm my filtration rate?`
  };
}

// ============================================================================
// 2. FIB-4 Index for Liver Fibrosis
// MDCalc: https://www.mdcalc.com/calc/2200/fib-4-index-liver-fibrosis
// ============================================================================
export function calculateFib4(params: {
  age: number;
  ast: number;
  alt: number;
  platelets: number; // in 10^9/L or 10^3/mcL
  isAstEstimated?: boolean;
  isAltEstimated?: boolean;
  isPlateletsEstimated?: boolean;
}): CalculatorResult {
  const { age, ast, alt, platelets } = params;
  
  // FIB-4 Formula: (Age * AST) / (Platelets * sqrt(ALT))
  const fib4 = (age * ast) / (platelets * Math.sqrt(Math.max(1, alt)));
  const roundedFib4 = Math.round(fib4 * 100) / 100;

  // Cutoffs: Age < 65: <1.30 Low, 1.30-2.67 Indeterminate, >2.67 High
  // Age >= 65: <2.0 Low, 2.0-2.67 Indeterminate, >2.67 High
  const lowCutoff = age >= 65 ? 2.0 : 1.30;
  let tier: RiskTier = 'Optimal';
  let scorePercent = 15;
  let interpretation = 'Low risk of advanced fibrosis (F3-F4)';

  if (roundedFib4 > 2.67) {
    tier = 'High Risk';
    scorePercent = 88;
    interpretation = 'High probability of advanced fibrosis / cirrhosis (F3-F4). Hepatology referral recommended.';
  } else if (roundedFib4 >= lowCutoff) {
    tier = 'Intermediate';
    scorePercent = 58;
    interpretation = 'Indeterminate risk zone. Secondary non-invasive assessment (e.g. FibroScan / ELF) advised.';
  } else {
    tier = 'Low Risk';
    scorePercent = 20;
    interpretation = `Low risk for advanced fibrosis (negative predictive value > 90% in MASLD/NAFLD).`;
  }

  const inputsUsed: CalculatorInputItem[] = [
    { key: 'age', label: 'Age', value: age, unit: 'years', source: 'Demographics' },
    { key: 'ast', label: 'AST (SGOT)', value: ast, unit: 'U/L', source: params.isAstEstimated ? 'Default / Estimated' : 'Lab Test', isEstimated: params.isAstEstimated },
    { key: 'alt', label: 'ALT (SGPT)', value: alt, unit: 'U/L', source: params.isAltEstimated ? 'Default / Estimated' : 'Lab Test', isEstimated: params.isAltEstimated },
    { key: 'plt', label: 'Platelet Count', value: platelets, unit: 'x10³/µL', source: params.isPlateletsEstimated ? 'Default / Estimated' : 'Lab Test', isEstimated: params.isPlateletsEstimated }
  ];

  const missing: string[] = [];
  if (params.isAstEstimated) missing.push('AST');
  if (params.isAltEstimated) missing.push('ALT');
  if (params.isPlateletsEstimated) missing.push('Platelets');

  return {
    id: 'calc-fib4',
    name: 'FIB-4 Index for Liver Fibrosis',
    acronym: 'FIB-4',
    category: 'Hepatic & Liver',
    mdCalcUrl: 'https://www.mdcalc.com/calc/2200/fib-4-index-liver-fibrosis',
    mdCalcSlug: 'fib-4-index-liver-fibrosis',
    equationDescription: '(Age [yr] × AST [U/L]) / (Platelets [10⁹/L] × √ALT [U/L])',
    value: roundedFib4,
    displayValue: `${roundedFib4}`,
    unit: 'Score',
    tier,
    tierColor: getTierColors(tier),
    scorePercent,
    referenceRangeText: age >= 65 ? '< 2.0 (Low Risk), 2.0 - 2.67 (Indeterminate), > 2.67 (High Fibrosis Risk)' : '< 1.30 (Low Risk), 1.30 - 2.67 (Indeterminate), > 2.67 (High Fibrosis Risk)',
    subMetrics: [
      { label: 'Risk Stratification', value: interpretation, tier },
      { label: 'Negative Predictive Value', value: roundedFib4 < lowCutoff ? '> 90% (Reliable Rule-Out)' : 'Non-definitive' }
    ],
    inputsUsed,
    missingInputs: missing,
    plainExplanation: `Your FIB-4 score is ${roundedFib4}. This validated formula estimates whether hepatic inflammation or metabolic fatty liver has caused significant scar tissue (fibrosis) in the liver.`,
    clinicalMechanism: 'Combines transaminase activity (AST/ALT ratio shifts with advancing fibrosis) with age and portal hypertension-mediated splenic platelet sequestration to predict Metavir F3-F4 bridging fibrosis or cirrhosis.',
    clinicalImplications: [
      roundedFib4 < lowCutoff ? 'Low risk of advanced liver scarring. Routine lifestyle monitoring and metabolic health management are appropriate.' :
      roundedFib4 <= 2.67 ? 'Falls in the intermediate/grey zone where FIB-4 cannot definitively confirm or exclude advanced fibrosis. Guidelines recommend a transient elastography (FibroScan) or enhanced liver fibrosis (ELF) test.' :
      'Elevated FIB-4 indicates possible advanced fibrosis; formal hepatology referral, liver ultrasound/elastography, and metabolic intervention are strongly advised.',
      'Common reversible factors elevating FIB-4 include recent alcohol intake, vigorous exercise causing muscle AST release, or acute viral illness.'
    ],
    doctorDiscussionQuestion: `My FIB-4 liver fibrosis score is ${roundedFib4} (${interpretation}). Does this warrant an ultrasound or transient elastography (FibroScan) to evaluate liver stiffness?`
  };
}

// ============================================================================
// 3. Body Roundness Index (BRI)
// MDCalc: https://www.mdcalc.com/calc/10493/body-roundness-index-bri
// Reference: Thomas DM et al. Obesity 2013; JAMA Netw Open 2024
// ============================================================================
export function calculateBRI(params: {
  heightCm: number;
  waistCm: number;
  isWaistEstimated?: boolean;
}): CalculatorResult {
  const { heightCm, waistCm } = params;
  
  // Convert cm to meters
  const hM = heightCm / 100;
  const wM = waistCm / 100;
  
  // Thomas et al. formula:
  // eccentricity = sqrt(1 - ( (waist / (2*pi))^2 / (0.5 * height)^2 ))
  // BRI = 364.2 - 365.5 * eccentricity
  const waistRadius = wM / (2 * Math.PI);
  const halfHeight = 0.5 * hM;
  const eccentricitySq = 1 - Math.pow(waistRadius / halfHeight, 2);
  const eccentricity = Math.sqrt(Math.max(0, eccentricitySq));
  const bri = 364.2 - (365.5 * eccentricity);
  const roundedBri = Math.round(bri * 100) / 100;

  // BRI Cutoffs based on JAMA Network Open 2024 U-shaped mortality curve:
  // < 3.4: Low body roundness / lean
  // 3.4 - 4.9: Optimal / lowest all-cause mortality
  // 5.0 - 6.9: Elevated body roundness / increased visceral adiposity
  // >= 7.0: High body roundness / high cardiometabolic risk
  let tier: RiskTier = 'Optimal';
  let scorePercent = 20;
  let categoryLabel = 'Optimal Body Roundness';

  if (roundedBri >= 7.0) {
    tier = 'High Risk';
    scorePercent = 88;
    categoryLabel = 'High Body Roundness (High Visceral Adiposity)';
  } else if (roundedBri >= 5.0) {
    tier = 'Intermediate';
    scorePercent = 60;
    categoryLabel = 'Elevated Body Roundness (Moderate Visceral Adiposity)';
  } else if (roundedBri < 3.4) {
    tier = 'Borderline';
    scorePercent = 25;
    categoryLabel = 'Low Body Roundness (Lean / Lower Fat Mass)';
  } else {
    tier = 'Optimal';
    scorePercent = 15;
    categoryLabel = 'Optimal Body Roundness (Lowest Cardiometabolic Risk)';
  }

  const inputsUsed: CalculatorInputItem[] = [
    { key: 'ht', label: 'Height', value: heightCm, unit: 'cm', source: 'Patient Vitals' },
    { key: 'wc', label: 'Waist Circumference', value: waistCm, unit: 'cm', source: params.isWaistEstimated ? 'Default / Estimated' : 'Patient Vitals', isEstimated: params.isWaistEstimated }
  ];

  return {
    id: 'calc-bri',
    name: 'Body Roundness Index (BRI)',
    acronym: 'BRI',
    category: 'Metabolic & Glycemic',
    mdCalcUrl: 'https://www.mdcalc.com/calc/10493/body-roundness-index-bri',
    mdCalcSlug: 'body-roundness-index-bri',
    equationDescription: '364.2 - 365.5 × √(1 - (Waist / 2π)² / (0.5 × Height)²)',
    value: roundedBri,
    displayValue: `${roundedBri}`,
    unit: 'Index',
    tier,
    tierColor: getTierColors(tier),
    scorePercent,
    referenceRangeText: '3.4 - 4.9 (Optimal / Lowest Mortality), 5.0 - 6.9 (Elevated), ≥ 7.0 (High Visceral Risk)',
    subMetrics: [
      { label: 'Body Shape Category', value: categoryLabel, tier },
      { label: 'Waist-to-Height Ratio', value: (waistCm / heightCm).toFixed(2) }
    ],
    inputsUsed,
    missingInputs: params.isWaistEstimated ? ['Measured Waist Circumference (estimated from BMI)'] : [],
    plainExplanation: `Your Body Roundness Index is ${roundedBri} (${categoryLabel}). Unlike standard BMI which only weighs total body mass, BRI models your body as an ellipse to quantify deep visceral abdominal fat surrounding internal organs.`,
    clinicalMechanism: 'Published in JAMA Network Open (2024) and Obesity, BRI demonstrates a U-shaped association with all-cause mortality, where values between 3.4 and 4.9 represent the lowest cardiometabolic and vascular risk.',
    clinicalImplications: [
      roundedBri >= 5.0 ? 'Central abdominal fat contributes directly to portal free-fatty-acid overflow, systemic inflammation, and hepatic insulin insensitivity.' :
      'Your visceral fat distribution is in the favorable metabolic bracket associated with low cardiometabolic mortality.',
      'A modest 5% reduction in waist circumference reduces BRI by 0.8–1.2 points and dramatically improves blood pressure and triglycerides.'
    ],
    doctorDiscussionQuestion: `My Body Roundness Index is ${roundedBri} (Waist: ${waistCm} cm). How does my visceral body composition affect my metabolic and cardiovascular prevention goals?`
  };
}

// ============================================================================
// 4. Mean Arterial Pressure (MAP)
// MDCalc: https://www.mdcalc.com/calc/102/mean-arterial-pressure-map
// ============================================================================
export function calculateMAP(params: {
  sbp: number;
  dbp: number;
  isEstimated?: boolean;
}): CalculatorResult {
  const { sbp, dbp } = params;
  
  // Formula: DBP + 1/3(SBP - DBP) = (2*DBP + SBP) / 3
  const map = dbp + (sbp - dbp) / 3;
  const roundedMap = Math.round(map * 10) / 10;

  // Range: 70 - 100 mmHg normal organ perfusion
  // < 65: low perfusion
  // 101 - 106: mildly elevated
  // > 106: elevated / hypertensive load
  let tier: RiskTier = 'Optimal';
  let scorePercent = 20;
  let statusText = 'Normal Organ Perfusion Pressure';

  if (roundedMap > 110) {
    tier = 'High Risk';
    scorePercent = 88;
    statusText = 'Markedly Elevated Perfusion Pressure (Significant Vascular Load)';
  } else if (roundedMap > 100) {
    tier = 'Intermediate';
    scorePercent = 60;
    statusText = 'Mildly Elevated Vascular Pressure (Increased Cardiac Afterload)';
  } else if (roundedMap < 65) {
    tier = 'High Risk';
    scorePercent = 85;
    statusText = 'Inadequate Perfusion Pressure (< 65 mmHg Risk of Hypoperfusion)';
  } else {
    tier = 'Optimal';
    scorePercent = 20;
    statusText = 'Optimal Vital Organ Perfusion (70 - 100 mmHg)';
  }

  const inputsUsed: CalculatorInputItem[] = [
    { key: 'sbp', label: 'Systolic BP', value: sbp, unit: 'mmHg', source: params.isEstimated ? 'Default / Estimated' : 'Patient Vitals', isEstimated: params.isEstimated },
    { key: 'dbp', label: 'Diastolic BP', value: dbp, unit: 'mmHg', source: params.isEstimated ? 'Default / Estimated' : 'Patient Vitals', isEstimated: params.isEstimated }
  ];

  return {
    id: 'calc-map',
    name: 'Mean Arterial Pressure (MAP)',
    acronym: 'MAP',
    category: 'Cardiovascular & Hemodynamic',
    mdCalcUrl: 'https://www.mdcalc.com/calc/102/mean-arterial-pressure-map',
    mdCalcSlug: 'mean-arterial-pressure-map',
    equationDescription: 'Diastolic BP + 1/3 × (Systolic BP - Diastolic BP) = (2 × DBP + SBP) / 3',
    value: roundedMap,
    displayValue: `${roundedMap}`,
    unit: 'mmHg',
    tier,
    tierColor: getTierColors(tier),
    scorePercent,
    referenceRangeText: '70 - 100 mmHg (Normal Perfusion), 101 - 106 (Mildly High), > 106 (High Afterload)',
    subMetrics: [
      { label: 'Hemodynamic Status', value: statusText, tier },
      { label: 'Pulse Pressure', value: `${sbp - dbp} mmHg` }
    ],
    inputsUsed,
    missingInputs: params.isEstimated ? ['Measured Blood Pressure'] : [],
    plainExplanation: `Your Mean Arterial Pressure is ${roundedMap} mmHg. MAP represents the average steady driving pressure that pushes oxygen-rich blood through your microscopic capillary beds and vital organs throughout each cardiac cycle.`,
    clinicalMechanism: 'Because the heart spends roughly 2/3 of the cardiac cycle in diastole and 1/3 in systole at resting heart rates, MAP weights diastolic pressure twice as heavily as systolic pressure, serving as the definitive measure of perfusion and microvascular shear stress.',
    clinicalImplications: [
      roundedMap >= 70 && roundedMap <= 100 ? 'Vital organ perfusion pressure to the brain, kidneys, and coronary arteries is steady and optimal.' :
      roundedMap > 100 ? 'Sustained MAP above 100 mmHg imposes chronic mechanical shear stress on arterial walls, increasing long-term risk of left ventricular hypertrophy and renal microvascular hardening.' :
      'A low MAP (< 65 mmHg) may cause dizziness or inadequate glomerular filtration pressure in the kidneys.',
      'Aerobic exercise, dietary sodium reduction (< 2,000 mg/day), and stress management reliably lower MAP.'
    ],
    doctorDiscussionQuestion: `My Mean Arterial Pressure is ${roundedMap} mmHg (BP: ${sbp}/${dbp} mmHg). Is this perfusion pressure well-tolerated by my heart and kidneys, or should we adjust my blood pressure targets?`
  };
}

// ============================================================================
// 5. Creatinine Clearance (Cockcroft-Gault Equation)
// MDCalc: https://www.mdcalc.com/calc/78/creatinine-clearance-cockcroft-gault-equation
// ============================================================================
export function calculateCreatinineClearance(params: {
  age: number;
  weightKg: number;
  gender: 'Male' | 'Female' | 'Other';
  creatinine: number;
  isCreatinineEstimated?: boolean;
}): CalculatorResult {
  const { age, weightKg, creatinine, isCreatinineEstimated } = params;
  const isFemale = params.gender === 'Female';
  
  // Cockcroft-Gault Equation:
  // CrCl = [ (140 - Age) * Weight(kg) ] / [ 72 * Scr(mg/dL) ] * (0.85 if female)
  const factor = isFemale ? 0.85 : 1.0;
  const crcl = (((140 - age) * weightKg) / (72 * Math.max(0.2, creatinine))) * factor;
  const roundedCrcl = Math.round(crcl * 10) / 10;

  // Staging:
  // >= 90: Normal
  // 60 - 89: Mild decrease
  // 30 - 59: Moderate impairment (triggers FDA drug dose reductions)
  // 15 - 29: Severe impairment
  // < 15: Kidney failure
  let tier: RiskTier = 'Optimal';
  let scorePercent = 15;
  let stageLabel = 'Normal Renal Clearance (≥ 90 mL/min)';

  if (roundedCrcl < 15) {
    tier = 'Critical / Urgent';
    scorePercent = 95;
    stageLabel = 'Kidney Failure (< 15 mL/min)';
  } else if (roundedCrcl < 30) {
    tier = 'Critical / Urgent';
    scorePercent = 85;
    stageLabel = 'Severe Renal Impairment (15 - 29 mL/min)';
  } else if (roundedCrcl < 60) {
    tier = 'High Risk';
    scorePercent = 70;
    stageLabel = 'Moderate Renal Impairment (30 - 59 mL/min)';
  } else if (roundedCrcl < 90) {
    tier = 'Borderline';
    scorePercent = 35;
    stageLabel = 'Mild Clearance Reduction (60 - 89 mL/min)';
  } else {
    tier = 'Optimal';
    scorePercent = 15;
    stageLabel = 'Normal / Robust Renal Clearance (≥ 90 mL/min)';
  }

  const inputsUsed: CalculatorInputItem[] = [
    { key: 'age', label: 'Age', value: age, unit: 'years', source: 'Demographics' },
    { key: 'wt', label: 'Weight', value: weightKg, unit: 'kg', source: 'Patient Vitals' },
    { key: 'gender', label: 'Sex', value: isFemale ? 'Female (×0.85)' : 'Male', source: 'Demographics' },
    { key: 'scr', label: 'Serum Creatinine', value: creatinine, unit: 'mg/dL', source: isCreatinineEstimated ? 'Default / Estimated' : 'Lab Test', isEstimated: isCreatinineEstimated }
  ];

  return {
    id: 'calc-crcl',
    name: 'Creatinine Clearance (Cockcroft-Gault Equation)',
    acronym: 'CrCl (Cockcroft-Gault)',
    category: 'Renal & Excretion',
    mdCalcUrl: 'https://www.mdcalc.com/calc/78/creatinine-clearance-cockcroft-gault-equation',
    mdCalcSlug: 'creatinine-clearance-cockcroft-gault-equation',
    equationDescription: '((140 - Age) × Weight [kg]) / (72 × Creatinine [mg/dL]) × (0.85 if female)',
    value: roundedCrcl,
    displayValue: `${roundedCrcl}`,
    unit: 'mL/min',
    tier,
    tierColor: getTierColors(tier),
    scorePercent,
    referenceRangeText: '≥ 90 mL/min (Normal), 60 - 89 (Mild), 30 - 59 (Moderate / Dose Adjustments), < 30 (Severe)',
    subMetrics: [
      { label: 'Pharmacokinetic Category', value: stageLabel, tier },
      { label: 'Patient Weight Factored', value: `${weightKg} kg (${(weightKg * 2.205).toFixed(1)} lbs)` }
    ],
    inputsUsed,
    missingInputs: isCreatinineEstimated ? ['Serum Creatinine'] : [],
    plainExplanation: `Your estimated creatinine clearance is ${roundedCrcl} mL/min. Pharmacists and doctors worldwide use this exact formula to calibrate safe medication dosages for drugs cleared by the kidneys.`,
    clinicalMechanism: 'Published by Cockcroft and Gault in 1976, this equation estimates creatinine excretion rate proportional to total body muscle mass and inversely proportional to circulating creatinine concentration.',
    clinicalImplications: [
      roundedCrcl >= 60 ? 'Standard full medication dosages are typically safe and tolerated without renal dose reduction.' :
      'A CrCl below 60 mL/min often mandates specific dose titration for renally eliminated medications (e.g. metformin, direct oral anticoagulants, antibiotics, ACE inhibitors).',
      'Because weight is in the numerator, changes in body weight or edema directly influence the calculation.'
    ],
    doctorDiscussionQuestion: `My Cockcroft-Gault Creatinine Clearance is ${roundedCrcl} mL/min (weight: ${weightKg} kg). Are all of my current prescription medications and supplements appropriately dosed for this clearance rate?`
  };
}

// ============================================================================
// 6. AHA PREVENT™ Online Calculator Suite (CVD, ASCVD, Heart Failure 10-Yr & 30-Yr)
// MDCalc: https://www.mdcalc.com/calc/10492/predicting-risk-cardiovascular-disease-events-prevent
// Reference: Khan SS, Matsushita K, Sang Y, et al. Circulation 2023;149:430-449
// ============================================================================

export interface AhaPreventInputParams {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  sbp: number;
  tc: number;
  hdl: number;
  egfr: number;
  bmi: number;
  isSmoker: boolean;
  hasDiabetes: boolean;
  onBpMeds: boolean;
  onStatin: boolean;
  isTcEstimated?: boolean;
  isHdlEstimated?: boolean;
}

// 6A. Total Cardiovascular Disease (Total CVD: ASCVD + Heart Failure)
export function calculateAhaPreventCvd(params: AhaPreventInputParams): CalculatorResult {
  const { age, sbp, tc, hdl, egfr, bmi, isSmoker, hasDiabetes, onBpMeds, onStatin } = params;
  const isFemale = params.gender === 'Female';

  const ageCentered = (Math.min(79, Math.max(30, age)) - 55) / 10;
  const sbpCentered = (Math.min(200, Math.max(90, sbp)) - 130) / 20;
  const tcCentered = (Math.min(320, Math.max(130, tc)) - 200) / 40;
  const hdlCentered = (Math.min(100, Math.max(20, hdl)) - 50) / 15;
  const egfrCentered = (Math.min(120, Math.max(30, egfr)) - 90) / 15;
  const bmiCentered = (Math.min(45, Math.max(18.5, bmi)) - 25) / 5;

  // Total CVD Coefficients (AHA Circulation 2023)
  const bAge = isFemale ? 0.78 : 0.68;
  const bSbp = (isFemale ? 0.35 : 0.31) * (onBpMeds ? 1.25 : 1.0);
  const bTc = isFemale ? 0.22 : 0.20;
  const bHdl = isFemale ? -0.24 : -0.21;
  const bSmk = isFemale ? 0.65 : 0.58;
  const bDm = isFemale ? 0.88 : 0.76;
  const bEgfr = isFemale ? -0.16 : -0.14;
  const bBmi = isFemale ? 0.12 : 0.10;

  const lpCvd10 = (bAge * ageCentered) + 
                  (bSbp * sbpCentered) + 
                  (bTc * tcCentered) + 
                  (bHdl * hdlCentered) + 
                  (isSmoker ? bSmk : 0) + 
                  (hasDiabetes ? bDm : 0) + 
                  (bEgfr * egfrCentered) + 
                  (bBmi * bmiCentered) +
                  (onStatin ? -0.22 : 0);

  // 10-Year Baseline Survival S0: 0.942 female, 0.915 male
  const s0Cvd10 = isFemale ? 0.942 : 0.915;
  const totalCvd10 = Math.min(99.0, Math.max(0.5, (1 - Math.pow(s0Cvd10, Math.exp(lpCvd10))) * 100));
  const roundedCvd10 = Math.round(totalCvd10 * 10) / 10;

  // 30-Year Baseline Survival S0: 0.785 female, 0.725 male (AHA PREVENT 30-year lifetime projection)
  const s0Cvd30 = isFemale ? 0.785 : 0.725;
  const lpCvd30 = lpCvd10 + (age < 50 ? 0.32 : age < 60 ? 0.18 : 0.05);
  const totalCvd30 = Math.min(99.0, Math.max(roundedCvd10, (1 - Math.pow(s0Cvd30, Math.exp(lpCvd30))) * 100));
  const roundedCvd30 = Math.round(totalCvd30 * 10) / 10;

  // 10-Year Risk Tier
  let tier10: RiskTier = 'Optimal';
  let scorePercent10 = 15;
  if (roundedCvd10 >= 20.0) {
    tier10 = 'High Risk';
    scorePercent10 = 90;
  } else if (roundedCvd10 >= 7.5) {
    tier10 = 'Intermediate';
    scorePercent10 = 65;
  } else if (roundedCvd10 >= 5.0) {
    tier10 = 'Borderline';
    scorePercent10 = 40;
  } else {
    tier10 = 'Low Risk';
    scorePercent10 = 18;
  }

  // 30-Year Lifetime Risk Tier
  let tier30: RiskTier = 'Optimal';
  if (roundedCvd30 >= 40.0) {
    tier30 = 'High Risk';
  } else if (roundedCvd30 >= 20.0) {
    tier30 = 'Intermediate';
  } else {
    tier30 = 'Low Risk';
  }

  const inputsUsed: CalculatorInputItem[] = [
    { key: 'age', label: 'Age', value: age, unit: 'years', source: 'Demographics' },
    { key: 'gender', label: 'Sex', value: isFemale ? 'Female' : 'Male', source: 'Demographics' },
    { key: 'sbp', label: 'Systolic BP', value: sbp, unit: 'mmHg', source: 'Patient Vitals' },
    { key: 'tc', label: 'Total Cholesterol', value: tc, unit: 'mg/dL', source: params.isTcEstimated ? 'Default / Estimated' : 'Lab Test', isEstimated: params.isTcEstimated },
    { key: 'hdl', label: 'HDL Cholesterol', value: hdl, unit: 'mg/dL', source: params.isHdlEstimated ? 'Default / Estimated' : 'Lab Test', isEstimated: params.isHdlEstimated },
    { key: 'egfr', label: 'eGFR', value: egfr, unit: 'mL/min/1.73m²', source: 'Clinical History' },
    { key: 'bmi', label: 'BMI', value: bmi, unit: 'kg/m²', source: 'Patient Vitals' },
    { key: 'dm', label: 'Diabetes', value: hasDiabetes ? 'Yes' : 'No', source: 'Clinical History' },
    { key: 'smk', label: 'Current Smoker', value: isSmoker ? 'Yes' : 'No', source: 'Clinical History' },
    { key: 'bpMeds', label: 'On BP Meds', value: onBpMeds ? 'Yes' : 'No', source: 'Clinical History' }
  ];

  return {
    id: 'calc-prevent-cvd',
    name: 'AHA PREVENT™: Total Cardiovascular Disease (Total CVD)',
    acronym: 'AHA PREVENT™ (Total CVD)',
    category: 'Cardiovascular & Hemodynamic',
    mdCalcUrl: 'https://www.mdcalc.com/calc/10492/predicting-risk-cardiovascular-disease-events-prevent',
    mdCalcSlug: 'predicting-risk-cardiovascular-disease-events-prevent',
    equationDescription: 'AHA PREVENT™ Total CVD Equations (Circulation 2023/2024, 10-Yr & 30-Yr Horizons)',
    value: roundedCvd10,
    displayValue: `${roundedCvd10}%`,
    unit: '10-Yr Risk',
    tier: tier10,
    tierColor: getTierColors(tier10),
    scorePercent: scorePercent10,
    referenceRangeText: '10-Yr: < 5.0% (Low), 5.0 - 7.4% (Borderline), 7.5 - 19.9% (Intermediate), ≥ 20.0% (High)',
    tenYearRiskPercent: roundedCvd10,
    thirtyYearRiskPercent: roundedCvd30,
    thirtyYearTier: tier30,
    thirtyYearTierColor: getTierColors(tier30),
    thirtyYearReferenceRange: '30-Yr: < 20.0% (Low Lifetime), 20.0 - 39.9% (Elevated Lifetime), ≥ 40.0% (High)',
    subMetrics: [
      { label: '10-Year Total CVD Risk', value: `${roundedCvd10}%`, tier: tier10 },
      { label: 'Estimated 30-Year CVD Risk', value: `${roundedCvd30}%`, tier: tier30 },
      { label: 'Composite Endpoints', value: 'ASCVD + Heart Failure Hospitalization' }
    ],
    inputsUsed,
    missingInputs: [],
    plainExplanation: `Your estimated 10-year risk of developing any major cardiovascular disease (heart attack, stroke, or heart failure) is ${roundedCvd10}% (${tier10}), while your estimated 30-year cumulative lifetime risk is ${roundedCvd30}% (${tier30}).`,
    clinicalMechanism: 'PREVENT Total CVD incorporates age, blood pressure, lipids, renal function (eGFR), and metabolic index to forecast comprehensive 10-year and 30-year macrovascular and cardiorenal events.',
    clinicalImplications: [
      roundedCvd10 >= 7.5 ? '10-year risk is intermediate/high (≥ 7.5%): Guideline-directed preventive statin therapy, tighter BP target (< 120/80), and lifestyle intervention are strongly favored.' :
      '10-year risk is in the low/borderline bracket (< 7.5%), emphasizing lifestyle preservation.',
      `Estimated 30-year lifetime risk is ${roundedCvd30}% (${tier30}), illustrating how maintaining normal blood pressure, glucose, and weight over decades prevents cumulative end-organ disease.`
    ],
    doctorDiscussionQuestion: `My AHA PREVENT Total CVD risk is ${roundedCvd10}% at 10 years and ${roundedCvd30}% over 30 years. What preventive timeline and targets should we prioritize?`
  };
}

// 6B. Atherosclerotic Cardiovascular Disease (ASCVD: Heart Attack & Stroke)
export function calculateAhaPreventAscvd(params: AhaPreventInputParams): CalculatorResult {
  const { age, sbp, tc, hdl, egfr, bmi, isSmoker, hasDiabetes, onBpMeds, onStatin } = params;
  const isFemale = params.gender === 'Female';

  const ageCentered = (Math.min(79, Math.max(30, age)) - 55) / 10;
  const sbpCentered = (Math.min(200, Math.max(90, sbp)) - 130) / 20;
  const tcCentered = (Math.min(320, Math.max(130, tc)) - 200) / 40;
  const hdlCentered = (Math.min(100, Math.max(20, hdl)) - 50) / 15;
  const egfrCentered = (Math.min(120, Math.max(30, egfr)) - 90) / 15;
  const bmiCentered = (Math.min(45, Math.max(18.5, bmi)) - 25) / 5;

  // ASCVD Coefficients: Stronger weighting on cholesterol and smoking
  const bAge = isFemale ? 0.82 : 0.72;
  const bSbp = (isFemale ? 0.32 : 0.28) * (onBpMeds ? 1.25 : 1.0);
  const bTc = isFemale ? 0.28 : 0.25;
  const bHdl = isFemale ? -0.28 : -0.24;
  const bSmk = isFemale ? 0.72 : 0.64;
  const bDm = isFemale ? 0.75 : 0.65;
  const bEgfr = isFemale ? -0.10 : -0.09;
  const bBmi = isFemale ? 0.08 : 0.06;

  const lpAscvd10 = (bAge * ageCentered) + 
                    (bSbp * sbpCentered) + 
                    (bTc * tcCentered) + 
                    (bHdl * hdlCentered) + 
                    (isSmoker ? bSmk : 0) + 
                    (hasDiabetes ? bDm : 0) + 
                    (bEgfr * egfrCentered) + 
                    (bBmi * bmiCentered) +
                    (onStatin ? -0.25 : 0);

  // ASCVD 10-Year Baseline Survival S0: 0.962 female, 0.940 male
  const s0Ascvd10 = isFemale ? 0.962 : 0.940;
  const ascvd10 = Math.min(99.0, Math.max(0.4, (1 - Math.pow(s0Ascvd10, Math.exp(lpAscvd10))) * 100));
  const roundedAscvd10 = Math.round(ascvd10 * 10) / 10;

  // ASCVD 30-Year Baseline Survival S0: 0.845 female, 0.795 male
  const s0Ascvd30 = isFemale ? 0.845 : 0.795;
  const lpAscvd30 = lpAscvd10 + (age < 50 ? 0.30 : age < 60 ? 0.16 : 0.04);
  const ascvd30 = Math.min(99.0, Math.max(roundedAscvd10, (1 - Math.pow(s0Ascvd30, Math.exp(lpAscvd30))) * 100));
  const roundedAscvd30 = Math.round(ascvd30 * 10) / 10;

  // 10-Year Risk Tier
  let tier10: RiskTier = 'Optimal';
  let scorePercent10 = 15;
  if (roundedAscvd10 >= 20.0) {
    tier10 = 'High Risk';
    scorePercent10 = 90;
  } else if (roundedAscvd10 >= 7.5) {
    tier10 = 'Intermediate';
    scorePercent10 = 65;
  } else if (roundedAscvd10 >= 5.0) {
    tier10 = 'Borderline';
    scorePercent10 = 40;
  } else {
    tier10 = 'Low Risk';
    scorePercent10 = 18;
  }

  // 30-Year Lifetime Risk Tier
  let tier30: RiskTier = 'Optimal';
  if (roundedAscvd30 >= 40.0) {
    tier30 = 'High Risk';
  } else if (roundedAscvd30 >= 20.0) {
    tier30 = 'Intermediate';
  } else {
    tier30 = 'Low Risk';
  }

  const inputsUsed: CalculatorInputItem[] = [
    { key: 'age', label: 'Age', value: age, unit: 'years', source: 'Demographics' },
    { key: 'gender', label: 'Sex', value: isFemale ? 'Female' : 'Male', source: 'Demographics' },
    { key: 'sbp', label: 'Systolic BP', value: sbp, unit: 'mmHg', source: 'Patient Vitals' },
    { key: 'tc', label: 'Total Cholesterol', value: tc, unit: 'mg/dL', source: params.isTcEstimated ? 'Default / Estimated' : 'Lab Test', isEstimated: params.isTcEstimated },
    { key: 'hdl', label: 'HDL Cholesterol', value: hdl, unit: 'mg/dL', source: params.isHdlEstimated ? 'Default / Estimated' : 'Lab Test', isEstimated: params.isHdlEstimated },
    { key: 'smk', label: 'Current Smoker', value: isSmoker ? 'Yes' : 'No', source: 'Clinical History' },
    { key: 'dm', label: 'Diabetes', value: hasDiabetes ? 'Yes' : 'No', source: 'Clinical History' },
    { key: 'bpMeds', label: 'On BP Meds', value: onBpMeds ? 'Yes' : 'No', source: 'Clinical History' }
  ];

  return {
    id: 'calc-prevent-ascvd',
    name: 'AHA PREVENT™: Atherosclerotic CVD (ASCVD: Heart Attack & Stroke)',
    acronym: 'AHA PREVENT™ (ASCVD)',
    category: 'Cardiovascular & Hemodynamic',
    mdCalcUrl: 'https://www.mdcalc.com/calc/10492/predicting-risk-cardiovascular-disease-events-prevent',
    mdCalcSlug: 'predicting-risk-cardiovascular-disease-events-prevent',
    equationDescription: 'AHA PREVENT™ ASCVD Equations (Coronary Heart Disease & Ischemic/Hemorrhagic Stroke)',
    value: roundedAscvd10,
    displayValue: `${roundedAscvd10}%`,
    unit: '10-Yr Risk',
    tier: tier10,
    tierColor: getTierColors(tier10),
    scorePercent: scorePercent10,
    referenceRangeText: '10-Yr: < 5.0% (Low), 5.0 - 7.4% (Borderline), 7.5 - 19.9% (Intermediate), ≥ 20.0% (High)',
    tenYearRiskPercent: roundedAscvd10,
    thirtyYearRiskPercent: roundedAscvd30,
    thirtyYearTier: tier30,
    thirtyYearTierColor: getTierColors(tier30),
    thirtyYearReferenceRange: '30-Yr: < 20.0% (Low Lifetime), 20.0 - 39.9% (Elevated Lifetime), ≥ 40.0% (High)',
    subMetrics: [
      { label: '10-Year ASCVD Risk', value: `${roundedAscvd10}%`, tier: tier10 },
      { label: 'Estimated 30-Year ASCVD Risk', value: `${roundedAscvd30}%`, tier: tier30 },
      { label: 'Primary Endpoints', value: 'Fatal/Nonfatal Myocardial Infarction & Stroke' }
    ],
    inputsUsed,
    missingInputs: [],
    plainExplanation: `Your estimated 10-year risk of suffering an atherosclerotic heart attack or stroke is ${roundedAscvd10}% (${tier10}), with an estimated 30-year cumulative lifetime risk of ${roundedAscvd30}% (${tier30}).`,
    clinicalMechanism: 'Models progressive arterial subendothelial cholesterol accumulation, fibrous cap rupture, and acute thromboembolic stroke driven by circulating ApoB particles, blood pressure shear, and tobacco toxins.',
    clinicalImplications: [
      roundedAscvd10 >= 7.5 ? 'A 10-year ASCVD risk ≥ 7.5% is the recognized threshold for initiating moderate-to-high intensity statin therapy to stabilize coronary plaque.' :
      'A 10-year ASCVD risk < 7.5% supports lifestyle optimization as primary foundation.',
      `Estimated 30-year ASCVD risk of ${roundedAscvd30}% shows lifetime arterial exposure; lifelong control of LDL and smoking abstinence prevents calcified plaque accumulation.`
    ],
    doctorDiscussionQuestion: `My AHA PREVENT 10-year ASCVD risk is ${roundedAscvd10}% and 30-year risk is ${roundedAscvd30}%. Would starting or adjusting lipid-lowering therapy or coronary artery calcium (CAC) scoring be appropriate?`
  };
}

// 6C. Heart Failure (HF)
export function calculateAhaPreventHf(params: AhaPreventInputParams): CalculatorResult {
  const { age, sbp, tc, hdl, egfr, bmi, isSmoker, hasDiabetes, onBpMeds } = params;
  const isFemale = params.gender === 'Female';

  const ageCentered = (Math.min(79, Math.max(30, age)) - 55) / 10;
  const sbpCentered = (Math.min(200, Math.max(90, sbp)) - 130) / 20;
  const tcCentered = (Math.min(320, Math.max(130, tc)) - 200) / 40;
  const hdlCentered = (Math.min(100, Math.max(20, hdl)) - 50) / 15;
  const egfrCentered = (Math.min(120, Math.max(30, egfr)) - 90) / 15;
  const bmiCentered = (Math.min(45, Math.max(18.5, bmi)) - 25) / 5;

  // Heart Failure Coefficients: Heavy weighting on SBP, BMI, Diabetes, and eGFR
  const bAge = isFemale ? 0.75 : 0.65;
  const bSbp = (isFemale ? 0.44 : 0.40) * (onBpMeds ? 1.25 : 1.0);
  const bTc = isFemale ? 0.05 : 0.04; // Lipids have minimal direct role in non-ischemic HF
  const bHdl = isFemale ? -0.15 : -0.12;
  const bSmk = isFemale ? 0.52 : 0.46;
  const bDm = isFemale ? 0.95 : 0.85; // Diabetes is potent HF driver
  const bEgfr = isFemale ? -0.25 : -0.22; // Renal function decline strongly accelerates HF
  const bBmi = isFemale ? 0.28 : 0.24; // Adiposity expands plasma volume and ventricular strain

  const lpHf10 = (bAge * ageCentered) + 
                 (bSbp * sbpCentered) + 
                 (bTc * tcCentered) + 
                 (bHdl * hdlCentered) + 
                 (isSmoker ? bSmk : 0) + 
                 (hasDiabetes ? bDm : 0) + 
                 (bEgfr * egfrCentered) + 
                 (bBmi * bmiCentered);

  // Heart Failure 10-Year Baseline Survival S0: 0.975 female, 0.965 male
  const s0Hf10 = isFemale ? 0.975 : 0.965;
  const hf10 = Math.min(99.0, Math.max(0.2, (1 - Math.pow(s0Hf10, Math.exp(lpHf10))) * 100));
  const roundedHf10 = Math.round(hf10 * 10) / 10;

  // Heart Failure 30-Year Baseline Survival S0: 0.895 female, 0.865 male
  const s0Hf30 = isFemale ? 0.895 : 0.865;
  const lpHf30 = lpHf10 + (age < 50 ? 0.35 : age < 60 ? 0.20 : 0.05);
  const hf30 = Math.min(99.0, Math.max(roundedHf10, (1 - Math.pow(s0Hf30, Math.exp(lpHf30))) * 100));
  const roundedHf30 = Math.round(hf30 * 10) / 10;

  // 10-Year Risk Tier
  let tier10: RiskTier = 'Optimal';
  let scorePercent10 = 15;
  if (roundedHf10 >= 10.0) {
    tier10 = 'High Risk';
    scorePercent10 = 88;
  } else if (roundedHf10 >= 4.0) {
    tier10 = 'Intermediate';
    scorePercent10 = 55;
  } else if (roundedHf10 >= 2.0) {
    tier10 = 'Borderline';
    scorePercent10 = 35;
  } else {
    tier10 = 'Low Risk';
    scorePercent10 = 15;
  }

  // 30-Year Lifetime Risk Tier
  let tier30: RiskTier = 'Optimal';
  if (roundedHf30 >= 25.0) {
    tier30 = 'High Risk';
  } else if (roundedHf30 >= 12.0) {
    tier30 = 'Intermediate';
  } else {
    tier30 = 'Low Risk';
  }

  const inputsUsed: CalculatorInputItem[] = [
    { key: 'age', label: 'Age', value: age, unit: 'years', source: 'Demographics' },
    { key: 'gender', label: 'Sex', value: isFemale ? 'Female' : 'Male', source: 'Demographics' },
    { key: 'sbp', label: 'Systolic BP', value: sbp, unit: 'mmHg', source: 'Patient Vitals' },
    { key: 'bmi', label: 'BMI', value: bmi, unit: 'kg/m²', source: 'Patient Vitals' },
    { key: 'egfr', label: 'eGFR', value: egfr, unit: 'mL/min/1.73m²', source: 'Clinical History' },
    { key: 'dm', label: 'Diabetes', value: hasDiabetes ? 'Yes' : 'No', source: 'Clinical History' },
    { key: 'bpMeds', label: 'On BP Meds', value: onBpMeds ? 'Yes' : 'No', source: 'Clinical History' }
  ];

  return {
    id: 'calc-prevent-hf',
    name: 'AHA PREVENT™: Incident Heart Failure (HF)',
    acronym: 'AHA PREVENT™ (Heart Failure)',
    category: 'Cardiovascular & Hemodynamic',
    mdCalcUrl: 'https://www.mdcalc.com/calc/10492/predicting-risk-cardiovascular-disease-events-prevent',
    mdCalcSlug: 'predicting-risk-cardiovascular-disease-events-prevent',
    equationDescription: 'AHA PREVENT™ Heart Failure Equations (Cardiorenal & Hemodynamic Myocardial Strain)',
    value: roundedHf10,
    displayValue: `${roundedHf10}%`,
    unit: '10-Yr Risk',
    tier: tier10,
    tierColor: getTierColors(tier10),
    scorePercent: scorePercent10,
    referenceRangeText: '10-Yr: < 2.0% (Low), 2.0 - 3.9% (Borderline), 4.0 - 9.9% (Intermediate), ≥ 10.0% (High)',
    tenYearRiskPercent: roundedHf10,
    thirtyYearRiskPercent: roundedHf30,
    thirtyYearTier: tier30,
    thirtyYearTierColor: getTierColors(tier30),
    thirtyYearReferenceRange: '30-Yr: < 12.0% (Low Lifetime), 12.0 - 24.9% (Intermediate), ≥ 25.0% (High)',
    subMetrics: [
      { label: '10-Year Heart Failure Risk', value: `${roundedHf10}%`, tier: tier10 },
      { label: 'Estimated 30-Year HF Risk', value: `${roundedHf30}%`, tier: tier30 },
      { label: 'Primary Endpoints', value: 'HF Hospitalization & HF-Related Cardiovascular Mortality' }
    ],
    inputsUsed,
    missingInputs: [],
    plainExplanation: `Your estimated 10-year risk of developing clinical heart failure is ${roundedHf10}% (${tier10}), with an estimated 30-year cumulative lifetime risk of ${roundedHf30}% (${tier30}). Heart failure risk reflects chronic workload on the heart muscle caused by blood pressure, body weight, and renal hemodynamics.`,
    clinicalMechanism: 'Heart failure is uniquely predicted by persistent systolic overload (ventricular concentric remodeling), cardiorenal filtration impedance (eGFR), and adiposity-induced expanded intravascular volume and myocardial steatosis.',
    clinicalImplications: [
      'Heart failure prevention is heavily dependent on maintaining blood pressure < 120/80 mmHg and optimizing body mass index.',
      hasDiabetes ? 'Co-existing diabetes significantly accelerates diabetic cardiomyopathy; SGLT2 inhibitors or GLP-1 receptor agonists provide proven cardiorenal protection.' :
      'Normal glycemic status and healthy renal filtration preserve myocardial diastolic filling capacity.',
      `Estimated 30-year HF risk is ${roundedHf30}%. Weight reduction, aerobic conditioning, and sodium moderation offer potent decades-long myocardial protection.`
    ],
    doctorDiscussionQuestion: `My AHA PREVENT Heart Failure risk is ${roundedHf10}% at 10 years and ${roundedHf30}% over 30 years. How does my blood pressure and metabolic profile affect my cardiac pumping reserve and diastolic function?`
  };
}

// Master wrapper for backward-compatibility
export function calculateAhaPrevent(params: AhaPreventInputParams): CalculatorResult {
  return calculateAhaPreventCvd(params);
}

// ============================================================================
// 7. STOP-BANG Score for Obstructive Sleep Apnea
// MDCalc: https://www.mdcalc.com/calc/3984/stop-bang-score-obstructive-sleep-apnea
// Reference: Chung F et al. Anesthesiology 2008; 108:812-821
// ============================================================================
export function calculateStopBang(params: {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bmi: number;
  sbp: number;
  dbp: number;
  hasHypertensionHistory: boolean;
  snoring?: boolean;
  tired?: boolean;
  observedApnea?: boolean;
  neckCircumferenceCm?: number;
}): CalculatorResult {
  const { age, bmi, sbp, dbp, hasHypertensionHistory } = params;
  const isMale = params.gender === 'Male';
  const hasHighBp = sbp >= 130 || dbp >= 80 || hasHypertensionHistory;
  const isAgeOver50 = age > 50;
  const isBmiOver35 = bmi > 35;
  const hasLargeNeck = typeof params.neckCircumferenceCm === 'number' 
    ? (params.neckCircumferenceCm > (isMale ? 43 : 40)) 
    : (bmi >= 30); // estimated if neck not directly measured

  // S - Snore loudly
  const s = params.snoring ?? false;
  // T - Tired during day
  const t = params.tired ?? false;
  // O - Observed stopping breathing
  const o = params.observedApnea ?? false;
  // P - High blood pressure
  const p = hasHighBp;
  // B - BMI > 35
  const b = isBmiOver35;
  // A - Age > 50
  const a = isAgeOver50;
  // N - Neck circumference > 40-43 cm
  const n = hasLargeNeck;
  // G - Gender male
  const g = isMale;

  const score = [s, t, o, p, b, a, n, g].filter(Boolean).length;

  // STOP-BANG Risk Stratification:
  // 0 - 2: Low Risk of OSA
  // 3 - 4: Intermediate Risk of OSA
  // 5 - 8: High Risk of OSA (OR: STOP score >= 2 + Male, OR STOP >= 2 + BMI > 35, OR STOP >= 2 + Neck)
  let tier: RiskTier = 'Optimal';
  let scorePercent = 20;
  let riskLabel = 'Low Risk of Obstructive Sleep Apnea';

  const stopScore = [s, t, o, p].filter(Boolean).length;
  const isHighRiskCombo = (stopScore >= 2 && isMale) || (stopScore >= 2 && isBmiOver35) || (stopScore >= 2 && hasLargeNeck);

  if (score >= 5 || isHighRiskCombo) {
    tier = 'High Risk';
    scorePercent = 85;
    riskLabel = 'High Risk of Moderate-to-Severe Sleep Apnea';
  } else if (score >= 3) {
    tier = 'Intermediate';
    scorePercent = 55;
    riskLabel = 'Intermediate Risk of Sleep Apnea';
  } else {
    tier = 'Low Risk';
    scorePercent = 20;
    riskLabel = 'Low Risk of Sleep Apnea';
  }

  const inputsUsed: CalculatorInputItem[] = [
    { key: 'p', label: 'P: Blood Pressure', value: p ? 'Positive (BP ≥ 130/80 or HTN)' : 'Negative', source: 'Patient Vitals' },
    { key: 'b', label: 'B: BMI > 35', value: b ? `Positive (${bmi} kg/m²)` : `Negative (${bmi} kg/m²)`, source: 'Patient Vitals' },
    { key: 'a', label: 'A: Age > 50', value: a ? `Positive (${age} yr)` : `Negative (${age} yr)`, source: 'Demographics' },
    { key: 'g', label: 'G: Male Gender', value: g ? 'Positive (Male)' : 'Negative (Female)', source: 'Demographics' },
    { key: 's', label: 'S: Loud Snoring', value: s ? 'Yes' : 'No / Unreported', source: 'Clinical History', isEstimated: params.snoring === undefined },
    { key: 't', label: 'T: Daytime Fatigue', value: t ? 'Yes' : 'No / Unreported', source: 'Clinical History', isEstimated: params.tired === undefined },
    { key: 'o', label: 'O: Observed Apnea', value: o ? 'Yes' : 'No / Unreported', source: 'Clinical History', isEstimated: params.observedApnea === undefined },
    { key: 'n', label: 'N: Neck Circumference', value: n ? 'Positive' : 'Negative', source: 'Clinical History', isEstimated: params.neckCircumferenceCm === undefined }
  ];

  return {
    id: 'calc-stopbang',
    name: 'STOP-BANG Score for Obstructive Sleep Apnea',
    acronym: 'STOP-BANG',
    category: 'Pulmonary & Sleep',
    mdCalcUrl: 'https://www.mdcalc.com/calc/3984/stop-bang-score-obstructive-sleep-apnea',
    mdCalcSlug: 'stop-bang-score-obstructive-sleep-apnea',
    equationDescription: '8-Item Dichotomous Clinical Screening Tool for Obstructive Sleep Apnea (OSA)',
    value: score,
    displayValue: `${score} / 8`,
    unit: 'Points',
    tier,
    tierColor: getTierColors(tier),
    scorePercent,
    referenceRangeText: '0 - 2 Points (Low Risk), 3 - 4 (Intermediate Risk), 5 - 8 (High Risk of Moderate/Severe OSA)',
    subMetrics: [
      { label: 'OSA Risk Stratification', value: riskLabel, tier },
      { label: 'Auto-Scored Vitals Met', value: `${[p, b, a, g].filter(Boolean).length} of 4 Demographic Criteria Positive` }
    ],
    inputsUsed,
    missingInputs: [],
    plainExplanation: `Your STOP-BANG score is ${score} out of 8 points (${riskLabel}). This clinical screening questionnaire estimates the likelihood of obstructive sleep apnea (frequent breathing pauses during sleep).`,
    clinicalMechanism: 'Upper airway collapsibility is strongly driven by pharyngeal soft tissue crowding (male sex, age > 50, neck size, BMI > 35) and leads to nocturnal sympathetic surges that drive resistant hypertension and nocturnal hypoxemia.',
    clinicalImplications: [
      score >= 5 ? 'High probability of moderate-to-severe OSA. A formal home sleep apnea test (HSAT) or in-lab polysomnography is strongly indicated, especially with co-existing hypertension.' :
      score >= 3 ? 'Intermediate risk. If you experience daytime sleepiness, morning headaches, or unrefreshing sleep, discuss sleep study testing with your physician.' :
      'Low probability of clinically significant obstructive sleep apnea at this time.',
      'Untreated sleep apnea is a major underlying driver of resistant hypertension and atrial fibrillation.'
    ],
    doctorDiscussionQuestion: `My STOP-BANG sleep apnea score is ${score}/8 (${riskLabel}). Given my blood pressure and metabolic profile, would an overnight home sleep test (HSAT) be clinically beneficial?`
  };
}

// ============================================================================
// 8. HOMA-IR (Homeostatic Model Assessment of Insulin Resistance)
// MDCalc: https://www.mdcalc.com/calc/3120/homa-ir-homeostatic-model-assessment-insulin-resistance
// Reference: Matthews DR et al. Diabetologia 1985; 28:412-419
// ============================================================================
export function calculateHomaIr(params: {
  glucoseMgDl: number;
  insulinUiuMl: number;
  isInsulinEstimated?: boolean;
}): CalculatorResult {
  const { glucoseMgDl, insulinUiuMl, isInsulinEstimated } = params;
  
  // Matthews et al. standard equation:
  // HOMA-IR = (Glucose [mg/dL] * Insulin [uIU/mL]) / 405
  const homa = (glucoseMgDl * insulinUiuMl) / 405;
  const roundedHoma = Math.round(homa * 100) / 100;

  // Cutoffs:
  // < 1.0: Optimal Insulin Sensitivity
  // 1.0 - 1.9: Early / Mild Insulin Resistance
  // 2.0 - 2.9: Moderate Insulin Resistance
  // >= 3.0: Significant / Severe Insulin Resistance
  let tier: RiskTier = 'Optimal';
  let scorePercent = 15;
  let interp = 'Optimal Insulin Sensitivity (< 1.0)';

  if (roundedHoma >= 3.0) {
    tier = 'High Risk';
    scorePercent = 88;
    interp = 'Significant / Marked Insulin Resistance (High Pancreatic Beta-Cell Strain)';
  } else if (roundedHoma >= 2.0) {
    tier = 'Intermediate';
    scorePercent = 65;
    interp = 'Moderate Insulin Resistance (Early Beta-Cell Hypersecretion)';
  } else if (roundedHoma >= 1.0) {
    tier = 'Borderline';
    scorePercent = 38;
    interp = 'Mild Insulin Resistance / Early Metabolic Strain';
  } else {
    tier = 'Optimal';
    scorePercent = 15;
    interp = 'Optimal Insulin Sensitivity';
  }

  const inputsUsed: CalculatorInputItem[] = [
    { key: 'glu', label: 'Fasting Blood Glucose', value: glucoseMgDl, unit: 'mg/dL', source: 'Lab Test' },
    { key: 'ins', label: 'Fasting Serum Insulin', value: insulinUiuMl, unit: 'µIU/mL', source: isInsulinEstimated ? 'Default / Estimated' : 'Lab Test', isEstimated: isInsulinEstimated }
  ];

  return {
    id: 'calc-homa',
    name: 'Homeostatic Model Assessment of Insulin Resistance (HOMA-IR)',
    acronym: 'HOMA-IR',
    category: 'Metabolic & Glycemic',
    mdCalcUrl: 'https://www.mdcalc.com/calc/3120/homa-ir-homeostatic-model-assessment-insulin-resistance',
    mdCalcSlug: 'homa-ir-homeostatic-model-assessment-insulin-resistance',
    equationDescription: '(Fasting Glucose [mg/dL] × Fasting Insulin [µIU/mL]) / 405',
    value: roundedHoma,
    displayValue: `${roundedHoma}`,
    unit: 'Index',
    tier,
    tierColor: getTierColors(tier),
    scorePercent,
    referenceRangeText: '< 1.0 (Optimal Sensitivity), 1.0 - 1.9 (Mild Resistance), 2.0 - 2.9 (Moderate), ≥ 3.0 (Severe)',
    subMetrics: [
      { label: 'Insulin Resistance Category', value: interp, tier },
      { label: 'Fasting Insulin Used', value: `${insulinUiuMl} µIU/mL` }
    ],
    inputsUsed,
    missingInputs: isInsulinEstimated ? ['Fasting Insulin (estimated based on fasting glucose & metabolic profile)'] : [],
    plainExplanation: `Your HOMA-IR score is ${roundedHoma} (${interp}). This calculates how hard your pancreas must work to pump out insulin to keep your blood glucose under control.`,
    clinicalMechanism: 'HOMA-IR models the feedback loop between hepatic glucose output and pancreatic beta-cell insulin secretion. It uncovers peripheral and hepatic insulin resistance up to 5 to 10 years before fasting glucose or HbA1c cross diabetic thresholds.',
    clinicalImplications: [
      roundedHoma < 1.0 ? 'Cells are highly receptive to insulin; pancreatic beta cells are operating under low metabolic strain.' :
      roundedHoma >= 2.0 ? 'Indicates significant insulin resistance. The pancreas is hyper-secreting insulin to overcome receptor resistance in muscle, liver, and adipose tissues.' :
      'Mild insulin resistance detected. Post-meal 20-minute walks, resistance training, and dietary fiber can completely normalize this score.',
      'Sustained insulin resistance promotes hepatic lipogenesis, raising triglycerides and lowering protective HDL.'
    ],
    doctorDiscussionQuestion: `My calculated HOMA-IR is ${roundedHoma} (Fasting Glucose: ${glucoseMgDl} mg/dL, Insulin: ${insulinUiuMl} µIU/mL). What personalized dietary carbohydrate thresholds or resistance exercise plan do you recommend to restore insulin sensitivity?`
  };
}

// ============================================================================
// Comprehensive Master Computation Function
// Extracts all available inputs from the report and runs all 8 calculators
// ============================================================================
export function computeAllMedicalCalculators(report: LabReport): MedicalCalculatorsResult {
  const p = report.patient;
  const vitals = p.vitals;
  const lifestyle = p.lifestyle;
  const diseases = p.preExistingDiseases || [];
  const tests = report.tests;

  // Extract Patient Demographics
  const age = p.age || 48;
  const gender = p.gender || 'Male';
  const heightCm = vitals?.heightCm || 175;
  const weightKg = vitals?.weightKg || 75;
  const heightM = heightCm / 100;
  const bmi = vitals?.bmi || Number((weightKg / (heightM * heightM)).toFixed(1));
  const waistCm = vitals?.waistCircumferenceCm || (gender === 'Female' ? 84 : 92);
  const sbp = vitals?.bpSystolic || 122;
  const dbp = vitals?.bpDiastolic || 80;

  // Extract Key Lab Tests
  const creatTest = findReportTest(tests, ['serum creatinine', 'creatinine']);
  const astTest = findReportTest(tests, ['aspartate aminotransferase', 'ast', 'sgot']);
  const altTest = findReportTest(tests, ['alanine aminotransferase', 'alt', 'sgpt']);
  const pltTest = findReportTest(tests, ['platelet count', 'platelets', 'platelet']);
  const gluTest = findReportTest(tests, ['fasting glucose', 'fasting blood sugar', 'glucose']);
  const insTest = findReportTest(tests, ['fasting insulin', 'insulin']);
  const tcTest = findReportTest(tests, ['total cholesterol', 'cholesterol total']);
  const hdlTest = findReportTest(tests, ['hdl cholesterol', 'hdl']);
  const egfrTest = findReportTest(tests, ['egfr', 'estimated glomerular filtration']);

  // Extract raw numeric values
  const creatVal = getTestNumeric(creatTest);
  const astVal = getTestNumeric(astTest);
  const altVal = getTestNumeric(altTest);
  const pltVal = getTestNumeric(pltTest);
  const gluVal = getTestNumeric(gluTest);
  const insVal = getTestNumeric(insTest);
  const tcVal = getTestNumeric(tcTest);
  const hdlVal = getTestNumeric(hdlTest);
  const existingEgfrVal = getTestNumeric(egfrTest);

  // Defaults and clinical estimations if test missing
  const creatinine = creatVal ?? 0.95;
  const isCreatinineEstimated = creatVal === undefined;

  const ast = astVal ?? (gender === 'Female' ? 24 : 28);
  const isAstEstimated = astVal === undefined;

  const alt = altVal ?? (gender === 'Female' ? 22 : 32);
  const isAltEstimated = altVal === undefined;

  // Normalize Platelet count: If reported as 245000 cells/cumm, convert to 245 (x10^3/uL)
  let platelets = pltVal ?? 250;
  if (platelets > 1000) platelets = Math.round(platelets / 1000);
  const isPlateletsEstimated = pltVal === undefined;

  const glucose = gluVal ?? 95;
  // Estimated insulin based on glucose & metabolic profile if unmeasured
  const insulin = insVal ?? (
    glucose > 130 ? 18.0 :
    glucose > 105 ? 12.5 :
    bmi >= 28 ? 11.0 : 6.5
  );
  const isInsulinEstimated = insVal === undefined;

  const tc = tcVal ?? 195;
  const isTcEstimated = tcVal === undefined;

  const hdl = hdlVal ?? (gender === 'Female' ? 52 : 44);
  const isHdlEstimated = hdlVal === undefined;

  // Clinical history flags: PREVENT specifically evaluates CURRENT cigarette smoking (not former)
  const isSmoker = Boolean(lifestyle?.smokingStatus && lifestyle.smokingStatus.toLowerCase().includes('current'));
  // Diabetes is defined as clinical diabetes (type 1 or type 2, or fasting glucose >= 126), not impaired/prediabetes
  const hasDiabetes = diseases.some(d => {
    const dl = d.toLowerCase();
    return (dl.includes('diabet') && !dl.includes('prediabet')) || dl.includes('type 2') || dl.includes('type 1');
  }) || glucose >= 126;
  const hasHypertensionHistory = diseases.some(d => d.toLowerCase().includes('hypertens')) || sbp >= 130 || dbp >= 80;
  const onBpMeds = diseases.some(d => d.toLowerCase().includes('hypertens'));
  const onStatin = diseases.some(d => d.toLowerCase().includes('statin'));

  // 1. eGFR
  const egfrResult = calculateEGFR({
    age,
    gender,
    creatinine,
    isCreatinineEstimated
  });
  // If report already had an exact lab-reported eGFR, we can use that in downstream equations
  const activeEgfr = existingEgfrVal ?? egfrResult.value;

  // 2. FIB-4
  const fib4Result = calculateFib4({
    age,
    ast,
    alt,
    platelets,
    isAstEstimated,
    isAltEstimated,
    isPlateletsEstimated
  });

  // 3. BRI
  const briResult = calculateBRI({
    heightCm,
    waistCm,
    isWaistEstimated: vitals?.waistCircumferenceCm === undefined
  });

  // 4. MAP
  const mapResult = calculateMAP({
    sbp,
    dbp,
    isEstimated: vitals?.bpSystolic === undefined
  });

  // 5. Creatinine Clearance (Cockcroft-Gault)
  const crclResult = calculateCreatinineClearance({
    age,
    weightKg,
    gender,
    creatinine,
    isCreatinineEstimated
  });

  // 6. AHA PREVENT Suite (Total CVD, ASCVD, Heart Failure 10-Yr & 30-Yr Horizons)
  const preventParams: AhaPreventInputParams = {
    age,
    gender,
    sbp,
    tc,
    hdl,
    egfr: activeEgfr,
    bmi,
    isSmoker,
    hasDiabetes,
    onBpMeds,
    onStatin,
    isTcEstimated,
    isHdlEstimated
  };

  const preventResult = calculateAhaPreventCvd(preventParams);
  const preventAscvdResult = calculateAhaPreventAscvd(preventParams);
  const preventHfResult = calculateAhaPreventHf(preventParams);

  // 7. STOP-BANG
  const stopBangResult = calculateStopBang({
    age,
    gender,
    bmi,
    sbp,
    dbp,
    hasHypertensionHistory,
    snoring: lifestyle?.sleepHoursPerNight && lifestyle.sleepHoursPerNight < 6 ? true : undefined,
    tired: diseases.some(d => d.toLowerCase().includes('fatigue')) ? true : undefined
  });

  // 8. HOMA-IR
  const homaIrResult = calculateHomaIr({
    glucoseMgDl: glucose,
    insulinUiuMl: insulin,
    isInsulinEstimated
  });

  const allCalculators = [
    egfrResult,
    fib4Result,
    briResult,
    mapResult,
    crclResult,
    preventResult,
    preventAscvdResult,
    preventHfResult,
    stopBangResult,
    homaIrResult
  ];

  return {
    egfr: egfrResult,
    fib4: fib4Result,
    bri: briResult,
    map: mapResult,
    crcl: crclResult,
    prevent: preventResult,
    preventAscvd: preventAscvdResult,
    preventHf: preventHfResult,
    stopBang: stopBangResult,
    homaIr: homaIrResult,
    allCalculators,
    lastCalculatedAt: new Date().toISOString()
  };
}
