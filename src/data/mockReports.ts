import { LabReport, PatientProfile } from '../types';

export const PATIENTS: PatientProfile[] = [
  {
    id: 'p-1',
    fullName: 'Alex M. Morgan',
    initials: 'AM',
    age: 48,
    gender: 'Male',
    dob: '1978-04-12',
    bloodGroup: 'O+',
    mrn: 'MRN-8942-019',
    referringDoctor: 'Dr. Sarah Jenkins, MD (Internal Medicine)',
    vitals: {
      heightCm: 178,
      weightKg: 84.5,
      bmi: 26.7,
      bmiCategory: 'Overweight',
      waistCircumferenceCm: 96,
      waistToHeightRatio: 0.54,
      bpSystolic: 134,
      bpDiastolic: 86,
      bpStage: 'Stage 1 Hypertension',
      heartRateBpm: 72,
      spo2Percent: 98
    },
    lifestyle: {
      smokingStatus: 'Former Smoker',
      smokingDetails: 'Quit 4 years ago (10 pack-year history)',
      alcoholIntake: 'Occasional',
      alcoholDetails: '1-2 drinks on weekends',
      physicalActivity: 'Light (1-2 days/wk)',
      dietType: 'Standard / Mixed',
      sleepHoursPerNight: 6.5
    },
    preExistingDiseases: [
      'Essential Hypertension (Mild)',
      'Impaired Fasting Glucose (Prediabetes)',
      'Dyslipidemia'
    ]
  },
  {
    id: 'p-2',
    fullName: 'Eleanor R. Vance',
    initials: 'EV',
    age: 62,
    gender: 'Female',
    dob: '1964-11-03',
    bloodGroup: 'A+',
    mrn: 'MRN-4412-880',
    referringDoctor: 'Dr. Robert Torres, MD (Endocrinology)',
    vitals: {
      heightCm: 162,
      weightKg: 76.0,
      bmi: 29.0,
      bmiCategory: 'Overweight',
      waistCircumferenceCm: 92,
      waistToHeightRatio: 0.57,
      bpSystolic: 142,
      bpDiastolic: 88,
      bpStage: 'Stage 2 Hypertension',
      heartRateBpm: 78,
      spo2Percent: 97
    },
    lifestyle: {
      smokingStatus: 'Never Smoker',
      alcoholIntake: 'None',
      physicalActivity: 'Sedentary',
      dietType: 'Mediterranean',
      sleepHoursPerNight: 7.0
    },
    preExistingDiseases: [
      'Type 2 Diabetes Mellitus (Diagnosed 2018)',
      'Diabetic Nephropathy (Early Stage 2)',
      'Essential Hypertension',
      'Mild Osteopenia'
    ]
  },
  {
    id: 'p-3',
    fullName: 'David K. Chen',
    initials: 'DC',
    age: 31,
    gender: 'Male',
    dob: '1995-07-21',
    bloodGroup: 'B+',
    mrn: 'MRN-1109-325',
    referringDoctor: 'Dr. Emily Watson, MD (Preventive Care)',
    vitals: {
      heightCm: 182,
      weightKg: 74.5,
      bmi: 22.5,
      bmiCategory: 'Normal',
      waistCircumferenceCm: 80,
      waistToHeightRatio: 0.44,
      bpSystolic: 118,
      bpDiastolic: 76,
      bpStage: 'Normal',
      heartRateBpm: 64,
      spo2Percent: 99
    },
    lifestyle: {
      smokingStatus: 'Never Smoker',
      alcoholIntake: 'Occasional',
      alcoholDetails: 'Socially 1 drink/month',
      physicalActivity: 'Active (5+ days/wk)',
      dietType: 'Standard / Mixed',
      sleepHoursPerNight: 7.5
    },
    preExistingDiseases: [
      'None (Annual Preventive Executive Wellness Exam)'
    ]
  },
  {
    id: 'p-4',
    fullName: 'Samantha J. Reed',
    initials: 'SR',
    age: 36,
    gender: 'Female',
    dob: '1990-09-14',
    bloodGroup: 'A-',
    mrn: 'MRN-6724-118',
    referringDoctor: 'Dr. Katherine Bell, MD (Endocrinology & Women\'s Health)',
    vitals: {
      heightCm: 165,
      weightKg: 60.5,
      bmi: 22.2,
      bmiCategory: 'Normal',
      waistCircumferenceCm: 73,
      waistToHeightRatio: 0.44,
      bpSystolic: 112,
      bpDiastolic: 72,
      bpStage: 'Normal',
      heartRateBpm: 68,
      spo2Percent: 99
    },
    lifestyle: {
      smokingStatus: 'Never Smoker',
      alcoholIntake: 'None',
      physicalActivity: 'Moderate (3-4 days/wk)',
      dietType: 'Vegetarian / Plant-Based',
      sleepHoursPerNight: 8.0
    },
    preExistingDiseases: [
      'Hashimoto\'s Autoimmune Thyroiditis (on levothyroxine)',
      'History of Iron Deficiency Anemia'
    ]
  },
  {
    id: 'p-5',
    fullName: 'Robert H. Gallagher',
    initials: 'RG',
    age: 67,
    gender: 'Male',
    dob: '1959-03-29',
    bloodGroup: 'O+',
    mrn: 'MRN-9204-743',
    referringDoctor: 'Dr. Andrew Miller, MD (Cardiometabolic Medicine)',
    vitals: {
      heightCm: 172,
      weightKg: 89.0,
      bmi: 30.1,
      bmiCategory: 'Obese Class I',
      waistCircumferenceCm: 105,
      waistToHeightRatio: 0.61,
      bpSystolic: 148,
      bpDiastolic: 92,
      bpStage: 'Stage 2 Hypertension',
      heartRateBpm: 82,
      spo2Percent: 94
    },
    lifestyle: {
      smokingStatus: 'Current Smoker (Light)',
      smokingDetails: '8-10 cigarettes/day (35 pack-year history)',
      alcoholIntake: 'Moderate',
      alcoholDetails: '1-2 beers/day',
      physicalActivity: 'Sedentary',
      dietType: 'High-Sodium / Processed',
      sleepHoursPerNight: 6.0
    },
    preExistingDiseases: [
      'Coronary Artery Disease (CAD - Stented 2021)',
      'Stage 2 Essential Hypertension',
      'Mild Chronic Obstructive Pulmonary / Chronic Bronchitis',
      'Non-Alcoholic Fatty Liver (NAFLD)'
    ]
  }
];

