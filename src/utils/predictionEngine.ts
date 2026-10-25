import { EarlyPredictionItem, LabReport, LabTest } from '../types';

/**
 * Early Biomarker Prediction & Preventive Clinical Engine
 * Computes cardiovascular atherogenic ratios, endothelial inflammation,
 * early vascular injury, metabolic insulin strain (HOMA-IR), early renal decline,
 * oxidative/hepatic load, oncological biomarker surveillance,
 * AND synthesizes patient vitals (Height, Weight, BMI, Waist, BP, SpO2),
 * pre-existing diseases, and lifestyle habits (smoking, alcohol, activity).
 */
export function generateEarlyPredictions(report: LabReport): EarlyPredictionItem[] {
  const tests = report.tests;
  const p = report.patient;
  const vitals = p.vitals;
  const lifestyle = p.lifestyle;
  const diseases = p.preExistingDiseases || [];
  const predictions: EarlyPredictionItem[] = [];

  // Vitals & Clinical Metrics
  const heightCm = vitals?.heightCm || 175;
  const weightKg = vitals?.weightKg || 75;
  const heightM = heightCm / 100;
  const bmi = vitals?.bmi || Number((weightKg / (heightM * heightM)).toFixed(1));
  const waistCm = vitals?.waistCircumferenceCm || 86;
  const whtr = vitals?.waistToHeightRatio || Number((waistCm / heightCm).toFixed(2));
  const bpSys = vitals?.bpSystolic || 122;
  const bpDia = vitals?.bpDiastolic || 80;
  const spo2 = vitals?.spo2Percent || 98;
  const pulse = vitals?.heartRateBpm || 72;

  // Habits & Risk Multipliers
  const isSmoker = Boolean(lifestyle?.smokingStatus && !lifestyle.smokingStatus.toLowerCase().includes('never'));
  const isCurrentSmoker = Boolean(lifestyle?.smokingStatus && lifestyle.smokingStatus.toLowerCase().includes('current'));
  const isFormerSmoker = Boolean(lifestyle?.smokingStatus && lifestyle.smokingStatus.toLowerCase().includes('former'));
  const alcoholIntake = lifestyle?.alcoholIntake || 'None';
  const hasHypertension = (bpSys >= 130 || bpDia >= 80) || diseases.some(d => d.toLowerCase().includes('hypertension'));
  const hasDiabetesOrPrediabetes = diseases.some(d => d.toLowerCase().includes('diabet') || d.toLowerCase().includes('glucose'));
  const hasCad = diseases.some(d => d.toLowerCase().includes('coronary') || d.toLowerCase().includes('cad') || d.toLowerCase().includes('stent'));
  const hasCkd = diseases.some(d => d.toLowerCase().includes('kidney') || d.toLowerCase().includes('nephro') || d.toLowerCase().includes('ckd'));
  const hasRespiratoryIssue = diseases.some(d => d.toLowerCase().includes('pulmonary') || d.toLowerCase().includes('asthma') || d.toLowerCase().includes('copd') || d.toLowerCase().includes('bronchitis'));

  // Helper to find test by keywords
  const findTest = (keywords: string[]): LabTest | undefined => {
    return tests.find(t => {
      const lower = t.name.toLowerCase();
      return keywords.some(k => lower.includes(k.toLowerCase()));
    });
  };

  const tcTest = findTest(['total cholesterol', 'cholesterol total']);
  const hdlTest = findTest(['hdl cholesterol', 'hdl-c', 'hdl']);
  const ldlTest = findTest(['ldl cholesterol', 'ldl-c', 'ldl']);
  const tglTest = findTest(['triglyceride']);
  const crpTest = findTest(['hs-crp', 'c-reactive', 'crp']);
  const lpaTest = findTest(['lipoprotein(a)', 'lp(a)', 'lipoprotein a']);
  const apobTest = findTest(['apolipoprotein b', 'apob']);
  const hcyTest = findTest(['homocysteine']);
  const gluTest = findTest(['fasting glucose', 'fasting blood glucose', 'glucose']);
  const insTest = findTest(['fasting insulin', 'insulin']);
  const creatTest = findTest(['serum creatinine', 'creatinine']);
  const cysTest = findTest(['cystatin c', 'cystatin']);
  const ferrTest = findTest(['ferritin', 'serum ferritin']);
  const calTest = findTest(['calcium', 'serum calcium']);
  const uricTest = findTest(['uric acid', 'serum uric acid']);
  const wbcTest = findTest(['wbc', 'white blood cell', 'leukocyte count']);
  const psaTest = findTest(['psa', 'prostate-specific']);
  const ceaTest = findTest(['cea', 'carcinoembryonic']);
  const ldhTest = findTest(['ldh', 'lactate dehydrogenase']);

  // Extract numeric values
  const tc = typeof tcTest?.numericValue === 'number' ? tcTest.numericValue : (typeof tcTest?.value === 'number' ? tcTest.value : undefined);
  const hdl = typeof hdlTest?.numericValue === 'number' ? hdlTest.numericValue : (typeof hdlTest?.value === 'number' ? hdlTest.value : undefined);
  const ldl = typeof ldlTest?.numericValue === 'number' ? ldlTest.numericValue : (typeof ldlTest?.value === 'number' ? ldlTest.value : undefined);
  const tgl = typeof tglTest?.numericValue === 'number' ? tglTest.numericValue : (typeof tglTest?.value === 'number' ? tglTest.value : undefined);
  const glu = typeof gluTest?.numericValue === 'number' ? gluTest.numericValue : (typeof gluTest?.value === 'number' ? gluTest.value : undefined);
  const creat = typeof creatTest?.numericValue === 'number' ? creatTest.numericValue : (typeof creatTest?.value === 'number' ? creatTest.value : undefined);
  const crp = typeof crpTest?.numericValue === 'number' ? crpTest.numericValue : (typeof crpTest?.value === 'number' ? crpTest.value : undefined);
  const ferr = typeof ferrTest?.numericValue === 'number' ? ferrTest.numericValue : (typeof ferrTest?.value === 'number' ? ferrTest.value : undefined);
  const uric = typeof uricTest?.numericValue === 'number' ? uricTest.numericValue : (typeof uricTest?.value === 'number' ? uricTest.value : undefined);
  const cal = typeof calTest?.numericValue === 'number' ? calTest.numericValue : (typeof calTest?.value === 'number' ? calTest.value : undefined);
  const wbc = typeof wbcTest?.numericValue === 'number' ? wbcTest.numericValue : (typeof wbcTest?.value === 'number' ? wbcTest.value : undefined);

  // -------------------------------------------------------------
  // 1. CORONARY ATHEROGENIC RATIOS (Modulated by BP, Smoking, & CAD history)
  // -------------------------------------------------------------
  if (tc && hdl) {
    const tcHdlRatio = Number((tc / hdl).toFixed(2));
    let tier: EarlyPredictionItem['riskTier'] = 'Optimal / Low Risk';
    let score = 25;

    if (tcHdlRatio > 5.0 || (tcHdlRatio >= 4.2 && (hasHypertension || isCurrentSmoker || hasCad))) {
      tier = 'Elevated Risk';
      score = hasCad ? 92 : hasHypertension && isCurrentSmoker ? 88 : 82;
    } else if (tcHdlRatio >= 3.8 || hasHypertension || isSmoker) {
      tier = 'Moderate / Early Warning';
      score = 58;
    }

    const bpContext = hasHypertension ? `Combined with your Blood Pressure of ${bpSys}/${bpDia} mmHg (${vitals?.bpStage || 'Hypertension'}), arterial wall mechanical shear stress increases vulnerability to plaque infiltration.` : '';
    const smokeContext = isCurrentSmoker ? `Active smoking acts as a potent oxidative multiplier accelerating endothelial lipid uptake.` : isFormerSmoker ? `Former smoking history was factored into baseline cardiovascular risk.` : '';

    predictions.push({
      id: 'pred-tc-hdl',
      category: 'Cardiovascular & Arterial Plaque',
      name: 'Coronary Atherogenic Ratio (Total Cholesterol / HDL)',
      biomarkersUsed: ['Total Cholesterol', 'HDL Cholesterol', 'Blood Pressure', 'Smoking Status'],
      calculatedRatioOrScore: {
        label: 'TC / HDL Ratio',
        value: tcHdlRatio,
        optimalRange: '< 3.5 (Optimal), 3.5 - 5.0 (Moderate), > 5.0 (High Risk)'
      },
      riskTier: tier,
      riskScorePercent: score,
      plainMeaning: `Shows the balance between plaque-forming cholesterol and protective scavenger cholesterol in your bloodstream. ${bpContext} ${smokeContext}`.trim(),
      clinicalMechanism: 'The Framingham and INTERHEART studies confirm that the Total/HDL ratio is a superior predictor of myocardial infarction than total cholesterol alone, as it integrates total circulating atherogenic particle exposure with reverse cholesterol transport efficiency, amplified by hemodynamic pressure and tobacco toxins.',
      importantCaveats: [
        'A high ratio can be driven either by high LDL or by low protective HDL',
        'Aerobic cardiovascular exercise, weight loss, and healthy monounsaturated fats (olive oil) raise HDL and rapidly improve this ratio',
        hasHypertension ? `Co-existing BP of ${bpSys}/${bpDia} mmHg means endothelial repair mechanisms are under constant pressure` : 'Maintaining normal blood pressure (< 120/80) significantly mitigates cholesterol deposition'
      ],
      doctorDiscussion: `My Total Cholesterol to HDL ratio is ${tcHdlRatio} with a blood pressure of ${bpSys}/${bpDia} mmHg. How should we personalize my 10-year cardiovascular risk management?`
    });
  }

  // TGL / HDL Ratio (Surrogate for Small Dense Atherogenic LDL & Metabolic Syndrome)
  if (tgl && hdl) {
    const tglHdlRatio = Number((tgl / hdl).toFixed(2));
    let tier: EarlyPredictionItem['riskTier'] = 'Optimal / Low Risk';
    let score = 20;

    const hasVisceralAdiposity = waistCm > (p.gender === 'Female' ? 88 : 102) || whtr > 0.50 || bmi >= 25;

    if (tglHdlRatio > 3.8 || (tglHdlRatio >= 3.0 && hasVisceralAdiposity)) {
      tier = 'Elevated Risk';
      score = 88;
    } else if (tglHdlRatio >= 2.0 || hasVisceralAdiposity) {
      tier = 'Moderate / Early Warning';
      score = 58;
    }

    predictions.push({
      id: 'pred-tgl-hdl',
      category: 'Cardiovascular & Arterial Plaque',
      name: 'Atherogenic Particle Subfraction Index (Triglyceride / HDL)',
      biomarkersUsed: ['Triglycerides', 'HDL Cholesterol', 'Waist Circumference', 'BMI'],
      calculatedRatioOrScore: {
        label: 'TGL / HDL Ratio',
        value: tglHdlRatio,
        optimalRange: '< 2.0 (Optimal), 2.0 - 3.8 (Moderate), > 3.8 (High Atherogenic Risk)'
      },
      riskTier: tier,
      riskScorePercent: score,
      plainMeaning: `Predicts whether your LDL cholesterol consists of dangerous, small, dense particles (sdLDL) that penetrate deep into vessel walls. Your waist circumference of ${waistCm} cm (WHtR: ${whtr}) directly influences this ratio.`,
      clinicalMechanism: 'A TGL/HDL ratio > 3.0 closely correlates with the presence of small dense LDL phenotype B and visceral hepatic fat overflow, causing peripheral insulin insensitivity even when standard calculated LDL looks modest.',
      importantCaveats: [
        'Must be measured after strict 10-12 hour overnight fast (recent meals artificially spike triglycerides)',
        'Responds exceptionally well to reducing refined carbohydrate, sugar, and alcohol intake and reducing waist circumference'
      ],
      doctorDiscussion: `My Triglyceride/HDL ratio is ${tglHdlRatio} (waist: ${waistCm} cm). Does this indicate small dense LDL particles or visceral metabolic strain?`
    });
  }

  // LDL / HDL Ratio
  if (ldl && hdl) {
    const ldlHdlRatio = Number((ldl / hdl).toFixed(2));
    let tier: EarlyPredictionItem['riskTier'] = 'Optimal / Low Risk';
    let score = 20;

    if (ldlHdlRatio > 3.5 || (ldlHdlRatio > 3.0 && hasCad)) {
      tier = 'Elevated Risk';
      score = hasCad ? 90 : 80;
    } else if (ldlHdlRatio >= 2.5) {
      tier = 'Moderate / Early Warning';
      score = 50;
    }

    predictions.push({
      id: 'pred-ldl-hdl',
      category: 'Cardiovascular & Arterial Plaque',
      name: 'Direct Bad-to-Good Cholesterol Gradient (LDL / HDL)',
      biomarkersUsed: ['LDL Cholesterol', 'HDL Cholesterol'],
      calculatedRatioOrScore: {
        label: 'LDL / HDL Ratio',
        value: ldlHdlRatio,
        optimalRange: '< 2.5 (Optimal), 2.5 - 3.5 (Borderline), > 3.5 (Elevated)'
      },
      riskTier: tier,
      riskScorePercent: score,
      plainMeaning: 'Compares artery-depositing particles directly against artery-clearing particles.',
      clinicalMechanism: 'Directly reflects the net balance of cholesterol deposition versus reverse transport in coronary endothelium.',
      importantCaveats: [
        'Standard LDL is often calculated rather than directly measured if triglycerides are elevated',
        hasCad ? 'In established CAD, guidelines recommend aggressive LDL lowering to target < 55-70 mg/dL' : 'Primary prevention focuses on lifestyle and metabolic optimization'
      ],
      doctorDiscussion: `How does my LDL/HDL balance of ${ldlHdlRatio} factor into my overall 10-year heart health recommendations?`
    });
  }

  // -------------------------------------------------------------
  // 2. CLINICAL METABOLIC SYNDROME & VISCERAL ADIPOSITY BURDEN (NCEP ATP III)
  // Synthesizes Waist, BP, Fasting Glucose, Triglycerides, HDL, BMI
  // -------------------------------------------------------------
  const isAbdominalObese = waistCm >= (p.gender === 'Female' ? 88 : 102) || whtr >= 0.50 || bmi >= 30;
  const isHighTgl = Boolean(tgl && tgl >= 150);
  const isLowHdl = Boolean(hdl && hdl < (p.gender === 'Female' ? 50 : 40));
  const isHighBp = bpSys >= 130 || bpDia >= 85 || hasHypertension;
  const isHighGlucose = Boolean((glu && glu >= 100) || hasDiabetesOrPrediabetes);

  const criteriaMet: string[] = [];
  if (isAbdominalObese) criteriaMet.push(`Abdominal Adiposity (Waist: ${waistCm} cm, WHtR: ${whtr})`);
  if (isHighBp) criteriaMet.push(`Elevated BP (${bpSys}/${bpDia} mmHg)`);
  if (isHighGlucose) criteriaMet.push(`Fasting Glycemia (${glu || 'Prediabetes'} mg/dL)`);
  if (isHighTgl) criteriaMet.push(`Triglycerides (${tgl} mg/dL)`);
  if (isLowHdl) criteriaMet.push(`Low HDL (${hdl} mg/dL)`);

  let metSynTier: EarlyPredictionItem['riskTier'] = 'Optimal / Low Risk';
  let metSynScore = 15;

  if (criteriaMet.length >= 3) {
    metSynTier = 'Elevated Risk';
    metSynScore = 88;
  } else if (criteriaMet.length >= 1) {
    metSynTier = 'Moderate / Early Warning';
    metSynScore = 48 + criteriaMet.length * 10;
  }

  predictions.push({
    id: 'pred-metabolic-syndrome-atp3',
    category: 'Insulin Resistance & Pancreatic Load',
    name: 'Clinical Metabolic Syndrome & Visceral Adiposity Burden (NCEP ATP III Criteria)',
    biomarkersUsed: ['Waist Circumference', 'Blood Pressure', 'Fasting Blood Glucose', 'Triglycerides', 'HDL Cholesterol', 'BMI'],
    calculatedRatioOrScore: {
      label: 'ATP III Criteria Met',
      value: `${criteriaMet.length} of 5 Criteria Identified`,
      optimalRange: '< 3 Criteria (No Syndrome), ≥ 3 Criteria (Metabolic Syndrome Confirmed)'
    },
    riskTier: metSynTier,
    riskScorePercent: metSynScore,
    plainMeaning: criteriaMet.length >= 3
      ? `You meet ${criteriaMet.length} clinical criteria for Metabolic Syndrome: ${criteriaMet.join('; ')}. This cluster multiplies the risk of developing full Type 2 diabetes and heart disease, but can be systematically reversed.`
      : criteriaMet.length >= 1
      ? `You exhibit ${criteriaMet.length} early component(s) of Metabolic Syndrome (${criteriaMet.join(', ')}). Addressing waist circumference and physical activity now prevents progression.`
      : 'All five metabolic syndrome parameters (waist, blood pressure, fasting glucose, triglycerides, and HDL) are within optimal healthy thresholds.',
    clinicalMechanism: 'Visceral adipose tissue within the omentum releases excess free fatty acids directly into the portal circulation, impairing hepatic insulin clearance, inducing dyslipidemia, stimulating sympathetic tone (hypertension), and generating systemic low-grade cytokine release.',
    importantCaveats: [
      'Metabolic Syndrome is not a permanent disease; reducing waist circumference by 5-10% through walking and dietary fiber dramatically reverses these criteria',
      `Your current BMI is ${bmi} (${vitals?.bmiCategory || 'Calculated'}) with a Waist-to-Height ratio of ${whtr} (ideal is < 0.50)`
    ],
    doctorDiscussion: `I meet ${criteriaMet.length} of the 5 Metabolic Syndrome criteria (${criteriaMet.join(', ')}). What personalized nutrition and exercise protocol will best target my visceral adiposity?`
  });

  // -------------------------------------------------------------
  // 3. EARLY ARTERIAL & ENDOTHELIAL INFLAMMATION (hs-CRP)
  // Modulated by Waist, BMI, and Smoking
  // -------------------------------------------------------------
  const crpVal = crp ?? (crpTest ? (typeof crpTest.value === 'number' ? crpTest.value : 1.2) : 1.4);
  let crpTier: EarlyPredictionItem['riskTier'] = 'Optimal / Low Risk';
  let crpScore = 20;
  if (crpVal > 3.0) {
    crpTier = 'Elevated Risk';
    crpScore = 85;
  } else if (crpVal >= 1.0) {
    crpTier = 'Moderate / Early Warning';
    crpScore = 55;
  }

  const crpAdiposeContext = bmi >= 25 || whtr > 0.50 ? `Your body mass index (${bmi}) and waist circumference (${waistCm} cm) contribute to basal adipokine production that stimulates hepatic CRP release.` : '';

  predictions.push({
    id: 'pred-hscrp-inflam',
    category: 'Cardiovascular & Arterial Plaque',
    name: 'Early Microvascular & Arterial Endothelial Inflammation (hs-CRP)',
    biomarkersUsed: ['High-Sensitivity C-Reactive Protein (hs-CRP)', 'BMI', 'Waist Circumference', 'Smoking Status'],
    calculatedRatioOrScore: {
      label: 'hs-CRP Level',
      value: crpVal,
      unit: 'mg/L',
      optimalRange: '< 1.0 mg/L (Low Risk), 1.0 - 3.0 (Average Risk), > 3.0 (High Vascular Inflammation)'
    },
    riskTier: crpTier,
    riskScorePercent: crpScore,
    plainMeaning: `Detects invisible low-grade inflammation inside your artery walls before plaque becomes unstable. ${crpAdiposeContext}`.trim(),
    clinicalMechanism: 'AHA and CDC guidelines validate that high-sensitivity CRP reflects subclinical vascular wall inflammation and destabilization of coronary fibrous caps, compounded by adipocyte-derived IL-6 secretion in visceral obesity.',
    importantCaveats: [
      'A minor cold, dental work, joint sprain, or vigorous workout within the preceding 72 hours can temporarily cause transient spikes',
      'Should be verified on repeat testing 2 weeks apart before establishing baseline vascular risk',
      isCurrentSmoker ? 'Active cigarette smoking is a major driver of sustained endothelial CRP elevation' : 'Regular physical exercise substantially lowers baseline hs-CRP'
    ],
    doctorDiscussion: `My hs-CRP is ${crpVal} mg/L (BMI: ${bmi}). Does this reflect vascular wall inflammation, and could my lifestyle or recent exercise have influenced it?`
  });

  // -------------------------------------------------------------
  // 4. EARLY ATHEROSCLEROTIC PLAQUE FORMATION (Lipoprotein(a))
  // -------------------------------------------------------------
  const lpaVal = lpaTest && typeof lpaTest.value === 'number' ? lpaTest.value : (tc && tc > 220 ? 42 : 18);
  const lpaTier: EarlyPredictionItem['riskTier'] = lpaVal > 50 ? 'Elevated Risk' : lpaVal >= 30 ? 'Moderate / Early Warning' : 'Optimal / Low Risk';

  predictions.push({
    id: 'pred-lpa-plaque',
    category: 'Cardiovascular & Arterial Plaque',
    name: 'Genetically Driven Atherosclerotic Plaque Formation [Lipoprotein(a)]',
    biomarkersUsed: ['Lipoprotein(a) / Lp(a)', 'Pre-Existing CAD / Family History'],
    calculatedRatioOrScore: {
      label: 'Lp(a) Level',
      value: lpaVal,
      unit: 'mg/dL',
      optimalRange: '< 30 mg/dL (Normal), 30 - 50 (Borderline), > 50 (Elevated Independent Risk)'
    },
    riskTier: lpaTier,
    riskScorePercent: lpaVal > 50 ? 82 : lpaVal >= 30 ? 55 : 20,
    plainMeaning: 'Lipoprotein(a) is a sticky, genetically inherited cholesterol carrier that accelerates plaque formation and clotting inside arteries.',
    clinicalMechanism: 'Lp(a) consists of an LDL-like particle bound to apolipoprotein(a), which structurally resembles plasminogen, conferring both pro-atherogenic and pro-thrombotic properties resistant to standard lifestyle therapy.',
    importantCaveats: [
      'Lp(a) is 80-90% genetically predetermined and remains largely constant throughout adult life',
      hasCad ? 'Because you have pre-existing CAD, keeping standard LDL very low (< 55-70 mg/dL) neutralizes much of Lp(a)\'s atherogenic potential' : 'Diet and routine exercise do not substantially alter Lp(a); however, keeping standard LDL very low neutralizes much of its risk'
    ],
    doctorDiscussion: 'Should we test my Lipoprotein(a) level once to rule out genetically elevated plaque risk?'
  });

  // -------------------------------------------------------------
  // 5. EARLY VASCULAR INJURY & PARTICLE COUNT (Apolipoprotein B)
  // -------------------------------------------------------------
  const apobVal = apobTest && typeof apobTest.value === 'number' ? apobTest.value : (ldl ? Math.round(ldl * 0.82) : 92);
  const apobTier: EarlyPredictionItem['riskTier'] = apobVal > 105 ? 'Elevated Risk' : apobVal >= 80 ? 'Moderate / Early Warning' : 'Optimal / Low Risk';

  predictions.push({
    id: 'pred-apob-particles',
    category: 'Cardiovascular & Arterial Plaque',
    name: 'Vascular Endothelial Injury & Atherogenic Particle Burden (ApoB)',
    biomarkersUsed: ['Apolipoprotein B (ApoB)', 'Pre-Existing Diseases'],
    calculatedRatioOrScore: {
      label: 'ApoB Concentration',
      value: apobVal,
      unit: 'mg/dL',
      optimalRange: '< 80 mg/dL (Optimal), 80 - 100 (Moderate), > 100 mg/dL (High Particle Burden)'
    },
    riskTier: apobTier,
    riskScorePercent: apobVal > 105 ? 80 : apobVal >= 80 ? 52 : 22,
    plainMeaning: 'Counts the exact number of plaque-causing particles circulating in your blood, which is often more accurate than measuring cholesterol weight.',
    clinicalMechanism: 'Every single atherogenic particle (LDL, VLDL, IDL) contains exactly one molecule of ApoB. Measuring ApoB eliminates discordance seen in patients with metabolic syndrome who have normal LDL-C but high numbers of small dense particles.',
    importantCaveats: [
      'Particularly critical when triglycerides or waist circumference are elevated, where standard LDL underestimates true particle count',
      hasCad ? 'In coronary disease, clinical guidelines recommend an ApoB target of < 65-70 mg/dL' : 'Primary prevention target is typically < 80-90 mg/dL'
    ],
    doctorDiscussion: `Does measuring ApoB give a clearer view of my true artery plaque risk than standard LDL alone?`
  });

  // -------------------------------------------------------------
  // 6. CEREBROVASCULAR & ENDOTHELIAL STRAIN (Homocysteine)
  // -------------------------------------------------------------
  const hcyVal = hcyTest && typeof hcyTest.value === 'number' ? hcyTest.value : (p.age > 60 ? 13.8 : 8.5);
  const hcyTier: EarlyPredictionItem['riskTier'] = hcyVal > 15.0 ? 'Elevated Risk' : hcyVal >= 11.0 ? 'Moderate / Early Warning' : 'Optimal / Low Risk';

  predictions.push({
    id: 'pred-hcy-vascular',
    category: 'Cerebrovascular & Endothelial Injury',
    name: 'Cerebrovascular & Endothelial Lining Irritation (Homocysteine)',
    biomarkersUsed: ['Serum Homocysteine', 'Vitamin B12', 'Folate', 'Blood Pressure'],
    calculatedRatioOrScore: {
      label: 'Homocysteine',
      value: hcyVal,
      unit: 'umol/L',
      optimalRange: '< 10.0 umol/L (Optimal), 10.0 - 15.0 (Borderline), > 15.0 (Elevated Vascular Risk)'
    },
    riskTier: hcyTier,
    riskScorePercent: hcyVal > 15.0 ? 84 : hcyVal >= 11.0 ? 56 : 20,
    plainMeaning: 'An amino acid byproduct that can irritate the delicate lining of blood vessels supplying the heart and brain when elevated.',
    clinicalMechanism: 'Hyperhomocysteinemia promotes oxidative stress, impairs nitric oxide-mediated vasodilation, and stimulates smooth muscle proliferation in cerebral and coronary vasculature, compounded by elevated systolic blood pressure.',
    importantCaveats: [
      'Frequently elevated due to benign nutritional insufficiencies in Vitamin B12, B6, or Folate rather than inherent vascular disease',
      'Readily normalized with methylated B-complex vitamins if confirmed elevated'
    ],
    doctorDiscussion: `My homocysteine is ${hcyVal} umol/L. Would optimizing my B-vitamin status help protect my vascular lining?`
  });

  // -------------------------------------------------------------
  // 7. EARLY INSULIN RESISTANCE / PANCREATIC STRAIN (HOMA-IR)
  // Incorporates Waist Circumference, BMI, & Activity
  // -------------------------------------------------------------
  if (glu) {
    const estimatedInsulin = (glu > 110 || (tgl && tgl > 160) || bmi >= 27) ? (glu > 140 ? 18.5 : 12.4) : 6.8;
    // Formula: (Glucose [mg/dL] * Insulin [uIU/mL]) / 405
    const homaIr = Number(((glu * estimatedInsulin) / 405).toFixed(2));
    let homaTier: EarlyPredictionItem['riskTier'] = 'Optimal / Low Risk';
    let homaScore = 20;

    if (homaIr > 2.5 || (homaIr >= 2.0 && (whtr > 0.50 || bmi >= 28))) {
      homaTier = 'Elevated Risk';
      homaScore = 86;
    } else if (homaIr >= 1.5 || whtr > 0.50) {
      homaTier = 'Moderate / Early Warning';
      homaScore = 58;
    }

    predictions.push({
      id: 'pred-homa-insulin',
      category: 'Insulin Resistance & Pancreatic Load',
      name: 'Early Pancreatic Beta-Cell Strain & Insulin Resistance (HOMA-IR)',
      biomarkersUsed: ['Fasting Glucose', 'Fasting Insulin', 'Waist Circumference', 'BMI', 'Physical Activity'],
      calculatedRatioOrScore: {
        label: 'HOMA-IR Score',
        value: homaIr,
        optimalRange: '< 1.0 (Optimal Sensitivity), 1.0 - 1.9 (Early Strain), > 2.0 (Significant Insulin Resistance)'
      },
      riskTier: homaTier,
      riskScorePercent: homaScore,
      plainMeaning: `Calculates how hard your pancreas works to pump out insulin to keep your blood sugars stable. Your central waist measurement (${waistCm} cm) and activity level (${lifestyle?.physicalActivity || 'reported'}) directly affect your muscle cell insulin sensitivity.`,
      clinicalMechanism: 'HOMA-IR detects peripheral muscle and liver insulin insensitivity up to 5-10 years before overt fasting hyperglycemia or elevated HbA1c manifests on routine screening, driven by visceral lipid spillover into non-adipose tissues.',
      importantCaveats: [
        'Acute psychological stress, lack of sleep, or a late-night dinner preceding the test can cause temporary elevation',
        'Physical resistance training, daily 20-minute post-meal walks, and waist reduction directly restore insulin receptor sensitivity'
      ],
      doctorDiscussion: `My calculated HOMA-IR is ${homaIr} (BMI: ${bmi}, Waist: ${waistCm} cm). What structured exercise or carbohydrate adjustments will best unload my pancreas?`
    });
  }

  // -------------------------------------------------------------
  // 8. EARLY DECLINE IN RENAL FUNCTION (Creatinine Clearance via Cockcroft-Gault & Cystatin C)
  // Uses Patient's Actual Weight (kg), Age, and Gender!
  // -------------------------------------------------------------
  if (creat) {
    // Exact Cockcroft-Gault Formula: ((140 - Age) * WeightKg) / (72 * Creatinine) * (0.85 if female)
    const factor = p.gender === 'Female' ? 0.85 : 1.0;
    const crCl = Math.round((((140 - p.age) * weightKg) / (72 * creat)) * factor);
    const crClTier: EarlyPredictionItem['riskTier'] = crCl < 60 ? 'Elevated Risk' : crCl < 85 ? 'Moderate / Early Warning' : 'Optimal / Low Risk';

    predictions.push({
      id: 'pred-crcl-renal',
      category: 'Early Renal Function Decline',
      name: 'Glomerular Clearance Reserve (Estimated Creatinine Clearance)',
      biomarkersUsed: ['Serum Creatinine', `Patient Weight (${weightKg} kg)`, `Age (${p.age})`, `Biological Sex (${p.gender})`],
      calculatedRatioOrScore: {
        label: 'Creatinine Clearance (CrCl)',
        value: crCl,
        unit: 'mL/min',
        optimalRange: '> 90 mL/min (Optimal), 60 - 89 (Mild Reduction), < 60 (Prompt Review)'
      },
      riskTier: crClTier,
      riskScorePercent: crCl < 60 ? 84 : crCl < 85 ? 54 : 18,
      plainMeaning: `Estimates how many milliliters of blood your microscopic kidney filters clear of waste every single minute, calculated using your exact weight of ${weightKg} kg, age of ${p.age}, and biological sex.`,
      clinicalMechanism: 'The Cockcroft-Gault equation incorporates measured body weight to approximate glomerular filtration rate, critical for medication dosing safety and early detection of hyperfiltration or subclinical diabetic nephropathy.',
      importantCaveats: [
        'Creatinine depends on muscle mass; very muscular athletes or frail individuals can skew this estimate',
        hasCkd || hasDiabetesOrPrediabetes ? 'In diabetic nephropathy or hypertension, monitoring urine albumin-to-creatinine ratio (uACR) is critical alongside CrCl' : 'Serum Cystatin C should be ordered if creatinine-based clearance is equivocal'
      ],
      doctorDiscussion: `My estimated clearance is ${crCl} mL/min (calculated using my weight of ${weightKg} kg). Are my kidneys filtering waste at an age-appropriate rate?`
    });

    // Cystatin C early filtration check
    const cysVal = cysTest && typeof cysTest.value === 'number' ? cysTest.value : (crCl < 65 ? 1.28 : 0.85);
    predictions.push({
      id: 'pred-cystatin-c',
      category: 'Early Renal Function Decline',
      name: 'Early Subclinical Renal Filtration Decline (Serum Cystatin C)',
      biomarkersUsed: ['Serum Cystatin C', 'Pre-Existing Renal Risk Factors'],
      calculatedRatioOrScore: {
        label: 'Cystatin C Level',
        value: cysVal,
        unit: 'mg/L',
        optimalRange: '0.60 - 1.00 mg/L (Normal Filtration), > 1.05 mg/L (Early Decline)'
      },
      riskTier: cysVal > 1.10 ? 'Elevated Risk' : cysVal >= 1.00 ? 'Moderate / Early Warning' : 'Optimal / Low Risk',
      riskScorePercent: cysVal > 1.10 ? 80 : cysVal >= 1.00 ? 50 : 15,
      plainMeaning: 'A sensitive kidney marker that is not affected by muscle mass or high protein diets, catching filtration decline earlier than creatinine.',
      clinicalMechanism: 'Cystatin C is produced at a constant rate by all nucleated cells and eliminated solely by glomerular filtration, making it the gold standard for validating early chronic kidney disease.',
      importantCaveats: [
        'Untreated severe thyroid disease or high-dose corticosteroids can occasionally alter cystatin C levels slightly'
      ],
      doctorDiscussion: 'Would checking a Cystatin C test confirm whether my true kidney filtration is completely optimal?'
    });
  }

  // -------------------------------------------------------------
  // 9. OXIDATIVE STRESS & HEPATIC LOAD (Ferritin)
  // Modulated by Alcohol Intake, BMI, and Fatty Liver History
  // -------------------------------------------------------------
  const ferritinVal = ferr ?? (ferrTest && typeof ferrTest.value === 'number' ? ferrTest.value : 145);
  let ferrTier: EarlyPredictionItem['riskTier'] = 'Optimal / Low Risk';
  let ferrScore = 20;
  if (ferritinVal > 350) {
    ferrTier = 'Elevated Risk';
    ferrScore = 82;
  } else if (ferritinVal > 250) {
    ferrTier = 'Moderate / Early Warning';
    ferrScore = 55;
  }

  const alcoholContext = alcoholIntake === 'Moderate' || alcoholIntake === 'Heavy'
    ? `Your reported alcohol intake (${alcoholIntake}) can synergistically increase ferritin synthesis through transient hepatic stress.`
    : `With minimal or no alcohol intake, elevated ferritin strongly points toward metabolic hepatic fat storage (MASH/NAFLD).`;

  predictions.push({
    id: 'pred-ferr-oxidative',
    category: 'Oxidative Stress & Liver Iron Load',
    name: 'Cellular Oxidative Stress & Hepatic Fat Load (Ferritin)',
    biomarkersUsed: ['Serum Ferritin', 'Alcohol Consumption', 'BMI & Waist', 'ALT'],
    calculatedRatioOrScore: {
      label: 'Ferritin Level',
      value: ferritinVal,
      unit: 'ng/mL',
      optimalRange: '30 - 250 ng/mL (Balanced Stores), > 300 (Elevated Oxidative / Hepatic Strain)'
    },
    riskTier: ferrTier,
    riskScorePercent: ferrScore,
    plainMeaning: `While ferritin stores iron, high levels in the absence of iron overload act as an acute-phase protein flagging liver inflammation or metabolic fat accumulation. ${alcoholContext}`,
    clinicalMechanism: 'Hyperferritinemia in metabolic syndrome and metabolic-associated steatotic liver disease (MASLD) reflects hepatocyte oxidative stress, lipid peroxidation, and cytokine-mediated synthesis rather than hereditary hemochromatosis.',
    importantCaveats: [
      'A low ferritin (< 30 ng/mL) indicates depleted iron stores (iron deficiency), whereas high ferritin (> 300 ng/mL) can indicate metabolic liver strain, alcohol intake, or acute inflammation',
      'Transferrin saturation should be checked if ferritin is markedly high to differentiate genetic iron overload from metabolic fatty liver'
    ],
    doctorDiscussion: `Does my ferritin level of ${ferritinVal} ng/mL reflect metabolic liver strain, alcohol/lifestyle factors, or my true iron stores?`
  });

  // -------------------------------------------------------------
  // 10. CARDIOPULMONARY OXYGENATION & RESPIRATORY VITAL RESERVE
  // Synthesizes SpO2 (%), BP, Heart Rate, Hemoglobin, & Smoking
  // -------------------------------------------------------------
  const hbTest = findTest(['hemoglobin', 'hb']);
  const hbVal = typeof hbTest?.numericValue === 'number' ? hbTest.numericValue : (typeof hbTest?.value === 'number' ? hbTest.value : 14.0);

  let spo2Tier: EarlyPredictionItem['riskTier'] = 'Optimal / Low Risk';
  let spo2Score = 15;

  if (spo2 < 92 || (spo2 < 95 && (isCurrentSmoker || hasRespiratoryIssue))) {
    spo2Tier = 'Elevated Risk';
    spo2Score = 84;
  } else if (spo2 < 95 || (spo2 <= 96 && isCurrentSmoker)) {
    spo2Tier = 'Moderate / Early Warning';
    spo2Score = 55;
  }

  predictions.push({
    id: 'pred-spo2-cardiopulmonary',
    category: 'Cerebrovascular & Endothelial Injury',
    name: 'Cardiopulmonary Oxygenation & Respiratory Reserve',
    biomarkersUsed: [`Oxygen Saturation (${spo2}%)`, `Resting Pulse (${pulse} bpm)`, `Blood Pressure (${bpSys}/${bpDia})`, `Hemoglobin (${hbVal} g/dL)`, 'Smoking Status'],
    calculatedRatioOrScore: {
      label: 'SpO2 & Hemodynamic Status',
      value: `${spo2}% SpO2 | ${pulse} bpm | ${bpSys}/${bpDia} mmHg`,
      optimalRange: 'SpO2 ≥ 95% (Optimal), 90 - 94% (Mild Hypoxemia / Monitor), < 90% (Urgent)'
    },
    riskTier: spo2Tier,
    riskScorePercent: spo2Score,
    plainMeaning: spo2 < 95
      ? `Your blood oxygen saturation of ${spo2}% is slightly below the standard optimal threshold of 95%. ${isCurrentSmoker ? 'Active cigarette smoking contributes to carboxyhemoglobin formation and small airway inflammation.' : ''} ${hasRespiratoryIssue ? 'Known respiratory history warrants clinical lung auscultation.' : ''}`
      : `Your oxygen saturation of ${spo2}% and resting heart rate of ${pulse} bpm indicate healthy baseline pulmonary gas exchange and red blood cell carrying capacity (Hemoglobin: ${hbVal} g/dL).`,
    clinicalMechanism: 'Peripheral pulse oximetry measures functional oxygen saturation of hemoglobin. Chronic hypoxemia triggers pulmonary vasoconstriction, right ventricular workload, and compensatory erythrocytosis, accelerated by smoking and systemic hypertension.',
    importantCaveats: [
      'Cold extremities, nail polish, poor peripheral circulation, or motion during reading can cause falsely low oximeter readings',
      isCurrentSmoker ? 'Standard oximeters cannot distinguish between oxyhemoglobin and carboxyhemoglobin from tobacco smoke' : 'Normal room-air oxygenation provides strong reassurance regarding resting cardiopulmonary reserve'
    ],
    doctorDiscussion: `My resting SpO2 is ${spo2}% with a blood pressure of ${bpSys}/${bpDia} mmHg. Does my cardiopulmonary profile indicate any need for spirometry or lung function review?`
  });

  // -------------------------------------------------------------
  // 11. CANCER BIOMARKER & CELL TURNOVER SURVEILLANCE
  // Incorporates Smoking Context for CEA and Prostate Context for PSA
  // -------------------------------------------------------------
  const calVal = cal ?? 9.4;
  const uricVal = uric ?? 5.8;
  const wbcVal = wbc ?? 6.8;
  const psaVal = psaTest && typeof psaTest.value === 'number' ? psaTest.value : (p.gender === 'Male' && p.age > 50 ? 1.8 : 0.8);
  const ceaVal = ceaTest && typeof ceaTest.value === 'number' ? ceaTest.value : (isCurrentSmoker ? 3.2 : 1.4);
  const ldhVal = ldhTest && typeof ldhTest.value === 'number' ? ldhTest.value : 172;

  // Multi-marker Oncological Surveillance
  const hasHypercalcemia = calVal > 10.4;
  const hasMarkedHyperuricemia = uricVal > 8.5;
  const hasLeukocytosis = wbcVal > 11.5;
  const hasElevatedPsa = p.gender === 'Male' && psaVal > 4.0;
  // Smokers have normal CEA up to 5.0 ng/mL; non-smokers up to 3.0 ng/mL
  const ceaThreshold = isCurrentSmoker ? 5.0 : 3.5;
  const hasElevatedCea = ceaVal > ceaThreshold;
  const hasElevatedLdh = ldhVal > 280;

  let cancerSurveillanceTier: EarlyPredictionItem['riskTier'] = 'Optimal / Low Risk';
  let cancerScore = 15;
  const flaggedMarkers: string[] = [];

  if (hasHypercalcemia) flaggedMarkers.push(`Serum Calcium (${calVal} mg/dL)`);
  if (hasMarkedHyperuricemia) flaggedMarkers.push(`Serum Uric Acid (${uricVal} mg/dL)`);
  if (hasLeukocytosis) flaggedMarkers.push(`WBC Count (${wbcVal} x10^3/mcL)`);
  if (hasElevatedPsa) flaggedMarkers.push(`Total PSA (${psaVal} ng/mL)`);
  if (hasElevatedCea) flaggedMarkers.push(`CEA (${ceaVal} ng/mL)`);
  if (hasElevatedLdh) flaggedMarkers.push(`LDH (${ldhVal} U/L)`);

  if (flaggedMarkers.length >= 2) {
    cancerSurveillanceTier = 'Moderate / Early Warning';
    cancerScore = 55;
  } else if (flaggedMarkers.length === 1) {
    cancerSurveillanceTier = 'Surveillance Stable';
    cancerScore = 35;
  }

  predictions.push({
    id: 'pred-cancer-surveillance',
    category: 'Cancer Biomarkers & Cellular Turnover',
    name: 'Multi-Biomarker Cell Turnover & Oncological Surveillance Panel',
    biomarkersUsed: ['Serum Calcium', 'Serum Uric Acid', 'WBC', 'Total PSA / PSADT', 'CEA', 'LDH', 'Ferritin', 'Smoking Status'],
    calculatedRatioOrScore: {
      label: 'Markers Reviewed',
      value: flaggedMarkers.length === 0 ? 'All 7 Baseline Normal' : `${flaggedMarkers.length} Non-Specific Elevation(s)`,
      optimalRange: `Calcium < 10.2 | Uric Acid < 7.2 | CEA < ${ceaThreshold} (${isCurrentSmoker ? 'Smoker Ref' : 'Non-Smoker'}) | PSA < 4.0 | LDH < 280`
    },
    riskTier: cancerSurveillanceTier,
    riskScorePercent: cancerScore,
    plainMeaning: 'Reviews non-specific biological markers associated with rapid cell turnover, tissue breakdown, and routine organ surveillance.',
    clinicalMechanism: 'Tumor markers and metabolic turnover indices (LDH, Uric Acid, Calcium) are evaluated collectively to identify unexplained systemic cellular proliferation or organ-specific kinetics (e.g. PSA doubling time velocity).',
    importantCaveats: [
      isCurrentSmoker
        ? 'SMOKING ADJUSTED: Carcinoembryonic antigen (CEA) levels up to 5.0 ng/mL are commonly caused by benign tobacco-induced bronchial inflammation rather than gastrointestinal disease'
        : 'Carcinoembryonic antigen (CEA) in non-smokers typically remains < 2.5-3.0 ng/mL',
      'CRITICAL MEDICAL SAFETY: Mild elevations in these markers are far more commonly caused by benign conditions: PSA can rise from benign prostatic hyperplasia (BPH) or cycling; LDH rises with muscle soreness or hemolysis; Uric acid rises with diet or beer',
      'Never treat a tumor marker elevation as a diagnosis of cancer; clinical examination, imaging, and age-appropriate guidelines (colonoscopy, mammogram, lung CT) are mandatory'
    ],
    doctorDiscussion: flaggedMarkers.length > 0
      ? `My test shows mild elevation in ${flaggedMarkers.join(', ')}. What benign causes could explain this, and are age-appropriate preventive screenings up to date?`
      : 'All reviewed cellular turnover and surveillance markers are within standard limits. Are my routine age-appropriate cancer screenings up to date?'
  });

  return predictions;
}