export const MOCK_REPORTS: Record<string, LabReport> = {
  'p-1': {
    id: 'rep-001',
    patient: PATIENTS[0],
    reportDate: 'October 18, 2026',
    collectionDate: 'October 17, 2026 (07:30 AM Fasting)',
    labName: 'Apex Diagnostics & Clinical Pathology Laboratories',
    labAddress: 'Suite 400, 750 Health Sciences Blvd, Boston, MA',
    accreditation: 'CAP & CLIA Accredited Laboratory #08D2183921',
    status: 'Analysis Complete',
    tests: [
      // 1. Complete Blood Count
      {
        id: 't-cbc-hb',
        name: 'Hemoglobin',
        shortName: 'Hb',
        category: 'Complete Blood Count (CBC)',
        value: 13.1,
        numericValue: 13.1,
        unit: 'g/dL',
        refRange: { min: 13.5, max: 17.5, text: '13.5 - 17.5 g/dL' },
        status: 'Low',
        priority: 'YELLOW',
        sourcePage: 1,
        plainMeaning: 'Hemoglobin is the protein in red blood cells that carries oxygen from your lungs to the rest of your body.',
        whatItMeasures: 'The concentration of oxygen-carrying protein in your bloodstream.',
        whyItMatters: 'Your result is mildly below the standard male range. Mildly low levels can sometimes cause mild tiredness or low stamina, though many people have no symptoms.',
        commonCauses: ['Mild iron deficiency or low dietary iron', 'Minor blood loss (e.g. gastrointestinal)', 'Vitamin B12 or folate insufficiency', 'Hydration or normal individual baseline variation'],
        relatedTests: ['Hematocrit', 'RBC Count', 'MCV', 'Ferritin', 'Serum Iron'],
        influencingFactors: ['Hydration levels (drinking lots of fluids can dilute blood)', 'High altitude', 'Recent blood donation or minor blood loss'],
        clinicalFollowUp: 'Discuss with your doctor if dietary review, iron profile (ferritin), or routine repeat testing in 3 months is warranted.',
        doctorQuestion: 'My hemoglobin is slightly below the reference range (13.1 g/dL). Do you recommend checking my iron or ferritin levels?',
        previousValue: 13.8,
        previousNumericValue: 13.8,
        previousDate: 'April 14, 2026',
        history: [
          { date: 'Oct 2025', value: 14.2, unit: 'g/dL', status: 'Normal' },
          { date: 'Apr 2026', value: 13.8, unit: 'g/dL', status: 'Normal' },
          { date: 'Oct 2026', value: 13.1, unit: 'g/dL', status: 'Low' }
        ]
      },
      {
        id: 't-cbc-rbc',
        name: 'Red Blood Cell (RBC) Count',
        shortName: 'RBC',
        category: 'Complete Blood Count (CBC)',
        value: 4.45,
        numericValue: 4.45,
        unit: 'million/mcL',
        refRange: { min: 4.30, max: 5.90, text: '4.30 - 5.90 million/mcL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 1,
        plainMeaning: 'The total number of red cells circulating in your blood.',
        whatItMeasures: 'Total cellular volume of oxygen-carrying cells.',
        whyItMatters: 'Within normal limits. Indicates normal red blood cell production from the bone marrow.',
        commonCauses: ['Normal physiologic baseline'],
        relatedTests: ['Hemoglobin', 'Hematocrit', 'MCV'],
        influencingFactors: ['Adequate hydration', 'Regular physical activity'],
        clinicalFollowUp: 'No specific follow-up required.',
        doctorQuestion: 'My total RBC count is normal. Does this confirm my bone marrow is producing enough red cells?',
        previousValue: 4.60,
        previousNumericValue: 4.60,
        previousDate: 'April 14, 2026',
        history: [
          { date: 'Oct 2025', value: 4.70, unit: 'million/mcL', status: 'Normal' },
          { date: 'Apr 2026', value: 4.60, unit: 'million/mcL', status: 'Normal' },
          { date: 'Oct 2026', value: 4.45, unit: 'million/mcL', status: 'Normal' }
        ]
      },
      {
        id: 't-cbc-pcv',
        name: 'Hematocrit (PCV)',
        shortName: 'HCT',
        category: 'Complete Blood Count (CBC)',
        value: 39.8,
        numericValue: 39.8,
        unit: '%',
        refRange: { min: 41.0, max: 50.0, text: '41.0 - 50.0 %' },
        status: 'Low',
        priority: 'YELLOW',
        sourcePage: 1,
        plainMeaning: 'Hematocrit tells you what percentage of your total blood is made up of red blood cells.',
        whatItMeasures: 'The volume percentage of red blood cells in whole blood.',
        whyItMatters: 'Borderline low, tracking closely with the slightly lower hemoglobin value.',
        commonCauses: ['Mild dilution from fluids', 'Slightly reduced red cell mass'],
        relatedTests: ['Hemoglobin', 'MCV'],
        influencingFactors: ['Fluid intake before blood draw'],
        clinicalFollowUp: 'Correlate with mild low hemoglobin during clinical review.',
        doctorQuestion: 'Does my hematocrit of 39.8% confirm mild anemia?',
        previousValue: 41.5,
        previousNumericValue: 41.5,
        previousDate: 'April 14, 2026'
      },
      {
        id: 't-cbc-mcv',
        name: 'Mean Corpuscular Volume (MCV)',
        shortName: 'MCV',
        category: 'Complete Blood Count (CBC)',
        value: 79.2,
        numericValue: 79.2,
        unit: 'fL',
        refRange: { min: 80.0, max: 100.0, text: '80.0 - 100.0 fL' },
        status: 'Low',
        priority: 'YELLOW',
        sourcePage: 1,
        plainMeaning: 'MCV measures the physical average size of your red blood cells.',
        whatItMeasures: 'Average red cell volume in femtoliters.',
        whyItMatters: 'A value slightly below 80 indicates that red blood cells are slightly smaller than average (microcytic), frequently linked with early iron deficiency or trait.',
        commonCauses: ['Early iron store depletion', 'Thalassemia trait (genetic variant)', 'Chronic minor inflammation'],
        relatedTests: ['Hemoglobin', 'Ferritin', 'MCH'],
        influencingFactors: ['Dietary iron intake', 'Genetic background'],
        clinicalFollowUp: 'A serum ferritin or iron profile will easily clarify if low iron stores are responsible.',
        doctorQuestion: 'My MCV is 79.2 fL (slightly small red cells). Should we test ferritin to check iron stores?',
        previousValue: 82.0,
        previousNumericValue: 82.0,
        previousDate: 'April 14, 2026'
      },
      {
        id: 't-cbc-wbc',
        name: 'White Blood Cell Count (WBC)',
        shortName: 'WBC',
        category: 'Complete Blood Count (CBC)',
        value: 6.8,
        numericValue: 6.8,
        unit: 'x10^3/mcL',
        refRange: { min: 4.5, max: 11.0, text: '4.5 - 11.0 x10^3/mcL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 1,
        plainMeaning: 'White blood cells are your body’s defense fighters that combat infections and illnesses.',
        whatItMeasures: 'Total immune fighting cells circulating in blood.',
        whyItMatters: 'Completely normal. No signs of active bacterial infection, significant allergic response, or bone marrow suppression.',
        commonCauses: ['Healthy immune status'],
        relatedTests: ['Neutrophils', 'Lymphocytes', 'ESR'],
        influencingFactors: ['Stress', 'Recent minor viruses', 'Strenuous exercise'],
        clinicalFollowUp: 'No follow-up required.',
        doctorQuestion: 'Is my immune cell count looking steady compared to previous visits?',
        previousValue: 6.5,
        previousNumericValue: 6.5,
        previousDate: 'April 14, 2026'
      },
      {
        id: 't-cbc-plt',
        name: 'Platelet Count',
        shortName: 'PLT',
        category: 'Complete Blood Count (CBC)',
        value: 242,
        numericValue: 242,
        unit: 'x10^3/mcL',
        refRange: { min: 150, max: 450, text: '150 - 450 x10^3/mcL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 1,
        plainMeaning: 'Platelets are tiny cell fragments that help your blood clot and seal cuts or wounds.',
        whatItMeasures: 'Blood clotting cell fragments count.',
        whyItMatters: 'Optimal level for normal blood clotting and vessel health.',
        commonCauses: ['Normal bone marrow function'],
        relatedTests: ['PT/INR', 'WBC'],
        influencingFactors: ['Infection', 'Medications like aspirin (affects function, not always count)'],
        clinicalFollowUp: 'No action needed.',
        doctorQuestion: 'Are my platelet counts completely within the safe range for routine procedures?',
        previousValue: 235,
        previousNumericValue: 235,
        previousDate: 'April 14, 2026'
      },

      // 2. Blood Sugar & Diabetes Screening
      {
        id: 't-glu-fasting',
        name: 'Fasting Blood Glucose',
        shortName: 'FBG',
        category: 'Blood Sugar & Diabetes Screening',
        value: 118,
        numericValue: 118,
        unit: 'mg/dL',
        refRange: { min: 70, max: 99, text: '70 - 99 mg/dL (Normal: <100, Prediabetes: 100-125)' },
        status: 'High',
        priority: 'YELLOW',
        sourcePage: 1,
        plainMeaning: 'Fasting blood glucose measures the amount of sugar in your blood after fasting (no food or sweet drinks) for 8-12 hours.',
        whatItMeasures: 'Basal glycemic control and morning insulin efficiency.',
        whyItMatters: 'Your result of 118 mg/dL is above the normal fasting threshold (<100 mg/dL) and falls into the prediabetes range (100–125 mg/dL). This is an early window of opportunity where lifestyle changes can often reverse or slow progression.',
        commonCauses: ['Insulin resistance', 'Sedentary habits or dietary carbohydrates', 'Sleep apnea or insufficient sleep', 'Stress hormones (cortisol)', 'Early metabolic changes'],
        relatedTests: ['HbA1c', 'Post-Prandial Glucose', 'Triglycerides', 'Lipid Profile'],
        influencingFactors: ['Did you fast for a full 8-12 hours before the draw?', 'Illness or fever', 'Certain medications like corticosteroids or beta-blockers'],
        clinicalFollowUp: 'Review with your doctor alongside HbA1c to assess prediabetes management, nutrition planning, and physical activity recommendations.',
        doctorQuestion: 'My fasting sugar is 118 mg/dL. Does this point to prediabetes, and what lifestyle modifications do you recommend?',
        previousValue: 106,
        previousNumericValue: 106,
        previousDate: 'April 14, 2026',
        history: [
          { date: 'Oct 2025', value: 98, unit: 'mg/dL', status: 'Normal' },
          { date: 'Apr 2026', value: 106, unit: 'mg/dL', status: 'Borderline High' },
          { date: 'Oct 2026', value: 118, unit: 'mg/dL', status: 'High' }
        ]
      },
      {
        id: 't-glu-hba1c',
        name: 'Hemoglobin A1c (HbA1c)',
        shortName: 'HbA1c',
        category: 'Blood Sugar & Diabetes Screening',
        value: 6.1,
        numericValue: 6.1,
        unit: '%',
        refRange: { min: 4.0, max: 5.6, text: '< 5.7% (Prediabetes: 5.7 - 6.4%, Diabetes: >= 6.5%)' },
        status: 'Borderline High',
        priority: 'YELLOW',
        sourcePage: 1,
        plainMeaning: 'HbA1c shows your average blood sugar level over the last 2 to 3 months by checking sugar attached to your red blood cells.',
        whatItMeasures: 'Long-term glycemic exposure (90-day window).',
        whyItMatters: 'At 6.1%, this is in the recognized prediabetes bracket (5.7% – 6.4%). Because HbA1c reflects 3 months, it confirms that the elevated fasting glucose is not just a one-day fluke.',
        commonCauses: ['Elevated average glucose exposure', 'Decreased insulin sensitivity in muscle and liver'],
        relatedTests: ['Fasting Glucose', 'Estimated Average Glucose (eAG)', 'Lipid Profile'],
        influencingFactors: ['Hemoglobin variants or anemia can slightly skew HbA1c (worth noting given mild low Hb)'],
        clinicalFollowUp: 'Consult with clinician for evidence-based prediabetes guidance (e.g. 5-7% weight loss, Mediterranean or lower-glycemic diet, 150 mins aerobic exercise weekly).',
        doctorQuestion: 'My HbA1c is 6.1% (prediabetes range). Should we retest in 3-6 months to monitor my progress?',
        previousValue: 5.8,
        previousNumericValue: 5.8,
        previousDate: 'April 14, 2026',
        history: [
          { date: 'Oct 2025', value: 5.5, unit: '%', status: 'Normal' },
          { date: 'Apr 2026', value: 5.8, unit: '%', status: 'Borderline High' },
          { date: 'Oct 2026', value: 6.1, unit: '%', status: 'Borderline High' }
        ]
      },
      {
        id: 't-glu-eag',
        name: 'Estimated Average Glucose (eAG)',
        shortName: 'eAG',
        category: 'Blood Sugar & Diabetes Screening',
        value: 128,
        numericValue: 128,
        unit: 'mg/dL',
        refRange: { min: 70, max: 114, text: '< 117 mg/dL' },
        status: 'Borderline High',
        priority: 'YELLOW',
        isCalculated: true,
        sourcePage: 1,
        plainMeaning: 'A calculated estimate of your continuous day-and-night average blood sugar calculated directly from your HbA1c.',
        whatItMeasures: 'Calculated mathematical translation of HbA1c into daily blood glucose units.',
        whyItMatters: 'Indicates your blood sugar across 24-hour cycles has been averaging approximately 128 mg/dL.',
        commonCauses: ['Mirrors HbA1c findings'],
        relatedTests: ['HbA1c', 'Fasting Blood Glucose'],
        influencingFactors: ['Direct mathematical formula from HbA1c: 28.7 * A1c - 46.7'],
        clinicalFollowUp: 'Use as an easy-to-understand reference for daily blood sugar expectations.',
        doctorQuestion: 'Is this average glucose consistent with what you expect for someone with prediabetes?'
      },

      // 3. Lipid Profile & Cholesterol
      {
        id: 't-lip-tot',
        name: 'Total Cholesterol',
        shortName: 'TC',
        category: 'Lipid Profile & Cholesterol',
        value: 224,
        numericValue: 224,
        unit: 'mg/dL',
        refRange: { min: 100, max: 199, text: '< 200 mg/dL' },
        status: 'High',
        priority: 'YELLOW',
        sourcePage: 2,
        plainMeaning: 'The total amount of all types of cholesterol circulating in your blood.',
        whatItMeasures: 'Combined total of LDL, HDL, and VLDL cholesterol fractions.',
        whyItMatters: 'Elevated total cholesterol over 200 mg/dL may contribute to gradual buildup of plaque in blood vessels over years if unaddressed.',
        commonCauses: ['Dietary saturated fats', 'Genetic cholesterol regulation', 'Metabolic syndrome', 'Low physical activity'],
        relatedTests: ['LDL Cholesterol', 'HDL Cholesterol', 'Triglycerides', 'hs-CRP'],
        influencingFactors: ['Dietary patterns in the preceding weeks', 'Family history of hyperlipidemia'],
        clinicalFollowUp: 'Your doctor can calculate your 10-year ASCVD (cardiovascular risk) score to decide whether diet alone or medications are best.',
        doctorQuestion: 'Given my total cholesterol of 224 mg/dL and my age of 48, what is my overall 10-year cardiovascular risk score?',
        previousValue: 208,
        previousNumericValue: 208,
        previousDate: 'April 14, 2026',
        history: [
          { date: 'Oct 2025', value: 195, unit: 'mg/dL', status: 'Normal' },
          { date: 'Apr 2026', value: 208, unit: 'mg/dL', status: 'Borderline High' },
          { date: 'Oct 2026', value: 224, unit: 'mg/dL', status: 'High' }
        ]
      },
      {
        id: 't-lip-trig',
        name: 'Triglycerides',
        shortName: 'TRIG',
        category: 'Lipid Profile & Cholesterol',
        value: 195,
        numericValue: 195,
        unit: 'mg/dL',
        refRange: { min: 30, max: 149, text: '< 150 mg/dL (Borderline: 150-199 mg/dL)' },
        status: 'Borderline High',
        priority: 'YELLOW',
        sourcePage: 2,
        plainMeaning: 'Triglycerides are the main form of dietary fat and stored energy in the bloodstream.',
        whatItMeasures: 'Circulating fat molecules from food and liver synthesis.',
        whyItMatters: 'Borderline high triglycerides frequently cluster with prediabetes and insulin resistance (metabolic pattern).',
        commonCauses: ['High intake of refined carbohydrates or sugary drinks', 'Alcohol consumption', 'Lack of exercise', 'Excess calorie intake'],
        relatedTests: ['Fasting Glucose', 'HDL Cholesterol', 'VLDL'],
        influencingFactors: ['Must be drawn strictly fasting (recent meal causes temporary spike)'],
        clinicalFollowUp: 'Often responds very positively to reducing simple sugars, limiting alcohol, and increasing brisk walking.',
        doctorQuestion: 'Could my elevated triglycerides (195 mg/dL) be connected to my prediabetes result?',
        previousValue: 168,
        previousNumericValue: 168,
        previousDate: 'April 14, 2026'
      },
      {
        id: 't-lip-hdl',
        name: 'HDL Cholesterol ("Good" Cholesterol)',
        shortName: 'HDL',
        category: 'Lipid Profile & Cholesterol',
        value: 43,
        numericValue: 43,
        unit: 'mg/dL',
        refRange: { min: 40, max: 60, text: '> 40 mg/dL (Optimal: > 50 mg/dL)' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'High-Density Lipoprotein helps clear out excess cholesterol from your arteries and returns it to your liver.',
        whatItMeasures: 'Protective cholesterol scavenger particles.',
        whyItMatters: 'Meets the basic minimum (>40 mg/dL for men), though an optimal target is often closer to 50 mg/dL or higher for maximum heart protection.',
        commonCauses: ['Normal baseline, potential room for improvement through aerobic cardio and healthy fats'],
        relatedTests: ['Total Cholesterol', 'LDL Cholesterol', 'Triglycerides'],
        influencingFactors: ['Aerobic exercise increases HDL', 'Smoking lowers HDL', 'Omega-3 fatty acids'],
        clinicalFollowUp: 'Lifestyle focus on aerobic activity and extra virgin olive oil/nuts can raise HDL.',
        doctorQuestion: 'What steps can I take to raise my HDL closer to optimal levels above 50 mg/dL?'
      },
      {
        id: 't-lip-ldl',
        name: 'LDL Cholesterol ("Bad" Cholesterol)',
        shortName: 'LDL',
        category: 'Lipid Profile & Cholesterol',
        value: 142,
        numericValue: 142,
        unit: 'mg/dL',
        refRange: { min: 50, max: 99, text: '< 100 mg/dL (Optimal), 100-129 (Near optimal), 130-159 (Borderline High)' },
        status: 'High',
        priority: 'YELLOW',
        isCalculated: true,
        sourcePage: 2,
        plainMeaning: 'Low-Density Lipoprotein carries cholesterol to your tissues. When too high, it can deposit plaque into arterial walls.',
        whatItMeasures: 'Atherogenic lipoprotein concentration (Friedewald calculation).',
        whyItMatters: '142 mg/dL is classified as borderline high to high. Managing LDL reduces long-term plaque formation and cardiovascular risk.',
        commonCauses: ['Saturated fat intake', 'Familial cholesterol handling', 'Metabolic rate changes'],
        relatedTests: ['Total Cholesterol', 'Non-HDL Cholesterol', 'ApoB'],
        influencingFactors: ['Diet high in butter, red meat, coconut/palm oil, or trans fats'],
        clinicalFollowUp: 'Discuss cardiovascular risk stratification with your physician to see if dietary trial for 3-6 months is appropriate before medication.',
        doctorQuestion: 'My LDL is 142 mg/dL. Do you recommend a trial of dietary changes, or should we consider medication based on my risk factors?',
        previousValue: 130,
        previousNumericValue: 130,
        previousDate: 'April 14, 2026',
        history: [
          { date: 'Oct 2025', value: 120, unit: 'mg/dL', status: 'Borderline High' },
          { date: 'Apr 2026', value: 130, unit: 'mg/dL', status: 'High' },
          { date: 'Oct 2026', value: 142, unit: 'mg/dL', status: 'High' }
        ]
      },
      {
        id: 't-lip-nonhdl',
        name: 'Non-HDL Cholesterol',
        shortName: 'Non-HDL',
        category: 'Lipid Profile & Cholesterol',
        value: 181,
        numericValue: 181,
        unit: 'mg/dL',
        refRange: { min: 0, max: 129, text: '< 130 mg/dL' },
        status: 'High',
        priority: 'YELLOW',
        isCalculated: true,
        sourcePage: 2,
        plainMeaning: 'Total cholesterol minus good HDL. Captures all artery-clogging particles in one single number.',
        whatItMeasures: 'Sum of all atherogenic lipoproteins (LDL + VLDL + IDL).',
        whyItMatters: 'Considered by cardiology guidelines to be an even better predictor of vascular health than LDL alone, especially when triglycerides are elevated.',
        commonCauses: ['Combined elevated LDL and elevated triglycerides'],
        relatedTests: ['Total Cholesterol', 'LDL', 'Triglycerides'],
        influencingFactors: ['Direct mathematical calculation: Total Cholesterol - HDL'],
        clinicalFollowUp: 'Included in cardiovascular risk assessment.',
        doctorQuestion: 'Does my non-HDL number (181 mg/dL) change your perspective on my heart health plan?'
      },

      // 4. Kidney Function
      {
        id: 't-kid-creat',
        name: 'Serum Creatinine',
        shortName: 'Cr',
        category: 'Kidney Function',
        value: 0.95,
        numericValue: 0.95,
        unit: 'mg/dL',
        refRange: { min: 0.70, max: 1.30, text: '0.70 - 1.30 mg/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'Creatinine is a natural waste byproduct from normal muscle breakdown that healthy kidneys filter out through urine.',
        whatItMeasures: 'Kidney filtration efficiency of muscle metabolic waste.',
        whyItMatters: 'Completely normal. Indicates that your kidneys are filtering waste properly.',
        commonCauses: ['Normal renal function'],
        relatedTests: ['eGFR', 'BUN', 'Urine Protein'],
        influencingFactors: ['High muscle mass', 'Heavy meat intake', 'Intense resistance exercise 24h prior'],
        clinicalFollowUp: 'No follow-up needed. Maintain good daily water intake.',
        doctorQuestion: 'Is my kidney filtration functioning normally based on my creatinine?'
      },
      {
        id: 't-kid-egfr',
        name: 'eGFR (Estimated Glomerular Filtration Rate)',
        shortName: 'eGFR',
        category: 'Kidney Function',
        value: 94,
        numericValue: 94,
        unit: 'mL/min/1.73m2',
        refRange: { min: 90, max: 120, text: '> 90 mL/min/1.73m2 (Normal kidney function)' },
        status: 'Normal',
        priority: 'GREEN',
        isCalculated: true,
        sourcePage: 2,
        plainMeaning: 'eGFR calculates how many milliliters of blood your kidneys clean every minute.',
        whatItMeasures: 'Overall kidney filtration capacity based on creatinine, age, and sex (CKD-EPI equation).',
        whyItMatters: 'A rate above 90 is considered optimal and healthy.',
        commonCauses: ['Healthy glomerular function'],
        relatedTests: ['Serum Creatinine', 'BUN'],
        influencingFactors: ['Age-related expected decline', 'Hydration status'],
        clinicalFollowUp: 'Routine annual monitoring.',
        doctorQuestion: 'Can you confirm my eGFR indicates full kidney filtration capacity?'
      },
      {
        id: 't-kid-bun',
        name: 'Blood Urea Nitrogen (BUN)',
        shortName: 'BUN',
        category: 'Kidney Function',
        value: 14,
        numericValue: 14,
        unit: 'mg/dL',
        refRange: { min: 7, max: 20, text: '7 - 20 mg/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'BUN measures the amount of nitrogen in your blood that comes from the waste product urea.',
        whatItMeasures: 'Protein metabolism waste clearance by kidneys and liver.',
        whyItMatters: 'Within the expected reference interval. Reflects balanced hydration and normal protein handling.',
        commonCauses: ['Normal baseline'],
        relatedTests: ['Serum Creatinine', 'eGFR'],
        influencingFactors: ['Dietary protein intake', 'Dehydration'],
        clinicalFollowUp: 'No action required.',
        doctorQuestion: 'Does my BUN result indicate normal hydration and protein breakdown?'
      },
      {
        id: 't-kid-uric',
        name: 'Serum Uric Acid',
        shortName: 'Uric Acid',
        category: 'Kidney Function',
        value: 6.2,
        numericValue: 6.2,
        unit: 'mg/dL',
        refRange: { min: 3.5, max: 7.2, text: '3.5 - 7.2 mg/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'Uric acid is produced when the body breaks down purines found in certain foods and cells.',
        whatItMeasures: 'Purine metabolite level in blood.',
        whyItMatters: 'Within normal limits. High levels can sometimes crystalize in joints causing gout, but your level is well within normal.',
        commonCauses: ['Normal purine clearance'],
        relatedTests: ['Creatinine', 'BUN'],
        influencingFactors: ['Red meats, shellfish, beer, high-fructose corn syrup'],
        clinicalFollowUp: 'No follow-up needed.',
        doctorQuestion: 'Is my uric acid level safely below the threshold for gout or kidney stones?'
      },

      // 5. Liver Function
      {
        id: 't-liv-alt',
        name: 'Alanine Aminotransferase (ALT / SGPT)',
        shortName: 'ALT',
        category: 'Liver Function',
        value: 44,
        numericValue: 44,
        unit: 'U/L',
        refRange: { min: 7, max: 40, text: '7 - 40 U/L' },
        status: 'Borderline High',
        priority: 'YELLOW',
        sourcePage: 2,
        plainMeaning: 'ALT is an enzyme found mainly inside liver cells. When liver cells are stressed, ALT can leak into blood.',
        whatItMeasures: 'Hepatocellular cellular integrity.',
        whyItMatters: 'Your result of 44 U/L is just slightly above the upper normal limit of 40 U/L. Mild elevations are very common and frequently associated with metabolic factors (fatty liver changes), alcohol, or medications.',
        commonCauses: ['Mild metabolic liver fat accumulation (hepatic steatosis)', 'Over-the-counter pain medications (acetaminophen, NSAIDs)', 'Recent vigorous workout', 'Alcohol intake'],
        relatedTests: ['AST', 'Bilirubin', 'Alkaline Phosphatase', 'Fasting Glucose'],
        influencingFactors: ['Medications, alcohol, intense strength training in the last 48 hours'],
        clinicalFollowUp: 'Correlate with AST, ultrasound if indicated by doctor, and recheck in 3-6 months alongside glucose/lipids.',
        doctorQuestion: 'My ALT is mildly elevated at 44 U/L. Could this be related to my glucose or cholesterol results, or medications I take?',
        previousValue: 36,
        previousNumericValue: 36,
        previousDate: 'April 14, 2026'
      },
      {
        id: 't-liv-ast',
        name: 'Aspartate Aminotransferase (AST / SGOT)',
        shortName: 'AST',
        category: 'Liver Function',
        value: 32,
        numericValue: 32,
        unit: 'U/L',
        refRange: { min: 10, max: 40, text: '10 - 40 U/L' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'AST is an enzyme found in liver cells, heart muscle, and skeletal muscle.',
        whatItMeasures: 'Cellular enzyme activity in liver and muscle tissue.',
        whyItMatters: 'Normal. Because AST is normal while ALT is only mildly elevated, this points to a very mild, isolated cellular change rather than acute liver inflammation.',
        commonCauses: ['Normal baseline'],
        relatedTests: ['ALT', 'Bilirubin'],
        influencingFactors: ['Muscle exertion'],
        clinicalFollowUp: 'Continue routine care.',
        doctorQuestion: 'Since AST is normal, does this suggest the ALT elevation is very mild?'
      },
      {
        id: 't-liv-bili',
        name: 'Total Bilirubin',
        shortName: 'Bili Total',
        category: 'Liver Function',
        value: 0.8,
        numericValue: 0.8,
        unit: 'mg/dL',
        refRange: { min: 0.2, max: 1.2, text: '0.2 - 1.2 mg/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'Bilirubin is a yellowish substance made during the normal breakdown of old red blood cells.',
        whatItMeasures: 'Bile processing and red cell clearance function.',
        whyItMatters: 'Completely normal. Confirms normal bile flow and absence of jaundice.',
        commonCauses: ['Healthy bile clearance'],
        relatedTests: ['Direct Bilirubin', 'ALT', 'ALP'],
        influencingFactors: ['Prolonged fasting can sometimes raise it in Gilbert syndrome'],
        clinicalFollowUp: 'No action required.',
        doctorQuestion: 'Is my bilirubin normal?'
      },
      {
        id: 't-liv-alb',
        name: 'Serum Albumin',
        shortName: 'Albumin',
        category: 'Liver Function',
        value: 4.5,
        numericValue: 4.5,
        unit: 'g/dL',
        refRange: { min: 3.5, max: 5.2, text: '3.5 - 5.2 g/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'Albumin is the main protein produced by the liver. It keeps fluid inside your blood vessels so it does not leak into tissues.',
        whatItMeasures: 'Liver synthetic capacity and systemic nutritional status.',
        whyItMatters: 'Excellent normal level. Confirms your liver is actively synthesizing vital proteins.',
        commonCauses: ['Good nutritional protein status'],
        relatedTests: ['Total Protein', 'Globulin'],
        influencingFactors: ['Hydration status'],
        clinicalFollowUp: 'No follow-up needed.',
        doctorQuestion: 'Does my albumin level confirm good overall protein nutrition?'
      },

      // 6. Complete Urine Examination (CUE)
      {
        id: 't-urn-col',
        name: 'Urine Color & Clarity',
        shortName: 'Urine Color',
        category: 'Complete Urine Examination (CUE)',
        value: 'Pale Yellow / Clear',
        unit: '',
        refRange: { text: 'Pale Yellow / Clear' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 3,
        plainMeaning: 'Visual appearance of urine reflecting physical hydration state.',
        whatItMeasures: 'Physical visual characteristics of urine.',
        whyItMatters: 'Normal healthy appearance indicating appropriate hydration.',
        commonCauses: ['Adequate water intake'],
        relatedTests: ['Specific Gravity', 'Urine pH'],
        influencingFactors: ['Foods (beets), vitamins (B-complex makes urine bright yellow)'],
        clinicalFollowUp: 'No action needed.',
        doctorQuestion: 'Is the urine appearance standard?'
      },
      {
        id: 't-urn-prot',
        name: 'Urine Protein (Albumin)',
        shortName: 'U-Protein',
        category: 'Complete Urine Examination (CUE)',
        value: 'Negative',
        unit: '',
        refRange: { text: 'Negative / Nil' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 3,
        plainMeaning: 'Tests whether proteins are leaking through the kidney’s microscopic filters into urine.',
        whatItMeasures: 'Kidney capillary membrane integrity.',
        whyItMatters: 'Negative is the ideal result. Means kidney filters are intact and not leaking protein, which is an important reassuring sign for metabolic health.',
        commonCauses: ['Healthy glomerular barrier'],
        relatedTests: ['Serum Creatinine', 'eGFR', 'Urine Microalbumin'],
        influencingFactors: ['Strenuous exercise or high fever immediately before test can cause temporary traces'],
        clinicalFollowUp: 'No follow-up needed.',
        doctorQuestion: 'Does the absence of protein in my urine mean my kidneys are protected from sugar damage?'
      },
      {
        id: 't-urn-gluc',
        name: 'Urine Glucose',
        shortName: 'U-Glucose',
        category: 'Complete Urine Examination (CUE)',
        value: 'Negative',
        unit: '',
        refRange: { text: 'Negative' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 3,
        plainMeaning: 'Checks whether excess blood sugar is spilling over into urine.',
        whatItMeasures: 'Renal glucose spillover threshold (typically spills when blood sugar > 180 mg/dL).',
        whyItMatters: 'Negative result confirms your blood sugar levels have stayed well below the kidney spillover threshold.',
        commonCauses: ['Blood glucose below ~180 mg/dL threshold'],
        relatedTests: ['Fasting Blood Glucose', 'HbA1c'],
        influencingFactors: ['SGLT2 inhibitor medications deliberately cause glucose in urine'],
        clinicalFollowUp: 'No action needed.',
        doctorQuestion: 'Does negative urine glucose confirm sugar is not spilling over?'
      },
      {
        id: 't-urn-leuk',
        name: 'Urine Leukocyte Esterase & Pus Cells',
        shortName: 'U-Pus Cells',
        category: 'Complete Urine Examination (CUE)',
        value: '0 - 2 / HPF',
        unit: 'cells/HPF',
        refRange: { min: 0, max: 5, text: '0 - 5 / HPF (Negative)' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 3,
        plainMeaning: 'Counts white blood cells in urine to look for urinary tract irritation or infection.',
        whatItMeasures: 'Urinary tract inflammation or infection.',
        whyItMatters: 'Completely normal. No indication of urinary tract infection (UTI) or bladder irritation.',
        commonCauses: ['Healthy urinary tract'],
        relatedTests: ['Urine Nitrites', 'Urine RBC'],
        influencingFactors: ['Clean catch collection technique'],
        clinicalFollowUp: 'No follow-up needed.',
        doctorQuestion: 'Is my urinary tract examination completely clear of infection?'
      },

      // 7. Thyroid Function
      {
        id: 't-thy-tsh',
        name: 'Thyroid Stimulating Hormone (TSH)',
        shortName: 'TSH',
        category: 'Thyroid Function',
        value: 2.35,
        numericValue: 2.35,
        unit: 'mIU/L',
        refRange: { min: 0.45, max: 4.50, text: '0.45 - 4.50 mIU/L' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 3,
        plainMeaning: 'TSH is produced by the brain’s pituitary gland to tell your thyroid how much thyroid hormone to release.',
        whatItMeasures: 'Central regulation of systemic metabolic rate.',
        whyItMatters: '2.35 mIU/L is right in the center of the optimal euthyroid range. Confirms your thyroid is functioning stably.',
        commonCauses: ['Normal pituitary-thyroid feedback loop'],
        relatedTests: ['Free T4', 'Free T3'],
        influencingFactors: ['Biotin supplements can interfere with lab assays (stop 48h prior)', 'Time of day'],
        clinicalFollowUp: 'Routine annual check.',
        doctorQuestion: 'Does my TSH confirm my thyroid is regulating my metabolism properly?',
        previousValue: 2.10,
        previousNumericValue: 2.10,
        previousDate: 'April 14, 2026'
      },
      {
        id: 't-thy-ft4',
        name: 'Free Thyroxine (Free T4)',
        shortName: 'FT4',
        category: 'Thyroid Function',
        value: 1.22,
        numericValue: 1.22,
        unit: 'ng/dL',
        refRange: { min: 0.82, max: 1.77, text: '0.82 - 1.77 ng/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 3,
        plainMeaning: 'The active circulating form of thyroid hormone available for your cells to use.',
        whatItMeasures: 'Circulating unbound thyroid hormone.',
        whyItMatters: 'Within normal limits. Pairs perfectly with the normal TSH.',
        commonCauses: ['Normal thyroid gland output'],
        relatedTests: ['TSH'],
        influencingFactors: ['Certain prescription medications'],
        clinicalFollowUp: 'No action needed.',
        doctorQuestion: 'Is my free T4 level optimal?'
      },

      // 8. Vitamins & Nutritional Markers
      {
        id: 't-vit-d',
        name: '25-Hydroxy Vitamin D Total',
        shortName: 'Vit D',
        category: 'Vitamins & Nutritional Markers',
        value: 19.4,
        numericValue: 19.4,
        unit: 'ng/mL',
        refRange: { min: 30.0, max: 100.0, text: '>= 30.0 ng/mL (Deficient: < 20, Insufficient: 20-29)' },
        status: 'Low',
        priority: 'YELLOW',
        sourcePage: 3,
        plainMeaning: 'Vitamin D is a crucial hormone-like vitamin that helps your body absorb calcium and supports bones, muscles, and the immune system.',
        whatItMeasures: 'Total body stores of active nutritional vitamin D.',
        whyItMatters: 'Your result of 19.4 ng/mL falls into the deficient bracket (<20 ng/mL). Low levels are very widespread and can contribute to bone density loss, muscle aches, or fatigue over time.',
        commonCauses: ['Limited direct sunlight exposure (office work, winter seasons)', 'Dietary intake lacking fortified foods or fatty fish', 'Use of sunscreen (protective for skin, reduces synthesis)'],
        relatedTests: ['Serum Calcium', 'Phosphorus', 'PTH'],
        influencingFactors: ['Season of the year', 'Skin pigmentation', 'Geographic latitude'],
        clinicalFollowUp: 'Discuss with your doctor if a short-term prescription replenishment dose (e.g. 50,000 IU weekly for 8 weeks) or daily OTC supplement (1000-2000 IU/day) is suitable for you.',
        doctorQuestion: 'My Vitamin D is 19.4 ng/mL (deficient). What dosage and duration of Vitamin D3 supplement do you advise?',
        previousValue: 24.1,
        previousNumericValue: 24.1,
        previousDate: 'April 14, 2026',
        history: [
          { date: 'Oct 2025', value: 28.0, unit: 'ng/mL', status: 'Borderline Low' },
          { date: 'Apr 2026', value: 24.1, unit: 'ng/mL', status: 'Borderline Low' },
          { date: 'Oct 2026', value: 19.4, unit: 'ng/mL', status: 'Low' }
        ]
      },
      {
        id: 't-vit-b12',
        name: 'Vitamin B12 (Cyanocobalamin)',
        shortName: 'Vit B12',
        category: 'Vitamins & Nutritional Markers',
        value: 465,
        numericValue: 465,
        unit: 'pg/mL',
        refRange: { min: 211, max: 911, text: '211 - 911 pg/mL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 3,
        plainMeaning: 'Vitamin B12 is essential for healthy nerve function, brain health, and red blood cell production.',
        whatItMeasures: 'Circulating serum cobalamin levels.',
        whyItMatters: 'Completely normal and healthy. Rules out B12 deficiency as a cause of mild anemia or fatigue.',
        commonCauses: ['Adequate dietary absorption from animal proteins or supplements'],
        relatedTests: ['Hemoglobin', 'MCV', 'Folate'],
        influencingFactors: ['Acid reflux medications (PPIs) or metformin can decrease absorption long-term'],
        clinicalFollowUp: 'No follow-up needed.',
        doctorQuestion: 'Is my Vitamin B12 level sufficient to support nerve health and blood cell formation?'
      },
      {
        id: 't-vit-ferr',
        name: 'Serum Ferritin',
        shortName: 'Ferritin',
        category: 'Vitamins & Nutritional Markers',
        value: 28,
        numericValue: 28,
        unit: 'ng/mL',
        refRange: { min: 30, max: 400, text: '30 - 400 ng/mL' },
        status: 'Borderline Low',
        priority: 'YELLOW',
        sourcePage: 3,
        plainMeaning: 'Ferritin is a protein that stores iron inside your cells like a backup battery for red blood cell creation.',
        whatItMeasures: 'Total body iron storage reserves.',
        whyItMatters: 'At 28 ng/mL, your iron storage reserve is borderline low (reference lower bound is 30 ng/mL). This explains why your Hemoglobin (13.1 g/dL) and MCV (79.2 fL) are slightly lower than typical.',
        commonCauses: ['Low dietary intake of bioavailable iron', 'Minor unrecognized blood loss (e.g. digestive tract)', 'Increased iron utilization'],
        relatedTests: ['Hemoglobin', 'MCV', 'Total Iron Binding Capacity (TIBC)'],
        influencingFactors: ['Inflammation can artificially elevate ferritin, so a low reading is very reliable for low iron stores'],
        clinicalFollowUp: 'Ask your doctor if dietary iron enhancement (spinach, lentils, lean meats) or mild iron supplementation is recommended.',
        doctorQuestion: 'My ferritin is borderline low at 28 ng/mL alongside slightly low hemoglobin and MCV. Does this confirm early iron depletion?',
        previousValue: 42,
        previousNumericValue: 42,
        previousDate: 'April 14, 2026'
      },

      // 9. Electrolytes & Minerals
      {
        id: 't-ely-na',
        name: 'Serum Sodium (Na+)',
        shortName: 'Sodium',
        category: 'Electrolytes & Minerals',
        value: 139,
        numericValue: 139,
        unit: 'mEq/L',
        refRange: { min: 136, max: 145, text: '136 - 145 mEq/L' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 4,
        plainMeaning: 'Sodium controls fluid balance, blood pressure, and normal muscle and nerve function throughout your body.',
        whatItMeasures: 'Major extracellular electrolyte concentration.',
        whyItMatters: 'Well balanced in the normal zone. Indicates healthy fluid equilibrium.',
        commonCauses: ['Normal water-salt homeostasis'],
        relatedTests: ['Potassium', 'Chloride', 'Kidney Function'],
        influencingFactors: ['Hydration and dietary salt intake'],
        clinicalFollowUp: 'No action required.',
        doctorQuestion: 'Are my electrolytes properly balanced?'
      },
      {
        id: 't-ely-k',
        name: 'Serum Potassium (K+)',
        shortName: 'Potassium',
        category: 'Electrolytes & Minerals',
        value: 4.4,
        numericValue: 4.4,
        unit: 'mEq/L',
        refRange: { min: 3.5, max: 5.1, text: '3.5 - 5.1 mEq/L' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 4,
        plainMeaning: 'Potassium is vital for proper muscle contraction, nerve firing, and especially your heartbeat rhythm.',
        whatItMeasures: 'Critical intracellular and serum cation balance.',
        whyItMatters: 'Completely normal and safe. Reflects proper cardiac and neuromuscular electrical balance.',
        commonCauses: ['Healthy renal potassium regulation'],
        relatedTests: ['Sodium', 'Kidney Function'],
        influencingFactors: ['Blood draw hemolyzing (can falsely elevate potassium)'],
        clinicalFollowUp: 'No follow-up needed.',
        doctorQuestion: 'Is my potassium level optimal for cardiovascular rhythm?'
      },
      {
        id: 't-ely-ca',
        name: 'Serum Calcium Total',
        shortName: 'Calcium',
        category: 'Electrolytes & Minerals',
        value: 9.4,
        numericValue: 9.4,
        unit: 'mg/dL',
        refRange: { min: 8.6, max: 10.2, text: '8.6 - 10.2 mg/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 4,
        plainMeaning: 'Calcium builds strong bones and teeth, and helps your heart, muscles, and nerves communicate.',
        whatItMeasures: 'Total circulating blood calcium.',
        whyItMatters: 'Normal. Despite low Vitamin D, your body is currently maintaining a stable blood calcium level.',
        commonCauses: ['Normal parathyroid and bone buffering'],
        relatedTests: ['Vitamin D', 'Serum Albumin'],
        influencingFactors: ['Albumin levels (calcium binds to albumin)'],
        clinicalFollowUp: 'Address Vitamin D to protect long-term bone calcium storage.',
        doctorQuestion: 'Since my blood calcium is normal, does my low vitamin D still need treatment?'
      },

      // 10. Inflammatory Markers
      {
        id: 't-inf-crp',
        name: 'High-Sensitivity C-Reactive Protein (hs-CRP)',
        shortName: 'hs-CRP',
        category: 'Inflammatory Markers',
        value: 2.4,
        numericValue: 2.4,
        unit: 'mg/L',
        refRange: { min: 0.0, max: 3.0, text: '< 1.0 (Low risk), 1.0-3.0 (Average risk), > 3.0 (High risk)' },
        status: 'Borderline High',
        priority: 'YELLOW',
        sourcePage: 4,
        plainMeaning: 'hs-CRP is a sensitive protein made by your liver that flags low-grade inflammation inside blood vessel walls.',
        whatItMeasures: 'Microvascular vascular inflammatory activity.',
        whyItMatters: 'At 2.4 mg/L, your result is in the average cardiovascular risk category (1.0 to 3.0 mg/L). In combination with elevated LDL and triglycerides, this highlights low-grade vessel wall inflammation.',
        commonCauses: ['Metabolic syndrome', 'Adipose tissue inflammation', 'Recent minor physical strain or cold'],
        relatedTests: ['Lipid Profile', 'Fasting Blood Glucose', 'ESR'],
        influencingFactors: ['Minor recent viral cold, sprain, or dental infection can temporarily bump hs-CRP'],
        clinicalFollowUp: 'Discuss cardiovascular lifestyle strategies (anti-inflammatory nutrition, regular aerobic exercise).',
        doctorQuestion: 'Does my hs-CRP of 2.4 mg/L affect how aggressively we should manage my cholesterol?',
        previousValue: 1.8,
        previousNumericValue: 1.8,
        previousDate: 'April 14, 2026'
      },
      {
        id: 't-inf-esr',
        name: 'Erythrocyte Sedimentation Rate (ESR)',
        shortName: 'ESR',
        category: 'Inflammatory Markers',
        value: 12,
        numericValue: 12,
        unit: 'mm/hr',
        refRange: { min: 0, max: 15, text: '0 - 15 mm/hr' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 4,
        plainMeaning: 'ESR measures how quickly red blood cells settle at the bottom of a test tube, indicating general systemic inflammation.',
        whatItMeasures: 'General systemic inflammatory response.',
        whyItMatters: 'Normal. Confirms absence of major systemic inflammatory disorders, autoimmune flare, or occult chronic infection.',
        commonCauses: ['Normal baseline'],
        relatedTests: ['hs-CRP', 'WBC'],
        influencingFactors: ['Age and sex baseline norms'],
        clinicalFollowUp: 'No follow-up needed.',
        doctorQuestion: 'Does my normal ESR confirm there is no major systemic inflammation?'
      },

      // 11. Cardiac & Coagulation Markers
      {
        id: 't-crd-inr',
        name: 'Prothrombin Time & INR (PT/INR)',
        shortName: 'PT/INR',
        category: 'Cardiac & Coagulation Markers',
        value: 1.02,
        numericValue: 1.02,
        unit: 'Ratio',
        refRange: { min: 0.85, max: 1.15, text: '0.85 - 1.15 (Standard non-anticoagulated)' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 4,
        plainMeaning: 'Tests how fast your blood forms a protective clot.',
        whatItMeasures: 'Extrinsic coagulation pathway speed and liver clotting factor synthesis.',
        whyItMatters: 'Completely normal coagulation efficiency.',
        commonCauses: ['Healthy clotting factor production by liver'],
        relatedTests: ['Platelet Count', 'Liver Function'],
        influencingFactors: ['Anticoagulant medications like warfarin', 'Dietary Vitamin K'],
        clinicalFollowUp: 'No action required.',
        doctorQuestion: 'Is my blood clotting time completely standard?'
      }
    ],
    keyFindings: [
      {
        id: 'kf-1',
        testId: 't-glu-fasting',
        testName: 'Fasting Blood Glucose & HbA1c',
        category: 'Blood Sugar & Diabetes Screening',
        reportedResult: 'Glucose: 118 mg/dL | HbA1c: 6.1%',
        refRange: 'Glucose < 100 mg/dL | HbA1c < 5.7%',
        priority: 'YELLOW',
        priorityLabel: 'Follow-Up Recommended',
        status: 'High',
        plainLanguageExplanation: 'Both your morning fasting blood sugar (118 mg/dL) and your 3-month average HbA1c (6.1%) fall into the recognized prediabetes range. This indicates early insulin resistance.',
        whyItMatters: 'Prediabetes is not permanent. Identifying it early gives you a proven window of opportunity to reverse or stabilize blood sugar with targeted diet and regular exercise before it progresses toward type 2 diabetes.',
        recommendedFollowUp: 'Schedule a routine consultation with your doctor to review a personalized nutrition plan, physical activity routine, and recheck tests in 3 to 6 months.'
      },
      {
        id: 'kf-2',
        testId: 't-lip-ldl',
        testName: 'LDL Cholesterol & Triglycerides',
        category: 'Lipid Profile & Cholesterol',
        reportedResult: 'LDL: 142 mg/dL | Triglycerides: 195 mg/dL',
        refRange: 'LDL < 100 mg/dL | Triglycerides < 150 mg/dL',
        priority: 'YELLOW',
        priorityLabel: 'Follow-Up Recommended',
        status: 'High',
        plainLanguageExplanation: 'Your "bad" LDL cholesterol (142 mg/dL) and your blood fats (triglycerides 195 mg/dL) are both above recommended targets, raising your total cholesterol to 224 mg/dL.',
        whyItMatters: 'When elevated blood fats and LDL persist over years, they can gradually build plaque along blood vessel walls. They often cluster alongside the early blood sugar changes seen above.',
        recommendedFollowUp: 'Discuss calculating your 10-year cardiovascular risk score with your doctor and establishing a cardiovascular-friendly dietary plan.'
      },
      {
        id: 'kf-3',
        testId: 't-vit-d',
        testName: '25-Hydroxy Vitamin D',
        category: 'Vitamins & Nutritional Markers',
        reportedResult: '19.4 ng/mL',
        refRange: '>= 30.0 ng/mL',
        priority: 'YELLOW',
        priorityLabel: 'Follow-Up Recommended',
        status: 'Low',
        plainLanguageExplanation: 'Your Vitamin D level is 19.4 ng/mL, which is below the standard recommended minimum of 30 ng/mL and classifies as vitamin D deficiency.',
        whyItMatters: 'Vitamin D supports bone strength, calcium absorption, and muscle performance. Low levels can lead to subtle fatigue, bone aches, or lower bone mineral density over time.',
        recommendedFollowUp: 'Ask your healthcare provider about an appropriate supplemental dose of Vitamin D3 (oral capsules or drops).'
      },
      {
        id: 'kf-4',
        testId: 't-cbc-hb',
        testName: 'Mild Microcytic Trend (Hemoglobin, MCV & Ferritin)',
        category: 'Complete Blood Count (CBC)',
        reportedResult: 'Hb: 13.1 g/dL | MCV: 79.2 fL | Ferritin: 28 ng/mL',
        refRange: 'Hb: 13.5-17.5 g/dL | MCV: 80-100 fL | Ferritin: 30-400 ng/mL',
        priority: 'YELLOW',
        priorityLabel: 'Follow-Up Recommended',
        status: 'Low',
        plainLanguageExplanation: 'Your hemoglobin is slightly below reference (13.1 g/dL), paired with slightly smaller red blood cells (MCV 79.2 fL) and borderline low iron storage (Ferritin 28 ng/mL).',
        whyItMatters: 'Suggests early or mild iron depletion before noticeable anemia develops. Usually easily managed through diet or gentle supplementation if your doctor agrees.',
        recommendedFollowUp: 'Review with your doctor to explore dietary iron sources and consider whether repeat testing in 3 months is advised.'
      },
      {
        id: 'kf-5',
        testId: 't-liv-alt',
        testName: 'Alanine Aminotransferase (ALT)',
        category: 'Liver Function',
        reportedResult: '44 U/L',
        refRange: '7 - 40 U/L',
        priority: 'YELLOW',
        priorityLabel: 'Follow-Up Recommended',
        status: 'Borderline High',
        plainLanguageExplanation: 'ALT is slightly above the upper cutoff of 40 U/L. All other liver markers (AST, Bilirubin, Albumin) are completely normal.',
        whyItMatters: 'Mild isolated ALT elevation is very frequently associated with mild metabolic liver fat (steatosis) linked to prediabetes and elevated triglycerides, or temporary medication effects.',
        recommendedFollowUp: 'Monitor during your routine doctor visit; retesting alongside blood sugar and lipids in 3-6 months is standard.'
      }
    ],
    patterns: [
      {
        id: 'pat-1',
        title: 'Metabolic & Glycemic Pattern (Prediabetes Clustering)',
        priority: 'YELLOW',
        supportingTestIds: ['t-glu-fasting', 't-glu-hba1c', 't-lip-trig', 't-lip-ldl', 't-liv-alt'],
        supportingResultsSummary: [
          { name: 'Fasting Glucose', value: '118 mg/dL', status: 'High' },
          { name: 'HbA1c', value: '6.1%', status: 'Borderline High' },
          { name: 'Triglycerides', value: '195 mg/dL', status: 'Borderline High' },
          { name: 'ALT (Liver Enzyme)', value: '44 U/L', status: 'Borderline High' }
        ],
        possibleMeaning: 'These findings fit a well-known metabolic pattern: early insulin resistance where the body’s cells respond less efficiently to insulin, causing mild elevations in fasting blood sugar, blood fats (triglycerides), and subtle liver enzyme changes.',
        alternativeExplanations: [
          'Recent dietary habits rich in refined carbohydrates or sugars preceding testing',
          'Periods of elevated work stress or poor sleep quality elevating morning cortisol',
          'Temporary lack of aerobic exercise in the preceding months'
        ],
        recommendedDoctorQuestions: [
          'Does this cluster of findings indicate metabolic syndrome or prediabetes?',
          'What specific target weight or dietary adjustments should I aim for over the next 6 months?',
          'Would working with a registered dietitian or diabetes prevention program be beneficial?'
        ]
      },
      {
        id: 'pat-2',
        title: 'Mild Microcytic Iron Depletion Pattern',
        priority: 'YELLOW',
        supportingTestIds: ['t-cbc-hb', 't-cbc-mcv', 't-vit-ferr'],
        supportingResultsSummary: [
          { name: 'Hemoglobin', value: '13.1 g/dL', status: 'Low' },
          { name: 'MCV (Cell Size)', value: '79.2 fL', status: 'Low' },
          { name: 'Serum Ferritin', value: '28 ng/mL', status: 'Borderline Low' }
        ],
        possibleMeaning: 'A concordant triad of mild low hemoglobin, slightly reduced red cell volume (microcytosis), and low-normal iron stores (ferritin). This indicates early stage iron storage depletion.',
        alternativeExplanations: [
          'Dietary preference with lower iron absorption (vegetarian or low red meat intake)',
          'Occult gastrointestinal blood loss (deserves routine clinical verification if unexpected)',
          'Inherited red blood cell traits (e.g. mild thalassemia trait, though ferritin is usually normal in trait)'
        ],
        recommendedDoctorQuestions: [
          'Do my iron stores explain why my hemoglobin and red cell size are slightly low?',
          'Do you recommend an oral iron supplement, dietary changes, or repeating this test in 3 months?'
        ]
      },
      {
        id: 'pat-3',
        title: 'Isolated Suboptimal Vitamin D with Preserved Calcium Balance',
        priority: 'YELLOW',
        supportingTestIds: ['t-vit-d', 't-ely-ca'],
        supportingResultsSummary: [
          { name: '25-OH Vitamin D', value: '19.4 ng/mL', status: 'Low' },
          { name: 'Serum Calcium', value: '9.4 mg/dL', status: 'Normal' }
        ],
        possibleMeaning: 'Your blood calcium level remains strictly normal and buffered, but your underlying nutritional vitamin D storage tank is low (<20 ng/mL).',
        alternativeExplanations: [
          'Lack of regular direct mid-day sun exposure',
          'Testing during autumn or winter months when UV synthesis is minimal'
        ],
        recommendedDoctorQuestions: [
          'What Vitamin D supplement regimen (daily vs weekly) do you advise to reach above 30 ng/mL?',
          'When should we recheck my Vitamin D level to ensure it has normalized?'
        ]
      }
    ],
    doctorQuestions: [
      {
        id: 'dq-1',
        question: 'What lifestyle or dietary changes do you recommend for my fasting glucose (118 mg/dL) and HbA1c (6.1%) to prevent progression?',
        relatedTestId: 't-glu-fasting',
        relatedTestName: 'Fasting Glucose & HbA1c',
        whyItMatters: 'Both numbers fall into the prediabetes bracket, where evidence shows that targeted nutrition and exercise can often normalize blood sugar.',
        discussed: false,
        priority: 'high'
      },
      {
        id: 'dq-2',
        question: 'Based on my total cholesterol (224 mg/dL) and LDL (142 mg/dL), what is my calculated 10-year cardiovascular risk score, and is a statin indicated or a lifestyle trial first?',
        relatedTestId: 't-lip-ldl',
        relatedTestName: 'Lipid Profile',
        whyItMatters: 'Cardiology guidelines use your overall risk profile (age, blood pressure, cholesterol, glucose) rather than cholesterol numbers in isolation to tailor treatment.',
        discussed: false,
        priority: 'high'
      },
      {
        id: 'dq-3',
        question: 'My hemoglobin (13.1 g/dL), MCV (79.2 fL), and ferritin (28 ng/mL) are all slightly low. Do I need an iron supplement or further testing to rule out blood loss?',
        relatedTestId: 't-cbc-hb',
        relatedTestName: 'Complete Blood Count & Ferritin',
        whyItMatters: 'Clarifies whether low iron stores are purely dietary or require simple gastrointestinal screening.',
        discussed: false,
        priority: 'medium'
      },
      {
        id: 'dq-4',
        question: 'My Vitamin D is 19.4 ng/mL. What specific dosage of Vitamin D3 should I take daily, and for how long?',
        relatedTestId: 't-vit-d',
        relatedTestName: 'Vitamin D',
        whyItMatters: 'Standardizes proper dosing to safely bring vitamin D back into the optimal 30-60 ng/mL range.',
        discussed: false,
        priority: 'medium'
      },
      {
        id: 'dq-5',
        question: 'Could my mild liver enzyme elevation (ALT 44 U/L) be related to metabolic fatty liver, exercise, or any medications or supplements I am taking?',
        relatedTestId: 't-liv-alt',
        relatedTestName: 'Alanine Aminotransferase (ALT)',
        whyItMatters: 'Mild ALT changes are very often reversible when paired with nutrition improvements for prediabetes.',
        discussed: false,
        priority: 'medium'
      },
      {
        id: 'dq-6',
        question: 'When would you like to schedule repeat laboratory testing to monitor these borderline markers?',
        whyItMatters: 'Setting a clear follow-up timeframe (e.g. 3 or 6 months) ensures accountability and tracks whether lifestyle adjustments are working.',
        discussed: false,
        priority: 'low'
      }
    ],
    checklist: [
      {
        id: 'chk-1',
        task: 'Bring previous laboratory reports or medical records for comparison',
        details: 'Having previous lab results allows your doctor to see how your cholesterol, glucose, and hemoglobin have changed over time.',
        completed: true,
        category: 'documents'
      },
      {
        id: 'chk-2',
        task: 'Prepare a complete, up-to-date list of all prescription medications, OTC drugs, and vitamins/supplements',
        details: 'Include exact doses and brands, as supplements and over-the-counter pain relievers can directly affect liver enzymes and lab tests.',
        completed: false,
        category: 'medications'
      },
      {
        id: 'chk-3',
        task: 'Note any physical symptoms or changes you have noticed recently',
        details: 'Record subtle signs like unusual fatigue, changes in energy after meals, sleep quality, or digestive changes, including when they started.',
        completed: false,
        category: 'symptoms'
      },
      {
        id: 'chk-4',
        task: 'Record recent changes in your diet, physical activity, or body weight',
        details: 'Knowing whether you recently gained/lost weight, changed eating patterns, or altered workout habits helps your doctor interpret glucose and liver tests.',
        completed: false,
        category: 'preparation'
      },
      {
        id: 'chk-5',
        task: 'Check whether your doctor requires repeat fasting tests on your appointment morning',
        details: 'Confirm whether you should arrive fasting (no food or drinks except water for 8-12 hours) in case repeat blood draws are ordered.',
        completed: false,
        category: 'preparation'
      }
    ],
    followUps: [
      {
        id: 'fu-1',
        finding: 'Fasting Blood Glucose 118 mg/dL & HbA1c 6.1% (Prediabetes Bracket)',
        whyItDeservesAttention: 'Early intervention prevents or delays type 2 diabetes and protects heart and kidney health.',
        urgencyLevel: 'Routine Follow-Up',
        urgencyTier: 3,
        priority: 'YELLOW',
        whatToDiscuss: 'Discuss personalized nutrition (reducing refined carbs), structured exercise (150 min/wk), and rechecking HbA1c in 3-6 months.',
        suggestedTimeframe: 'Within 2 to 4 weeks (Routine primary care visit)'
      },
      {
        id: 'fu-2',
        finding: 'Elevated LDL (142 mg/dL) & Triglycerides (195 mg/dL)',
        whyItDeservesAttention: 'Important contributor to long-term arterial plaque development and cardiovascular wellness.',
        urgencyLevel: 'Routine Follow-Up',
        urgencyTier: 3,
        priority: 'YELLOW',
        whatToDiscuss: 'Discuss overall 10-year ASCVD risk score and heart-healthy dietary strategies.',
        suggestedTimeframe: 'During your next routine physician appointment'
      },
      {
        id: 'fu-3',
        finding: '25-OH Vitamin D 19.4 ng/mL (Deficient Store)',
        whyItDeservesAttention: 'Affects bone density and muscle strength if left low for extended periods.',
        urgencyLevel: 'Routine Follow-Up',
        urgencyTier: 3,
        priority: 'YELLOW',
        whatToDiscuss: 'Ask for specific oral Vitamin D3 supplementation recommendation and follow-up duration.',
        suggestedTimeframe: 'At upcoming appointment'
      },
      {
        id: 'fu-4',
        finding: 'Mild Low Hemoglobin (13.1 g/dL), MCV (79.2 fL) & Ferritin (28 ng/mL)',
        whyItDeservesAttention: 'Indicates early depleted iron stores before noticeable anemia symptoms occur.',
        urgencyLevel: 'Routine Follow-Up',
        urgencyTier: 3,
        priority: 'YELLOW',
        whatToDiscuss: 'Determine if dietary iron rich foods or gentle iron pills are indicated.',
        suggestedTimeframe: 'At upcoming appointment'
      }
    ],
    originalReportPages: [
      {
        pageNumber: 1,
        title: 'Page 1 — Hematology (CBC) & Glycemic Profile',
        sections: [
          {
            category: 'COMPLETE BLOOD COUNT (AUTOMATED 5-PART DIFFERENTIAL)',
            rawLines: [
              'Hemoglobin (Photometry)                   13.1   g/dL       [ 13.5 - 17.5 ]   LOW *',
              'Total RBC Count (Impedance)               4.45   mil/mcL    [ 4.30 - 5.90 ]   NORMAL',
              'Hematocrit / PCV (Calculated)             39.8   %          [ 41.0 - 50.0 ]   LOW *',
              'Mean Corpuscular Volume (MCV)             79.2   fL         [ 80.0 - 100.0]   LOW *',
              'Total Leukocyte Count (WBC)               6.80   x10^3/mcL  [  4.5 - 11.0 ]   NORMAL',
              'Platelet Count (Impedance)                 242   x10^3/mcL  [  150 - 450  ]   NORMAL'
            ]
          },
          {
            category: 'DIABETIC / GLYCEMIC PROFILE',
            rawLines: [
              'Fasting Blood Glucose (Hexokinase)         118   mg/dL      [  70 - 99   ]    HIGH *',
              'HbA1c (HPLC Method, NGSP Certified)        6.1   %          [ 4.0 - 5.6  ]    HIGH *',
              'Estimated Average Glucose (eAG, Calc)      128   mg/dL      [  70 - 114  ]    HIGH *'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Page 2 — Lipid Profile, Renal & Hepatic Function',
        sections: [
          {
            category: 'LIPID PROFILE (FASTING 12 HOURS)',
            rawLines: [
              'Total Cholesterol (CHOD-PAP)               224   mg/dL      [ < 200      ]    HIGH *',
              'Triglycerides (GPO-PAP)                    195   mg/dL      [ < 150      ]    BORDERLINE *',
              'HDL Cholesterol (Direct Accelerator)        43   mg/dL      [ > 40       ]    NORMAL',
              'LDL Cholesterol (Friedewald Calculated)    142   mg/dL      [ < 100      ]    HIGH *',
              'Non-HDL Cholesterol (Calculated)           181   mg/dL      [ < 130      ]    HIGH *'
            ]
          },
          {
            category: 'RENAL / KIDNEY FUNCTION PANEL',
            rawLines: [
              'Serum Creatinine (Enzymatic)              0.95   mg/dL      [ 0.70 - 1.30]    NORMAL',
              'eGFR (CKD-EPI 2021 Equation)                94   mL/min     [ > 90       ]    NORMAL',
              'Blood Urea Nitrogen (BUN)                   14   mg/dL      [  7 - 20    ]    NORMAL',
              'Serum Uric Acid                            6.2   mg/dL      [ 3.5 - 7.2  ]    NORMAL'
            ]
          },
          {
            category: 'HEPATIC / LIVER FUNCTION PANEL',
            rawLines: [
              'Alanine Aminotransferase (ALT / SGPT)       44   U/L        [  7 - 40    ]    HIGH *',
              'Aspartate Aminotransferase (AST / SGOT)     32   U/L        [ 10 - 40    ]    NORMAL',
              'Total Bilirubin                            0.8   mg/dL      [ 0.2 - 1.2  ]    NORMAL',
              'Serum Albumin                              4.5   g/dL       [ 3.5 - 5.2  ]    NORMAL'
            ]
          }
        ]
      },
      {
        pageNumber: 3,
        title: 'Page 3 — Urine, Thyroid & Nutritional Vitamins',
        sections: [
          {
            category: 'COMPLETE URINE EXAMINATION (AUTOMATED + MICROSCOPY)',
            rawLines: [
              'Color & Appearance                        Pale Yellow / Clear                 NORMAL',
              'Urine Protein / Albumin                   Negative                            NORMAL',
              'Urine Glucose                             Negative                            NORMAL',
              'Pus Cells / Leukocytes                    0 - 2 / HPF        [ 0 - 5 / HPF]   NORMAL'
            ]
          },
          {
            category: 'THYROID FUNCTION PROFILE',
            rawLines: [
              'TSH (Chemiluminescence ECLIA)             2.35   mIU/L      [ 0.45 - 4.50]    NORMAL',
              'Free T4                                   1.22   ng/dL      [ 0.82 - 1.77]    NORMAL'
            ]
          },
          {
            category: 'VITAMINS & IRON PROFILE',
            rawLines: [
              '25-Hydroxy Vitamin D Total (CLIA)         19.4   ng/mL      [ >= 30.0    ]    DEFICIENT *',
              'Vitamin B12 (Cyanocobalamin)               465   pg/mL      [ 211 - 911  ]    NORMAL',
              'Serum Ferritin (ECLIA)                      28   ng/mL      [  30 - 400  ]    LOW *'
            ]
          }
        ]
      }
    ],
    boundingBoxes: [
      { id: 'b-1', testId: 't-cbc-hb', testName: 'Hemoglobin', page: 1, xPercent: 5, yPercent: 12, widthPercent: 90, heightPercent: 4, extractedText: 'Hemoglobin: 13.1 g/dL [13.5 - 17.5] LOW' },
      { id: 'b-2', testId: 't-glu-fasting', testName: 'Fasting Blood Glucose', page: 1, xPercent: 5, yPercent: 48, widthPercent: 90, heightPercent: 4, extractedText: 'Fasting Glucose: 118 mg/dL [70 - 99] HIGH' },
      { id: 'b-3', testId: 't-glu-hba1c', testName: 'Hemoglobin A1c', page: 1, xPercent: 5, yPercent: 54, widthPercent: 90, heightPercent: 4, extractedText: 'HbA1c: 6.1% [< 5.7%] HIGH' },
      { id: 'b-4', testId: 't-lip-tot', testName: 'Total Cholesterol', page: 2, xPercent: 5, yPercent: 14, widthPercent: 90, heightPercent: 4, extractedText: 'Total Cholesterol: 224 mg/dL [< 200] HIGH' },
      { id: 'b-5', testId: 't-lip-ldl', testName: 'LDL Cholesterol', page: 2, xPercent: 5, yPercent: 26, widthPercent: 90, heightPercent: 4, extractedText: 'LDL Cholesterol: 142 mg/dL [< 100] HIGH' },
      { id: 'b-6', testId: 't-liv-alt', testName: 'ALT / SGPT', page: 2, xPercent: 5, yPercent: 78, widthPercent: 90, heightPercent: 4, extractedText: 'ALT / SGPT: 44 U/L [7 - 40] HIGH' },
      { id: 'b-7', testId: 't-vit-d', testName: '25-OH Vitamin D', page: 3, xPercent: 5, yPercent: 62, widthPercent: 90, heightPercent: 4, extractedText: '25-OH Vitamin D: 19.4 ng/mL [>= 30.0] DEFICIENT' }
    ]
  },

  // Patient 2: Eleanor Vance (Type 2 Diabetes Follow-up & Early Diabetic Nephropathy / Prompt Review)
  'p-2': {
    id: 'rep-002',
    patient: PATIENTS[1],
    reportDate: 'October 15, 2026',
    collectionDate: 'October 14, 2026 (08:15 AM Fasting)',
    labName: 'Metropolitan University Health System Laboratories',
    labAddress: 'Building B, 1200 Innovation Way, Chicago, IL',
    accreditation: 'CAP & Joint Commission Certified Laboratory',
    status: 'Analysis Complete',
    tests: [
      {
        id: 't-p2-glu',
        name: 'Fasting Blood Glucose',
        category: 'Blood Sugar & Diabetes Screening',
        value: 172,
        numericValue: 172,
        unit: 'mg/dL',
        refRange: { min: 70, max: 99, text: '70 - 99 mg/dL (Goal < 130 for established diabetes)' },
        status: 'High',
        priority: 'ORANGE',
        sourcePage: 1,
        plainMeaning: 'Fasting blood glucose measures morning sugar level before breakfast.',
        whatItMeasures: 'Current diabetic control on ongoing medical therapy.',
        whyItMatters: 'At 172 mg/dL, morning glucose is significantly above the target range (<130 mg/dL for adults with diabetes). Indicates current medications may need adjustment.',
        commonCauses: ['Insufficient medication dosage or adherence', 'Dietary carbohydrate load', 'Dawn phenomenon (liver releasing excess morning sugar)'],
        relatedTests: ['HbA1c', 'eGFR', 'Urine Microalbumin'],
        influencingFactors: ['Fasting duration', 'Evening medication timing'],
        clinicalFollowUp: 'Prompt medical review with endocrinologist or primary doctor to optimize glycemic therapy.',
        doctorQuestion: 'My fasting sugar is 172 mg/dL. Should we adjust my medication regimen?',
        previousValue: 188,
        previousNumericValue: 188,
        previousDate: 'May 10, 2026',
        history: [
          { date: 'Nov 2025', value: 195, unit: 'mg/dL', status: 'High' },
          { date: 'May 2026', value: 188, unit: 'mg/dL', status: 'High' },
          { date: 'Oct 2026', value: 172, unit: 'mg/dL', status: 'High' }
        ]
      },
      {
        id: 't-p2-a1c',
        name: 'Hemoglobin A1c (HbA1c)',
        category: 'Blood Sugar & Diabetes Screening',
        value: 8.2,
        numericValue: 8.2,
        unit: '%',
        refRange: { min: 4.0, max: 5.6, text: '< 5.7% (General ADA Goal: < 7.0%)' },
        status: 'High',
        priority: 'ORANGE',
        sourcePage: 1,
        plainMeaning: 'A 3-month average of blood sugar levels.',
        whatItMeasures: 'Cumulative diabetic control over the last quarter.',
        whyItMatters: '8.2% reflects persistent elevated average blood sugar (approx. 189 mg/dL average). Higher A1c over time increases risk of microvascular complications in kidneys, eyes, and nerves.',
        commonCauses: ['Suboptimal glycemic control'],
        relatedTests: ['Fasting Glucose', 'eGFR', 'Urine Albumin'],
        influencingFactors: ['Red blood cell turnover'],
        clinicalFollowUp: 'Consult physician promptly to review glycemic targets and possible addition of cardioprotective/renoprotective agents.',
        doctorQuestion: 'My HbA1c is 8.2%. What is our target goal, and what treatments can get me closer to under 7.0%?',
        previousValue: 8.7,
        previousNumericValue: 8.7,
        previousDate: 'May 10, 2026',
        history: [
          { date: 'Nov 2025', value: 9.1, unit: '%', status: 'High' },
          { date: 'May 2026', value: 8.7, unit: '%', status: 'High' },
          { date: 'Oct 2026', value: 8.2, unit: '%', status: 'High' }
        ]
      },
      {
        id: 't-p2-creat',
        name: 'Serum Creatinine',
        category: 'Kidney Function',
        value: 1.35,
        numericValue: 1.35,
        unit: 'mg/dL',
        refRange: { min: 0.50, max: 1.10, text: '0.50 - 1.10 mg/dL' },
        status: 'High',
        priority: 'ORANGE',
        sourcePage: 1,
        plainMeaning: 'Muscle waste product filtered out by kidneys.',
        whatItMeasures: 'Kidney filtration integrity.',
        whyItMatters: 'Creatinine is elevated above the normal female reference limit (1.10 mg/dL), indicating mild to moderate reduction in kidney filtration rate.',
        commonCauses: ['Diabetic kidney changes', 'Hypertension', 'Dehydration', 'Certain medications (ACEi/ARBs causes mild bump, NSAIDs)'],
        relatedTests: ['eGFR', 'Urine Microalbumin', 'BUN'],
        influencingFactors: ['Hydration', 'NSAID pain relievers like ibuprofen'],
        clinicalFollowUp: 'Requires prompt clinician review; avoid NSAID pain relievers.',
        doctorQuestion: 'My creatinine has risen to 1.35 mg/dL. Are my kidneys showing early diabetic strain?',
        previousValue: 1.22,
        previousNumericValue: 1.22,
        previousDate: 'May 10, 2026'
      },
      {
        id: 't-p2-egfr',
        name: 'eGFR',
        category: 'Kidney Function',
        value: 54,
        numericValue: 54,
        unit: 'mL/min/1.73m2',
        refRange: { min: 90, max: 120, text: '> 60 mL/min/1.73m2' },
        status: 'Low',
        priority: 'ORANGE',
        isCalculated: true,
        sourcePage: 1,
        plainMeaning: 'Calculated kidney filtration speed.',
        whatItMeasures: 'Kidney functional capacity.',
        whyItMatters: 'An eGFR of 54 mL/min is in the mild-to-moderate reduction range (CKD Stage 3a criteria if confirmed over 3 months). Deserves proactive kidney-protective clinical management.',
        commonCauses: ['Diabetic microvascular changes', 'Blood pressure effects'],
        relatedTests: ['Creatinine', 'Urine Albumin-to-Creatinine Ratio (UACR)'],
        influencingFactors: ['Muscle mass', 'Hydration'],
        clinicalFollowUp: 'Prompt medical review to assess renal-protective strategies (SGLT2 inhibitors, ACEi/ARB review).',
        doctorQuestion: 'My eGFR is 54. What proactive steps can we take right now to protect my kidney function?',
        previousValue: 61,
        previousNumericValue: 61,
        previousDate: 'May 10, 2026',
        history: [
          { date: 'Nov 2025', value: 68, unit: 'mL/min', status: 'Normal' },
          { date: 'May 2026', value: 61, unit: 'mL/min', status: 'Normal' },
          { date: 'Oct 2026', value: 54, unit: 'mL/min', status: 'Low' }
        ]
      },
      {
        id: 't-p2-uacr',
        name: 'Urine Albumin-to-Creatinine Ratio (UACR)',
        category: 'Complete Urine Examination (CUE)',
        value: 68,
        numericValue: 68,
        unit: 'mg/g',
        refRange: { min: 0, max: 30, text: '< 30 mg/g (Microalbuminuria: 30 - 300 mg/g)' },
        status: 'High',
        priority: 'ORANGE',
        sourcePage: 2,
        plainMeaning: 'Detects microscopic amounts of protein leaking into urine.',
        whatItMeasures: 'Early kidney glomerular filter leakage.',
        whyItMatters: 'UACR of 68 mg/g represents early microalbuminuria. This is the earliest sensitive marker of diabetic kidney involvement and indicates the need for kidney-protective medication review.',
        commonCauses: ['Diabetic kidney hyperfiltration and filter leakage', 'Elevated blood pressure'],
        relatedTests: ['eGFR', 'HbA1c', 'Serum Creatinine'],
        influencingFactors: ['Heavy exercise, urinary tract infection, or acute fever can cause temporary elevation'],
        clinicalFollowUp: 'Confirm on a second sample; discuss kidney-protective medicines with your clinician.',
        doctorQuestion: 'My urine protein ratio is 68 mg/g. Are my kidney filters leaking protein due to diabetes?'
      },
      {
        id: 't-p2-hb',
        name: 'Hemoglobin',
        category: 'Complete Blood Count (CBC)',
        value: 12.2,
        numericValue: 12.2,
        unit: 'g/dL',
        refRange: { min: 12.0, max: 15.5, text: '12.0 - 15.5 g/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'Oxygen-carrying protein in red blood cells.',
        whatItMeasures: 'Red cell capacity.',
        whyItMatters: 'Normal, though near the lower end. Good news that kidneys are still producing adequate erythropoietin.',
        commonCauses: ['Normal baseline'],
        relatedTests: ['RBC', 'Hematocrit'],
        influencingFactors: ['Hydration'],
        clinicalFollowUp: 'Routine follow-up.',
        doctorQuestion: 'Is my hemoglobin stable?'
      },
      {
        id: 't-p2-k',
        name: 'Serum Potassium (K+)',
        category: 'Electrolytes & Minerals',
        value: 4.8,
        numericValue: 4.8,
        unit: 'mEq/L',
        refRange: { min: 3.5, max: 5.1, text: '3.5 - 5.1 mEq/L' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'Blood mineral essential for heart rhythm and nerve impulses.',
        whatItMeasures: 'Electrolyte stability in setting of renal function.',
        whyItMatters: 'Normal. Essential to monitor closely in patients with reduced eGFR and blood pressure medications.',
        commonCauses: ['Adequate mineral clearance'],
        relatedTests: ['eGFR', 'Sodium'],
        influencingFactors: ['Dietary potassium, kidney function'],
        clinicalFollowUp: 'Continue periodic electrolyte monitoring.',
        doctorQuestion: 'Is my potassium safe to continue my current blood pressure prescription?'
      }
    ],
    keyFindings: [
      {
        id: 'kf-p2-1',
        testId: 't-p2-egfr',
        testName: 'eGFR (54 mL/min) & Urine Microalbumin (68 mg/g)',
        category: 'Kidney Function',
        reportedResult: 'eGFR: 54 mL/min | UACR: 68 mg/g | Creatinine: 1.35 mg/dL',
        refRange: 'eGFR > 60 mL/min | UACR < 30 mg/g',
        priority: 'ORANGE',
        priorityLabel: 'Prompt Medical Review',
        status: 'High',
        plainLanguageExplanation: 'Your kidney filtration rate has decreased mildly to 54 mL/min, and your urine shows early microalbumin (protein leakage) at 68 mg/g.',
        whyItMatters: 'This combination suggests early diabetic kidney involvement (nephropathy). Starting or optimizing kidney-shielding therapies early is highly effective at slowing or halting further change.',
        recommendedFollowUp: 'Contact your prescribing physician within 1 to 2 weeks to review kidney protection and medication adjustments.'
      },
      {
        id: 'kf-p2-2',
        testId: 't-p2-a1c',
        testName: 'Suboptimal Glycemic Control (HbA1c 8.2%)',
        category: 'Blood Sugar & Diabetes Screening',
        reportedResult: 'HbA1c: 8.2% | Fasting Glucose: 172 mg/dL',
        refRange: 'HbA1c General ADA Goal: < 7.0%',
        priority: 'ORANGE',
        priorityLabel: 'Prompt Medical Review',
        status: 'High',
        plainLanguageExplanation: 'Your 3-month average blood sugar is 8.2%, and fasting sugar was 172 mg/dL. While improved from earlier this year (8.7%), it remains above target.',
        whyItMatters: 'Lowering average sugar closer to your personalized target helps directly protect your kidneys, eyesight, and circulation.',
        recommendedFollowUp: 'Discuss with your endocrinologist or primary care physician to adjust treatment.'
      }
    ],
    patterns: [
      {
        id: 'pat-p2-1',
        title: 'Diabetic Microvascular Renal Pattern',
        priority: 'ORANGE',
        supportingTestIds: ['t-p2-glu', 't-p2-a1c', 't-p2-creat', 't-p2-egfr', 't-p2-uacr'],
        supportingResultsSummary: [
          { name: 'HbA1c', value: '8.2%', status: 'High' },
          { name: 'Serum Creatinine', value: '1.35 mg/dL', status: 'High' },
          { name: 'eGFR', value: '54 mL/min', status: 'Low' },
          { name: 'Urine Albumin/Cr Ratio', value: '68 mg/g', status: 'High' }
        ],
        possibleMeaning: 'Concurrence of persistent hyperglycemia alongside decreased filtration (eGFR < 60) and detectable microalbuminuria. Strongly points to early diabetic nephropathy requiring proactive clinician engagement.',
        alternativeExplanations: [
          'Acute dehydration or volume depletion at the time of testing',
          'Recent use of over-the-counter NSAIDs (e.g. ibuprofen, naproxen)',
          'Temporary blood pressure fluctuations'
        ],
        recommendedDoctorQuestions: [
          'Are my kidneys showing early diabetic nephropathy, and what is our management strategy?',
          'Would an SGLT2 inhibitor or ACE/ARB medication be appropriate to protect my kidneys?'
        ]
      }
    ],
    doctorQuestions: [
      {
        id: 'dq-p2-1',
        question: 'My eGFR is 54 and urine protein is 68 mg/g. What proactive treatments can we start to protect my kidneys?',
        relatedTestName: 'Kidney Function & Urine Microalbumin',
        whyItMatters: 'Renal-protective therapies are most effective when introduced early.',
        discussed: false,
        priority: 'high'
      },
      {
        id: 'dq-p2-2',
        question: 'How should we adjust my diabetes medications to bring my HbA1c from 8.2% down toward our target?',
        relatedTestName: 'HbA1c & Fasting Glucose',
        whyItMatters: 'Tighter glycemic control reduces strain on kidneys and blood vessels.',
        discussed: false,
        priority: 'high'
      }
    ],
    checklist: [
      {
        id: 'chk-p2-1',
        task: 'Bring all current medication boxes or bottles to appointment',
        details: 'Essential to review exact dosages with your doctor before making adjustments.',
        completed: false,
        category: 'medications'
      },
      {
        id: 'chk-p2-2',
        task: 'Avoid taking NSAIDs (like ibuprofen/Aleve) before consulting your doctor',
        details: 'NSAID pain relievers can reduce kidney blood flow when eGFR is mildly low.',
        completed: true,
        category: 'medications'
      }
    ],
    followUps: [
      {
        id: 'fu-p2-1',
        finding: 'Reduced eGFR (54 mL/min) and Microalbuminuria (68 mg/g)',
        whyItDeservesAttention: 'Early intervention halts diabetic kidney progression.',
        urgencyLevel: 'Prompt Clinical Review',
        urgencyTier: 2,
        priority: 'ORANGE',
        whatToDiscuss: 'Review renoprotective medications, confirm repeat urine sample, and verify blood pressure goals.',
        suggestedTimeframe: 'Within 7 to 14 days'
      }
    ],
    originalReportPages: [
      {
        pageNumber: 1,
        title: 'Page 1 — Diabetic & Renal Assessment',
        sections: [
          {
            category: 'METABOLIC & GLYCEMIC PROFILE',
            rawLines: [
              'Fasting Blood Glucose                       172   mg/dL      [  70 - 99   ]    HIGH **',
              'Hemoglobin A1c (HPLC)                       8.2   %          [ 4.0 - 5.6  ]    HIGH **'
            ]
          },
          {
            category: 'RENAL FUNCTION & MICROALBUMIN',
            rawLines: [
              'Serum Creatinine                           1.35   mg/dL      [ 0.50 - 1.10]    HIGH *',
              'eGFR (CKD-EPI)                               54   mL/min     [ > 60       ]    LOW *',
              'Urine Albumin/Creatinine Ratio (UACR)        68   mg/g       [ < 30       ]    HIGH *'
            ]
          }
        ]
      }
    ],
    boundingBoxes: [
      { id: 'bp2-1', testId: 't-p2-glu', testName: 'Fasting Glucose', page: 1, xPercent: 5, yPercent: 20, widthPercent: 90, heightPercent: 4, extractedText: 'Fasting Glucose: 172 mg/dL HIGH' },
      { id: 'bp2-2', testId: 't-p2-a1c', testName: 'HbA1c', page: 1, xPercent: 5, yPercent: 26, widthPercent: 90, heightPercent: 4, extractedText: 'HbA1c: 8.2% HIGH' },
      { id: 'bp2-3', testId: 't-p2-egfr', testName: 'eGFR', page: 1, xPercent: 5, yPercent: 52, widthPercent: 90, heightPercent: 4, extractedText: 'eGFR: 54 mL/min LOW' }
    ]
  },

  // Patient 3: David Chen (Normal Wellness Screen - GREEN category exemplar)
  'p-3': {
    id: 'rep-003',
    patient: PATIENTS[2],
    reportDate: 'October 12, 2026',
    collectionDate: 'October 11, 2026 (08:00 AM Fasting)',
    labName: 'Pacific Health & Preventive Medicine Diagnostics',
    labAddress: '900 Embarcadero Center, San Francisco, CA',
    accreditation: 'CLIA & CAP Accredited Laboratory',
    status: 'Analysis Complete',
    tests: [
      {
        id: 't-p3-hb',
        name: 'Hemoglobin',
        category: 'Complete Blood Count (CBC)',
        value: 15.4,
        numericValue: 15.4,
        unit: 'g/dL',
        refRange: { min: 13.5, max: 17.5, text: '13.5 - 17.5 g/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 1,
        plainMeaning: 'Oxygen-carrying protein in red blood cells.',
        whatItMeasures: 'Red cell oxygen-carrying capacity.',
        whyItMatters: 'Completely within normal range. No signs of anemia.',
        commonCauses: ['Healthy baseline'],
        relatedTests: ['RBC', 'WBC', 'Platelets'],
        influencingFactors: ['Good hydration'],
        clinicalFollowUp: 'No follow-up needed.',
        doctorQuestion: 'Is my complete blood count optimal?'
      },
      {
        id: 't-p3-glu',
        name: 'Fasting Blood Glucose',
        category: 'Blood Sugar & Diabetes Screening',
        value: 88,
        numericValue: 88,
        unit: 'mg/dL',
        refRange: { min: 70, max: 99, text: '70 - 99 mg/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 1,
        plainMeaning: 'Fasting blood sugar level.',
        whatItMeasures: 'Normal baseline glucose regulation.',
        whyItMatters: 'Optimal fasting glucose. Healthy insulin sensitivity.',
        commonCauses: ['Healthy metabolism'],
        relatedTests: ['HbA1c'],
        influencingFactors: ['Diet and exercise'],
        clinicalFollowUp: 'Routine annual check.',
        doctorQuestion: 'Does my fasting glucose reflect good metabolic health?'
      },
      {
        id: 't-p3-a1c',
        name: 'HbA1c',
        category: 'Blood Sugar & Diabetes Screening',
        value: 5.2,
        numericValue: 5.2,
        unit: '%',
        refRange: { min: 4.0, max: 5.6, text: '< 5.7%' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 1,
        plainMeaning: '3-month average blood sugar level.',
        whatItMeasures: 'Long-term glycemic health.',
        whyItMatters: '5.2% is well inside the normal healthy non-diabetic range.',
        commonCauses: ['Balanced nutrition and regular activity'],
        relatedTests: ['Fasting Glucose'],
        influencingFactors: ['Healthy lifestyle'],
        clinicalFollowUp: 'No action needed.',
        doctorQuestion: 'Is my 3-month sugar level completely normal?'
      },
      {
        id: 't-p3-chol',
        name: 'Total Cholesterol',
        category: 'Lipid Profile & Cholesterol',
        value: 174,
        numericValue: 174,
        unit: 'mg/dL',
        refRange: { min: 100, max: 199, text: '< 200 mg/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 1,
        plainMeaning: 'Total circulating cholesterol.',
        whatItMeasures: 'Cardiovascular lipid levels.',
        whyItMatters: 'Healthy desirable level below 200 mg/dL.',
        commonCauses: ['Balanced dietary fat intake'],
        relatedTests: ['HDL', 'LDL'],
        influencingFactors: ['Diet and genetics'],
        clinicalFollowUp: 'Continue heart-healthy habits.',
        doctorQuestion: 'Are my cholesterol levels within the desirable range?'
      },
      {
        id: 't-p3-creat',
        name: 'Serum Creatinine',
        category: 'Kidney Function',
        value: 0.98,
        numericValue: 0.98,
        unit: 'mg/dL',
        refRange: { min: 0.70, max: 1.30, text: '0.70 - 1.30 mg/dL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'Natural muscle waste product filtered by kidneys.',
        whatItMeasures: 'Kidney filtration efficiency.',
        whyItMatters: 'Optimal kidney filtration with eGFR > 100 mL/min.',
        commonCauses: ['Healthy renal function'],
        relatedTests: ['BUN', 'eGFR'],
        influencingFactors: ['Adequate hydration'],
        clinicalFollowUp: 'No action needed.',
        doctorQuestion: 'Is my kidney function optimal?'
      },
      {
        id: 't-p3-alt',
        name: 'ALT (Liver Enzyme)',
        category: 'Liver Function',
        value: 22,
        numericValue: 22,
        unit: 'U/L',
        refRange: { min: 7, max: 40, text: '7 - 40 U/L' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'Enzyme inside healthy liver cells.',
        whatItMeasures: 'Liver cell integrity.',
        whyItMatters: 'Optimal normal enzyme level.',
        commonCauses: ['Healthy liver cells'],
        relatedTests: ['AST', 'Bilirubin'],
        influencingFactors: ['Healthy lifestyle'],
        clinicalFollowUp: 'No follow-up needed.',
        doctorQuestion: 'Is my liver test completely healthy?'
      },
      {
        id: 't-p3-vitd',
        name: '25-OH Vitamin D',
        category: 'Vitamins & Nutritional Markers',
        value: 36.5,
        numericValue: 36.5,
        unit: 'ng/mL',
        refRange: { min: 30.0, max: 100.0, text: '>= 30.0 ng/mL' },
        status: 'Normal',
        priority: 'GREEN',
        sourcePage: 2,
        plainMeaning: 'Circulating storage form of Vitamin D.',
        whatItMeasures: 'Bone and immune support nutrient.',
        whyItMatters: 'Desirable optimal level above 30 ng/mL.',
        commonCauses: ['Adequate sun and dietary intake'],
        relatedTests: ['Calcium'],
        influencingFactors: ['Outdoors activity'],
        clinicalFollowUp: 'Maintain current routine.',
        doctorQuestion: 'Is my Vitamin D sufficient for bone health?'
      }
    ],
    keyFindings: [
      {
        id: 'kf-p3-1',
        testId: 't-p3-glu',
        testName: 'Comprehensive Routine Wellness Profile',
        category: 'Blood Sugar & Diabetes Screening',
        reportedResult: 'All 7 key screening tests within laboratory reference intervals',
        refRange: 'All within reference ranges',
        priority: 'GREEN',
        priorityLabel: 'No Significant Abnormality Identified in Reviewed Results',
        status: 'Normal',
        plainLanguageExplanation: 'All reviewed laboratory tests—including blood counts, blood sugar, lipid panel, kidney filtration, liver enzymes, and vitamin D—fall comfortably within standard reference intervals.',
        whyItMatters: 'These results provide reassuring evidence of balanced metabolic, cardiovascular, renal, and hepatic function on the date of testing. Please note that normal lab results do not rule out all medical conditions and regular preventive visits remain recommended.',
        recommendedFollowUp: 'Continue current balanced dietary, exercise, and sleep habits. Follow up at your next scheduled annual preventive physical.'
      }
    ],
    patterns: [],
    doctorQuestions: [
      {
        id: 'dq-p3-1',
        question: 'Are there any additional preventive screenings or immunizations recommended for my age group?',
        whyItMatters: 'Keeps routine preventive healthcare fully up to date.',
        discussed: false,
        priority: 'low'
      }
    ],
    checklist: [
      {
        id: 'chk-p3-1',
        task: 'Maintain current exercise and nutrition routine',
        details: 'Great baseline metabolic results to maintain over the coming year.',
        completed: true,
        category: 'preparation'
      }
    ],
    followUps: [
      {
        id: 'fu-p3-1',
        finding: 'All Reviewed Results Within Established Reference Intervals',
        whyItDeservesAttention: 'Provides reassuring baseline data for personal health records.',
        urgencyLevel: 'Routine Follow-Up',
        urgencyTier: 3,
        priority: 'GREEN',
        whatToDiscuss: 'Discuss routine health maintenance and age-appropriate preventive wellness.',
        suggestedTimeframe: 'At next scheduled annual physical'
      }
    ],
    originalReportPages: [
      {
        pageNumber: 1,
        title: 'Page 1 — Annual Preventive Health Screen',
        sections: [
          {
            category: 'ANNUAL SCREENING PROFILE',
            rawLines: [
              'Hemoglobin                                  15.4   g/dL       [ 13.5 - 17.5 ]   NORMAL',
              'Fasting Blood Glucose                         88   mg/dL      [  70 - 99   ]    NORMAL',
              'HbA1c                                        5.2   %          [ 4.0 - 5.6  ]    NORMAL',
              'Total Cholesterol                            174   mg/dL      [ < 200      ]    NORMAL',
              'Serum Creatinine                            0.98   mg/dL      [ 0.70 - 1.30]    NORMAL',
              'ALT / SGPT                                    22   U/L        [  7 - 40    ]    NORMAL',
              '25-OH Vitamin D Total                       36.5   ng/mL      [ >= 30.0    ]    NORMAL'
            ]
          }
        ]
      }
    ],
    boundingBoxes: [
      { id: 'bp3-1', testId: 't-p3-glu', testName: 'Fasting Glucose', page: 1, xPercent: 5, yPercent: 25, widthPercent: 90, heightPercent: 4, extractedText: 'Fasting Glucose: 88 mg/dL NORMAL' }
    ]
  },

  // Patient 4: Samantha J. Reed (Hypothyroidism & Microcytic Iron Deficiency Anemia)
  'p-4': {
    id: 'rep-004',
    patient: PATIENTS[3],
    reportDate: 'October 20, 2026',
    collectionDate: 'October 19, 2026 (08:30 AM Fasting)',
    labName: 'BioReference Specialty Laboratories & Diagnostics',
    labAddress: '481 University Avenue, Suite 300, Philadelphia, PA',
    accreditation: 'CAP & CLIA Accredited Laboratory #39D092841',
    status: 'Analysis Complete',
    tests: [
      {
        id: 't-p4-hb',
        name: 'Hemoglobin',
        shortName: 'Hb',
        category: 'Complete Blood Count (CBC)',
        value: 10.4,
        numericValue: 10.4,
        unit: 'g/dL',
        refRange: { min: 12.0, max: 15.5, text: '12.0 - 15.5 g/dL' },
        status: 'Low',
        priority: 'ORANGE',
        sourcePage: 1,
        plainMeaning: 'Protein in red blood cells carrying oxygen across your body.',
        whatItMeasures: 'Oxygen transport capacity.',
        whyItMatters: 'Noticeably reduced at 10.4 g/dL (moderate anemia). Directly accounts for fatigue, breathlessness on exertion, or cold intolerance.',
        commonCauses: ['Iron deficiency from menstrual blood loss or low dietary iron absorption', 'Thyroid dysfunction impairing erythropoiesis'],
        relatedTests: ['MCV', 'Ferritin', 'Serum Iron', 'TIBC'],
        influencingFactors: ['Menstrual cycle timing', 'Hydration'],
        clinicalFollowUp: 'Prompt medical review to initiate therapeutic iron repletion alongside thyroid optimization.',
        doctorQuestion: 'My hemoglobin has fallen to 10.4 g/dL. What dosage of therapeutic iron do you recommend?',
        previousValue: 11.6,
        previousNumericValue: 11.6,
        previousDate: 'March 12, 2026',
        history: [
          { date: 'Sep 2025', value: 12.2, unit: 'g/dL', status: 'Normal' },
          { date: 'Mar 2026', value: 11.6, unit: 'g/dL', status: 'Low' },
          { date: 'Oct 2026', value: 10.4, unit: 'g/dL', status: 'Low' }
        ]
      },
      {
        id: 't-p4-mcv',
        name: 'Mean Corpuscular Volume (MCV)',
        shortName: 'MCV',
        category: 'Complete Blood Count (CBC)',
        value: 71.5,
        numericValue: 71.5,
        unit: 'fL',
        refRange: { min: 80.0, max: 100.0, text: '80.0 - 100.0 fL' },
        status: 'Low',
        priority: 'ORANGE',
        sourcePage: 1,
        plainMeaning: 'Average physical size of individual red blood cells.',
        whatItMeasures: 'Red blood cell size in femtoliters.',
        whyItMatters: '71.5 fL indicates marked microcytosis (abnormally small red cells), classic hallmark of chronic iron deficiency.',
        commonCauses: ['Depleted iron stores preventing hemoglobin chain synthesis', 'Thalassemia trait'],
        relatedTests: ['Hemoglobin', 'Ferritin', 'TIBC'],
        influencingFactors: ['Duration of iron deficiency'],
        clinicalFollowUp: 'Replenishing iron reserves will normalize cell size over 60-90 days.',
        doctorQuestion: 'Does my small red cell size (71.5 fL) confirm long-standing iron deficiency?'
      },
      {
        id: 't-p4-ferr',
        name: 'Serum Ferritin',
        shortName: 'Ferritin',
        category: 'Vitamins & Nutritional Markers',
        value: 8,
        numericValue: 8,
        unit: 'ng/mL',
        refRange: { min: 15, max: 150, text: '15 - 150 ng/mL (Optimal: > 30)' },
        status: 'Low',
        priority: 'ORANGE',
        sourcePage: 1,
        plainMeaning: 'Total body backup battery stores of iron inside bone marrow and liver.',
        whatItMeasures: 'Intracellular iron storage reserves.',
        whyItMatters: 'Severely depleted at 8 ng/mL. Without iron stores, bone marrow cannot construct sufficient hemoglobin.',
        commonCauses: ['Heavy menstrual cycles', 'Inadequate dietary intake or celiac/malabsorption'],
        relatedTests: ['Hemoglobin', 'MCV', 'Serum Iron'],
        influencingFactors: ['Inflammation can falsely raise ferritin, so a true low of 8 ng/mL is definitive for depleted stores'],
        clinicalFollowUp: 'High-dose oral iron supplementation (ferrous sulfate or bisglycinate) or IV iron infusion if gastrointestinal intolerance occurs.',
        doctorQuestion: 'My ferritin is only 8 ng/mL. Would oral iron pills or an iron infusion be faster to relieve my fatigue?',
        previousValue: 14,
        previousNumericValue: 14,
        previousDate: 'March 12, 2026'
      },
      {
        id: 't-p4-tsh',
        name: 'Thyroid Stimulating Hormone (TSH)',
        shortName: 'TSH',
        category: 'Thyroid Function',
        value: 8.90,
        numericValue: 8.90,
        unit: 'mIU/L',
        refRange: { min: 0.45, max: 4.50, text: '0.45 - 4.50 mIU/L' },
        status: 'High',
        priority: 'ORANGE',
        sourcePage: 2,
        plainMeaning: 'Pituitary signal telling the thyroid gland to produce metabolic hormone.',
        whatItMeasures: 'Thyroid regulation.',
        whyItMatters: 'Significantly elevated at 8.90 mIU/L, combined with low Free T4. Confirms overt primary hypothyroidism (underactive thyroid).',
        commonCauses: ['Hashimoto thyroiditis (autoimmune thyroid condition)', 'Post-viral thyroiditis'],
        relatedTests: ['Free T4', 'Thyroid Peroxidase (TPO) Antibodies'],
        influencingFactors: ['Biotin supplements', 'Pregnancy'],
        clinicalFollowUp: 'Prompt medical review to evaluate levothyroxine hormone replacement therapy.',
        doctorQuestion: 'My TSH is 8.90 mIU/L with low Free T4. Do I need to start levothyroxine for hypothyroidism?',
        previousValue: 5.60,
        previousNumericValue: 5.60,
        previousDate: 'March 12, 2026',
        history: [
          { date: 'Sep 2025', value: 3.80, unit: 'mIU/L', status: 'Normal' },
          { date: 'Mar 2026', value: 5.60, unit: 'mIU/L', status: 'High' },
          { date: 'Oct 2026', value: 8.90, unit: 'mIU/L', status: 'High' }
        ]
      },
      {
        id: 't-p4-ft4',
        name: 'Free Thyroxine (Free T4)',
        shortName: 'FT4',
        category: 'Thyroid Function',
        value: 0.68,
        numericValue: 0.68,
        unit: 'ng/dL',
        refRange: { min: 0.82, max: 1.77, text: '0.82 - 1.77 ng/dL' },
        status: 'Low',
        priority: 'ORANGE',
        sourcePage: 2,
        plainMeaning: 'The circulating active hormone that sets your cellular metabolic speed.',
        whatItMeasures: 'Unbound thyroid hormone.',
        whyItMatters: 'Below reference interval, confirming that thyroid hormone output is insufficient to meet body demands.',
        commonCauses: ['Primary thyroid underactivity'],
        relatedTests: ['TSH'],
        influencingFactors: ['Medications'],
        clinicalFollowUp: 'Core indication for thyroid hormone repletion.',
        doctorQuestion: 'Does my low Free T4 explain my weight changes, hair thinning, and sluggishness?'
      },
      {
        id: 't-p4-crp',
        name: 'High-Sensitivity C-Reactive Protein (hs-CRP)',
        shortName: 'hs-CRP',
        category: 'Inflammatory Markers',
        value: 3.8,
        numericValue: 3.8,
        unit: 'mg/L',
        refRange: { min: 0.0, max: 3.0, text: '< 1.0 (Low risk), 1.0-3.0 (Average), > 3.0 (Elevated)' },
        status: 'High',
        priority: 'YELLOW',
        sourcePage: 2,
        plainMeaning: 'Liver protein flagging systemic or autoimmune inflammation.',
        whatItMeasures: 'Systemic inflammatory activity.',
        whyItMatters: 'Mildly elevated at 3.8 mg/L, often found in autoimmune thyroiditis (Hashimoto).',
        commonCauses: ['Autoimmune thyroid activity', 'Tissue stress'],
        relatedTests: ['TSH', 'ESR'],
        influencingFactors: ['Minor recent viral infections'],
        clinicalFollowUp: 'Check TPO autoantibodies during thyroid follow-up.',
        doctorQuestion: 'Could my elevated CRP be related to autoimmune thyroiditis?'
      }
    ],
    keyFindings: [
      {
        id: 'kf-p4-1',
        testId: 't-p4-tsh',
        testName: 'Overt Primary Hypothyroidism (TSH 8.90 mIU/L & Free T4 0.68 ng/dL)',
        category: 'Thyroid Function',
        reportedResult: 'TSH: 8.90 mIU/L | FT4: 0.68 ng/dL',
        refRange: 'TSH: 0.45-4.50 mIU/L | FT4: 0.82-1.77 ng/dL',
        priority: 'ORANGE',
        priorityLabel: 'Prompt Medical Review',
        status: 'High',
        plainLanguageExplanation: 'Your thyroid gland is significantly underactive. The brain is shouting at the thyroid with high TSH (8.90), but the thyroid is producing too little actual hormone (Free T4 0.68).',
        whyItMatters: 'Underactive thyroid slows down cellular metabolism throughout your body, causing extreme fatigue, weight gain, brain fog, feeling cold, and muscle weakness.',
        recommendedFollowUp: 'Schedule a prompt appointment with your physician within 1 to 2 weeks to evaluate starting thyroid hormone therapy (levothyroxine).'
      },
      {
        id: 'kf-p4-2',
        testId: 't-p4-hb',
        testName: 'Microcytic Iron Deficiency Anemia (Hb 10.4 g/dL & Ferritin 8 ng/mL)',
        category: 'Complete Blood Count (CBC)',
        reportedResult: 'Hb: 10.4 g/dL | MCV: 71.5 fL | Ferritin: 8 ng/mL',
        refRange: 'Hb: 12.0-15.5 g/dL | MCV: 80-100 fL | Ferritin: 15-150 ng/mL',
        priority: 'ORANGE',
        priorityLabel: 'Prompt Medical Review',
        status: 'Low',
        plainLanguageExplanation: 'You have clear iron deficiency anemia. Your red blood cells are smaller than normal (MCV 71.5 fL) and your iron storage reserves are almost empty (Ferritin 8 ng/mL).',
        whyItMatters: 'Low oxygen delivery to muscles and brain compounds thyroid-related exhaustion, causing shortness of breath, dizziness, and poor stamina.',
        recommendedFollowUp: 'Discuss therapeutic iron supplementation and review potential sources of blood loss (such as heavy menstrual cycles) with your clinician.'
      }
    ],
    patterns: [
      {
        id: 'pat-p4-1',
        title: 'Overt Primary Hypothyroidism Pattern',
        priority: 'ORANGE',
        supportingTestIds: ['t-p4-tsh', 't-p4-ft4', 't-p4-crp'],
        supportingResultsSummary: [
          { name: 'TSH', value: '8.90 mIU/L', status: 'High' },
          { name: 'Free T4', value: '0.68 ng/dL', status: 'Low' },
          { name: 'hs-CRP', value: '3.8 mg/L', status: 'High' }
        ],
        possibleMeaning: 'Classic laboratory hallmark of primary thyroid gland insufficiency, frequently driven by autoimmune Hashimoto thyroiditis.',
        alternativeExplanations: [
          'Recovery phase from subacute thyroiditis',
          'Interference from high-dose biotin nutritional supplements'
        ],
        recommendedDoctorQuestions: [
          'Should we check anti-TPO antibodies to confirm Hashimoto thyroiditis?',
          'What initial dose of levothyroxine is appropriate for my weight and age?'
        ]
      },
      {
        id: 'pat-p4-2',
        title: 'Severe Microcytic Iron Depletion Triad',
        priority: 'ORANGE',
        supportingTestIds: ['t-p4-hb', 't-p4-mcv', 't-p4-ferr'],
        supportingResultsSummary: [
          { name: 'Hemoglobin', value: '10.4 g/dL', status: 'Low' },
          { name: 'MCV', value: '71.5 fL', status: 'Low' },
          { name: 'Ferritin', value: '8 ng/mL', status: 'Low' }
        ],
        possibleMeaning: 'Concordant microcytic hypochromic anemia directly caused by exhausted iron stores.',
        alternativeExplanations: [
          'Concurrent thalassemia minor trait (though ferritin of 8 proves true iron depletion)',
          'Gastrointestinal malabsorption (e.g. celiac disease)'
        ],
        recommendedDoctorQuestions: [
          'How many months of iron supplementation will I need to rebuild my ferritin above 50?',
          'Do we need to evaluate for heavy menses or digestive absorption issues?'
        ]
      }
    ],
    doctorQuestions: [
      {
        id: 'dq-p4-1',
        question: 'My TSH is 8.90 and Free T4 is 0.68. Should we begin levothyroxine, and when should we retest?',
        relatedTestName: 'TSH & Free T4',
        whyItMatters: 'Starting thyroid replacement safely restores metabolic energy and stabilizes organ function.',
        discussed: false,
        priority: 'high'
      },
      {
        id: 'dq-p4-2',
        question: 'My ferritin is 8 ng/mL and hemoglobin is 10.4 g/dL. What form of iron supplement will be easiest on my stomach?',
        relatedTestName: 'Ferritin & Hemoglobin',
        whyItMatters: 'Finding a well-tolerated iron formula ensures adherence for the 3-6 months required to refill bone marrow stores.',
        discussed: false,
        priority: 'high'
      }
    ],
    checklist: [
      {
        id: 'chk-p4-1',
        task: 'Track daily fatigue, cold sensitivity, and sleep patterns in a diary',
        details: 'Helps evaluate symptom response once thyroid medication is initiated.',
        completed: false,
        category: 'symptoms'
      },
      {
        id: 'chk-p4-2',
        task: 'List all over-the-counter vitamins, biotin, or hair/nail supplements',
        details: 'Biotin can interfere with laboratory thyroid tests.',
        completed: true,
        category: 'medications'
      }
    ],
    followUps: [
      {
        id: 'fu-p4-1',
        finding: 'TSH 8.90 mIU/L & Free T4 0.68 ng/dL (Primary Hypothyroidism)',
        whyItDeservesAttention: 'Prompt correction reverses cellular fatigue and protects cardiovascular and metabolic rate.',
        urgencyLevel: 'Prompt Clinical Review',
        urgencyTier: 2,
        priority: 'ORANGE',
        whatToDiscuss: 'Initiating thyroid hormone therapy and scheduling a 6-week TSH follow-up draw.',
        suggestedTimeframe: 'Within 7 to 14 days'
      },
      {
        id: 'fu-p4-2',
        finding: 'Moderate Microcytic Anemia (Hb 10.4 g/dL, Ferritin 8 ng/mL)',
        whyItDeservesAttention: 'Restoring iron levels resolves shortness of breath and hair/nail brittleness.',
        urgencyLevel: 'Prompt Clinical Review',
        urgencyTier: 2,
        priority: 'ORANGE',
        whatToDiscuss: 'Prescribing oral iron therapy and reviewing iron-rich dietary sources.',
        suggestedTimeframe: 'Within 1 to 2 weeks'
      }
    ],
    originalReportPages: [
      {
        pageNumber: 1,
        title: 'Page 1 — Hematology & Iron Profile',
        sections: [
          {
            category: 'COMPLETE BLOOD COUNT',
            rawLines: [
              'Hemoglobin (Photometric)                  10.4   g/dL       [ 12.0 - 15.5 ]   LOW **',
              'Total RBC Count (Impedance)               3.85   mil/mcL    [ 4.00 - 5.20 ]   LOW *',
              'Mean Corpuscular Volume (MCV)             71.5   fL         [ 80.0 - 100.0]   LOW **',
              'Serum Ferritin (ECLIA)                       8   ng/mL      [  15 - 150   ]   LOW **'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Page 2 — Endocrine & Thyroid Profile',
        sections: [
          {
            category: 'THYROID PANEL',
            rawLines: [
              'TSH (Ultrasensitive 3rd Gen)              8.90   mIU/L      [ 0.45 - 4.50 ]   HIGH **',
              'Free T4 (Chemiluminescent)                0.68   ng/dL      [ 0.82 - 1.77 ]   LOW **',
              'hs-CRP (Immunoturbidimetric)               3.8   mg/L       [  0.0 - 3.0  ]   HIGH *'
            ]
          }
        ]
      }
    ],
    boundingBoxes: [
      { id: 'bp4-1', testId: 't-p4-hb', testName: 'Hemoglobin', page: 1, xPercent: 5, yPercent: 20, widthPercent: 90, heightPercent: 4, extractedText: 'Hemoglobin: 10.4 g/dL LOW' },
      { id: 'bp4-2', testId: 't-p4-ferr', testName: 'Serum Ferritin', page: 1, xPercent: 5, yPercent: 50, widthPercent: 90, heightPercent: 4, extractedText: 'Serum Ferritin: 8 ng/mL LOW' },
      { id: 'bp4-3', testId: 't-p4-tsh', testName: 'TSH', page: 2, xPercent: 5, yPercent: 25, widthPercent: 90, heightPercent: 4, extractedText: 'TSH: 8.90 mIU/L HIGH' }
    ]
  },

  // Patient 5: Robert Gallagher (Cardiometabolic, Hyperuricemia / Gout Risk, & Hepatic Transaminitis)
  'p-5': {
    id: 'rep-005',
    patient: PATIENTS[4],
    reportDate: 'October 22, 2026',
    collectionDate: 'October 21, 2026 (07:45 AM Fasting)',
    labName: 'St. Jude Cardiovascular & Metabolic Diagnostic Institute',
    labAddress: '100 Medical Plaza Drive, Nashville, TN',
    accreditation: 'Joint Commission & CAP Accredited #45D109283',
    status: 'Analysis Complete',
    tests: [
      {
        id: 't-p5-uric',
        name: 'Serum Uric Acid',
        shortName: 'Uric Acid',
        category: 'Kidney Function',
        value: 8.8,
        numericValue: 8.8,
        unit: 'mg/dL',
        refRange: { min: 3.5, max: 7.2, text: '3.5 - 7.2 mg/dL (Goal < 6.0 in gout)' },
        status: 'High',
        priority: 'ORANGE',
        sourcePage: 1,
        plainMeaning: 'End-product of purine breakdown in blood.',
        whatItMeasures: 'Purine metabolite concentration.',
        whyItMatters: 'Markedly elevated at 8.8 mg/dL. Values above 7.0 mg/dL exceed solubility saturation, creating high risk for sudden painful gout attacks or uric acid kidney stones.',
        commonCauses: ['High dietary purines (red meat, shellfish, beer, whiskey)', 'Metabolic syndrome impairing renal clearance'],
        relatedTests: ['Creatinine', 'eGFR', 'BUN'],
        influencingFactors: ['Alcohol intake', 'High-fructose corn syrup', 'Thiazide diuretics'],
        clinicalFollowUp: 'Discuss gout prophylaxis, dietary purine reduction, and uric acid-lowering medications (e.g. allopurinol).',
        doctorQuestion: 'My uric acid is 8.8 mg/dL. Should we start medication to prevent gout flare-ups and kidney stones?',
        previousValue: 7.9,
        previousNumericValue: 7.9,
        previousDate: 'January 15, 2026',
        history: [
          { date: 'Jun 2025', value: 7.4, unit: 'mg/dL', status: 'Borderline High' },
          { date: 'Jan 2026', value: 7.9, unit: 'mg/dL', status: 'High' },
          { date: 'Oct 2026', value: 8.8, unit: 'mg/dL', status: 'High' }
        ]
      },
      {
        id: 't-p5-alt',
        name: 'Alanine Aminotransferase (ALT / SGPT)',
        shortName: 'ALT',
        category: 'Liver Function',
        value: 68,
        numericValue: 68,
        unit: 'U/L',
        refRange: { min: 7, max: 40, text: '7 - 40 U/L' },
        status: 'High',
        priority: 'ORANGE',
        sourcePage: 1,
        plainMeaning: 'Key enzyme inside liver cells indicating hepatic cellular strain.',
        whatItMeasures: 'Liver cellular inflammation.',
        whyItMatters: 'Noticeably elevated at 68 U/L (approx 1.7x upper limit). In combination with high triglycerides and borderline glucose, points to metabolic fatty liver (steatohepatitis).',
        commonCauses: ['Metabolic dysfunction-associated steatohepatitis (MASH / fatty liver)', 'Medication effect (statins, acetaminophen)', 'Alcohol'],
        relatedTests: ['AST', 'Total Bilirubin', 'Triglycerides'],
        influencingFactors: ['Vigorous exercise', 'Alcohol', 'Weight gain'],
        clinicalFollowUp: 'Consider abdominal liver ultrasound and review medications with doctor.',
        doctorQuestion: 'My ALT is elevated at 68 U/L. Could this be fatty liver, and do you recommend a liver ultrasound?',
        previousValue: 52,
        previousNumericValue: 52,
        previousDate: 'January 15, 2026'
      },
      {
        id: 't-p5-ast',
        name: 'Aspartate Aminotransferase (AST / SGOT)',
        shortName: 'AST',
        category: 'Liver Function',
        value: 54,
        numericValue: 54,
        unit: 'U/L',
        refRange: { min: 10, max: 40, text: '10 - 40 U/L' },
        status: 'High',
        priority: 'YELLOW',
        sourcePage: 1,
        plainMeaning: 'Enzyme in liver cells and cardiac/muscle tissue.',
        whatItMeasures: 'Cellular enzyme activity.',
        whyItMatters: 'Elevated at 54 U/L, tracking with ALT (ALT > AST pattern typical of non-alcoholic metabolic fatty liver).',
        commonCauses: ['Metabolic liver changes'],
        relatedTests: ['ALT', 'Bilirubin'],
        influencingFactors: ['Muscle exertion'],
        clinicalFollowUp: 'Track alongside ALT.',
        doctorQuestion: 'Does my AST/ALT ratio confirm metabolic liver changes?'
      },
      {
        id: 't-p5-trig',
        name: 'Triglycerides',
        shortName: 'TRIG',
        category: 'Lipid Profile & Cholesterol',
        value: 285,
        numericValue: 285,
        unit: 'mg/dL',
        refRange: { min: 30, max: 149, text: '< 150 mg/dL (High: 200 - 499 mg/dL)' },
        status: 'High',
        priority: 'ORANGE',
        sourcePage: 2,
        plainMeaning: 'Circulating fats from carbohydrates, sugars, and liver lipid production.',
        whatItMeasures: 'Circulating neutral fats.',
        whyItMatters: 'Significantly elevated at 285 mg/dL. High triglycerides accelerate liver fat storage and increase vascular risk.',
        commonCauses: ['High intake of simple carbs or alcohol', 'Insulin resistance'],
        relatedTests: ['Total Cholesterol', 'Fasting Glucose', 'ALT'],
        influencingFactors: ['Must be drawn fasting'],
        clinicalFollowUp: 'Address dietary sugars, reduce alcohol, and discuss lipid therapy with physician.',
        doctorQuestion: 'My triglycerides are 285 mg/dL. Should we add a triglyceride-lowering therapy or modify diet first?',
        previousValue: 240,
        previousNumericValue: 240,
        previousDate: 'January 15, 2026'
      },
      {
        id: 't-p5-glu',
        name: 'Fasting Blood Glucose',
        shortName: 'FBG',
        category: 'Blood Sugar & Diabetes Screening',
        value: 126,
        numericValue: 126,
        unit: 'mg/dL',
        refRange: { min: 70, max: 99, text: '70 - 99 mg/dL (Diabetes threshold >= 126)' },
        status: 'High',
        priority: 'ORANGE',
        sourcePage: 2,
        plainMeaning: 'Morning fasting blood sugar.',
        whatItMeasures: 'Basal glycemic status.',
        whyItMatters: 'At 126 mg/dL, this meets the formal threshold for diabetic evaluation when confirmed by repeat testing.',
        commonCauses: ['Insulin resistance and impaired liver glucose regulation'],
        relatedTests: ['HbA1c'],
        influencingFactors: ['Fasting time'],
        clinicalFollowUp: 'Confirm with second fasting draw or HbA1c correlation.',
        doctorQuestion: 'My fasting sugar is 126 mg/dL. Does this confirm early diabetes alongside my HbA1c?'
      },
      {
        id: 't-p5-a1c',
        name: 'HbA1c',
        shortName: 'HbA1c',
        category: 'Blood Sugar & Diabetes Screening',
        value: 6.6,
        numericValue: 6.6,
        unit: '%',
        refRange: { min: 4.0, max: 5.6, text: '< 5.7% (Diabetes: >= 6.5%)' },
        status: 'High',
        priority: 'ORANGE',
        sourcePage: 2,
        plainMeaning: '3-month average blood glucose.',
        whatItMeasures: 'Quarterly glycemic exposure.',
        whyItMatters: '6.6% crosses into the diabetic diagnostic criterion (>=6.5%). Early management preserves pancreatic beta cell function.',
        commonCauses: ['Progressive insulin resistance'],
        relatedTests: ['Fasting Glucose', 'Triglycerides'],
        influencingFactors: ['Hemoglobin turnover'],
        clinicalFollowUp: 'Begin active diabetes lifestyle management and discuss first-line metformin therapy.',
        doctorQuestion: 'My HbA1c is 6.6%. What is our target goal, and should we consider early medical therapy?'
      }
    ],
    keyFindings: [
      {
        id: 'kf-p5-1',
        testId: 't-p5-uric',
        testName: 'Hyperuricemia & Gout Risk (Serum Uric Acid 8.8 mg/dL)',
        category: 'Kidney Function',
        reportedResult: '8.8 mg/dL',
        refRange: '3.5 - 7.2 mg/dL',
        priority: 'ORANGE',
        priorityLabel: 'Prompt Medical Review',
        status: 'High',
        plainLanguageExplanation: 'Your blood uric acid level is 8.8 mg/dL, which is well above the saturation point where needle-shaped urate crystals form in joints or kidneys.',
        whyItMatters: 'Creates a high likelihood of sudden excruciating joint pain (gout attacks, especially in the big toe or ankle) and kidney stone formation.',
        recommendedFollowUp: 'Discuss uric-acid lowering medication (e.g., allopurinol) and avoid high-purine foods (beer, red meats, seafood) with your physician.'
      },
      {
        id: 'kf-p5-2',
        testId: 't-p5-alt',
        testName: 'Hepatic Transaminitis & Fatty Liver Pattern (ALT 68 U/L & Triglycerides 285 mg/dL)',
        category: 'Liver Function',
        reportedResult: 'ALT: 68 U/L | AST: 54 U/L | Triglycerides: 285 mg/dL',
        refRange: 'ALT: 7 - 40 U/L | Triglycerides < 150 mg/dL',
        priority: 'ORANGE',
        priorityLabel: 'Prompt Medical Review',
        status: 'High',
        plainLanguageExplanation: 'Both key liver enzymes are elevated alongside high blood fats (triglycerides 285 mg/dL), indicating that the liver is carrying excess fat that causes low-grade cellular inflammation.',
        whyItMatters: 'Managing metabolic liver fat early prevents long-term scarring (fibrosis). It responds very well to dietary changes and weight reduction.',
        recommendedFollowUp: 'Discuss an abdominal ultrasound to grade liver fat and review all medications.'
      }
    ],
    patterns: [
      {
        id: 'pat-p5-1',
        title: 'Metabolic Hepato-Glycemic Clustering (Fatty Liver & Early Diabetes)',
        priority: 'ORANGE',
        supportingTestIds: ['t-p5-alt', 't-p5-ast', 't-p5-trig', 't-p5-glu', 't-p5-a1c'],
        supportingResultsSummary: [
          { name: 'ALT', value: '68 U/L', status: 'High' },
          { name: 'AST', value: '54 U/L', status: 'High' },
          { name: 'Triglycerides', value: '285 mg/dL', status: 'High' },
          { name: 'HbA1c', value: '6.6%', status: 'High' }
        ],
        possibleMeaning: 'Concurrence of elevated liver enzymes with hypertriglyceridemia and early diabetes indicates classic metabolic steatohepatitis (fatty liver).',
        alternativeExplanations: [
          'Medication-induced transaminitis (e.g. statin therapy or analgesics)',
          'Recent alcohol intake preceding testing'
        ],
        recommendedDoctorQuestions: [
          'Would an abdominal liver ultrasound be appropriate to check for fatty liver?',
          'How will treating my blood sugar help normalize my liver enzymes?'
        ]
      }
    ],
    doctorQuestions: [
      {
        id: 'dq-p5-1',
        question: 'My uric acid is 8.8 mg/dL. Should we start medication to prevent painful gout attacks and kidney stones?',
        relatedTestName: 'Serum Uric Acid',
        whyItMatters: 'Uric acid above 8.0 mg/dL carries significant joint crystallization risk.',
        discussed: false,
        priority: 'high'
      },
      {
        id: 'dq-p5-2',
        question: 'My liver enzymes (ALT 68, AST 54) and triglycerides (285) are high. Could this be metabolic fatty liver?',
        relatedTestName: 'Liver Panel & Triglycerides',
        whyItMatters: 'Clarifies whether imaging or lifestyle adjustments are required.',
        discussed: false,
        priority: 'high'
      }
    ],
    checklist: [
      {
        id: 'chk-p5-1',
        task: 'Record any joint tenderness or pain in big toes, ankles, or knees',
        details: 'Essential history for your doctor to evaluate gout risk.',
        completed: false,
        category: 'symptoms'
      },
      {
        id: 'chk-p5-2',
        task: 'Document daily alcohol and sugary drink consumption over the past month',
        details: 'Directly impacts both uric acid and liver transaminases.',
        completed: false,
        category: 'preparation'
      }
    ],
    followUps: [
      {
        id: 'fu-p5-1',
        finding: 'Serum Uric Acid 8.8 mg/dL (Hyperuricemia / Gout Risk)',
        whyItDeservesAttention: 'Prevents acute crystal arthropathy and protects renal tubules.',
        urgencyLevel: 'Prompt Clinical Review',
        urgencyTier: 2,
        priority: 'ORANGE',
        whatToDiscuss: 'Discuss starting urate-lowering therapy and dietary purine moderation.',
        suggestedTimeframe: 'Within 1 to 2 weeks'
      },
      {
        id: 'fu-p5-2',
        finding: 'Elevated ALT (68 U/L), AST (54 U/L) & Triglycerides (285 mg/dL)',
        whyItDeservesAttention: 'Early intervention reverses metabolic liver fat.',
        urgencyLevel: 'Prompt Clinical Review',
        urgencyTier: 2,
        priority: 'ORANGE',
        whatToDiscuss: 'Order liver ultrasound and initiate metabolic lifestyle changes.',
        suggestedTimeframe: 'Within 2 to 3 weeks'
      }
    ],
    originalReportPages: [
      {
        pageNumber: 1,
        title: 'Page 1 — Hepatic Enzymes & Renal Metabolites',
        sections: [
          {
            category: 'CHEMISTRY & LIVER PANEL',
            rawLines: [
              'Alanine Aminotransferase (ALT)             68   U/L        [  7 - 40    ]    HIGH **',
              'Aspartate Aminotransferase (AST)           54   U/L        [ 10 - 40    ]    HIGH *',
              'Serum Uric Acid                            8.8   mg/dL      [ 3.5 - 7.2  ]    HIGH **'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Page 2 — Glycemic & Lipid Markers',
        sections: [
          {
            category: 'LIPIDS & GLUCOSE',
            rawLines: [
              'Triglycerides (Fasting)                    285   mg/dL      [ < 150      ]    HIGH **',
              'Fasting Blood Glucose                      126   mg/dL      [  70 - 99   ]    HIGH **',
              'Hemoglobin A1c (NGSP)                      6.6   %          [ 4.0 - 5.6  ]    HIGH **'
            ]
          }
        ]
      }
    ],
    boundingBoxes: [
      { id: 'bp5-1', testId: 't-p5-uric', testName: 'Serum Uric Acid', page: 1, xPercent: 5, yPercent: 45, widthPercent: 90, heightPercent: 4, extractedText: 'Uric Acid: 8.8 mg/dL HIGH' },
      { id: 'bp5-2', testId: 't-p5-alt', testName: 'ALT / SGPT', page: 1, xPercent: 5, yPercent: 20, widthPercent: 90, heightPercent: 4, extractedText: 'ALT: 68 U/L HIGH' }
    ]
  }
};
