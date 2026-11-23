import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ExternalLink, 
  Activity, 
  Heart, 
  ShieldAlert, 
  Flame, 
  Droplet, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  HelpCircle, 
  Info, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  Layers,
  Moon,
  Ruler,
  Scale,
  Gauge
} from 'lucide-react';
import { LabReport } from '../types';
import { 
  CalculatorResult, 
  MedicalCalculatorsResult, 
  computeAllMedicalCalculators,
  calculateEGFR,
  calculateFib4,
  calculateBRI,
  calculateMAP,
  calculateCreatinineClearance,
  calculateAhaPrevent,
  calculateAhaPreventCvd,
  calculateAhaPreventAscvd,
  calculateAhaPreventHf,
  calculateStopBang,
  calculateHomaIr
} from '../utils/medicalCalculators';

interface MedicalCalculatorsPanelProps {
  report: LabReport;
}

export const MedicalCalculatorsPanel: React.FC<MedicalCalculatorsPanelProps> = ({
  report
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLiveAdjuster, setShowLiveAdjuster] = useState<boolean>(false);
  const [activeAdjusterCalc, setActiveAdjusterCalc] = useState<string>('prevent');

  // Compute live calculations from current report
  const calcData: MedicalCalculatorsResult = useMemo(() => {
    return computeAllMedicalCalculators(report);
  }, [report]);

  // Interactive Live Adjuster Form State (seeded from patient report)
  const p = report.patient;
  const vitals = p.vitals;
  const lifestyle = p.lifestyle;
  const diseases = p.preExistingDiseases || [];

  const [adjAge, setAdjAge] = useState<number>(p.age || 48);
  const [adjGender, setAdjGender] = useState<'Male' | 'Female'>(p.gender === 'Female' ? 'Female' : 'Male');
  const [adjWeight, setAdjWeight] = useState<number>(vitals?.weightKg || 75);
  const [adjHeight, setAdjHeight] = useState<number>(vitals?.heightCm || 175);
  const [adjWaist, setAdjWaist] = useState<number>(vitals?.waistCircumferenceCm || 88);
  const [adjSbp, setAdjSbp] = useState<number>(vitals?.bpSystolic || 122);
  const [adjDbp, setAdjDbp] = useState<number>(vitals?.bpDiastolic || 80);
  const [adjCreatinine, setAdjCreatinine] = useState<number>(calcData.crcl.inputsUsed.find(i => i.key === 'scr')?.value as number || 0.95);
  const [adjAst, setAdjAst] = useState<number>(calcData.fib4.inputsUsed.find(i => i.key === 'ast')?.value as number || 28);
  const [adjAlt, setAdjAlt] = useState<number>(calcData.fib4.inputsUsed.find(i => i.key === 'alt')?.value as number || 32);
  const [adjPlatelets, setAdjPlatelets] = useState<number>(calcData.fib4.inputsUsed.find(i => i.key === 'plt')?.value as number || 250);
  const [adjGlucose, setAdjGlucose] = useState<number>(calcData.homaIr.inputsUsed.find(i => i.key === 'glu')?.value as number || 95);
  const [adjInsulin, setAdjInsulin] = useState<number>(calcData.homaIr.inputsUsed.find(i => i.key === 'ins')?.value as number || 11);
  const [adjTc, setAdjTc] = useState<number>(calcData.prevent.inputsUsed.find(i => i.key === 'tc')?.value as number || 195);
  const [adjHdl, setAdjHdl] = useState<number>(calcData.prevent.inputsUsed.find(i => i.key === 'hdl')?.value as number || 45);
  const [adjSmoker, setAdjSmoker] = useState<boolean>(Boolean(lifestyle?.smokingStatus && lifestyle.smokingStatus.toLowerCase().includes('current')));
  const [adjDiabetes, setAdjDiabetes] = useState<boolean>(diseases.some(d => {
    const dl = d.toLowerCase();
    return (dl.includes('diabet') && !dl.includes('prediabet')) || dl.includes('type 2') || dl.includes('type 1');
  }));
  const [adjBpMeds, setAdjBpMeds] = useState<boolean>(diseases.some(d => d.toLowerCase().includes('hypertens')));
  const [adjStatin, setAdjStatin] = useState<boolean>(diseases.some(d => d.toLowerCase().includes('statin')));
  const [adjSnoring, setAdjSnoring] = useState<boolean>(false);
  const [adjTired, setAdjTired] = useState<boolean>(false);
  const [adjObserved, setAdjObserved] = useState<boolean>(false);

  // Reset Adjuster state back to patient's current report
  const handleResetAdjuster = () => {
    setAdjAge(p.age || 48);
    setAdjGender(p.gender === 'Female' ? 'Female' : 'Male');
    setAdjWeight(vitals?.weightKg || 75);
    setAdjHeight(vitals?.heightCm || 175);
    setAdjWaist(vitals?.waistCircumferenceCm || 88);
    setAdjSbp(vitals?.bpSystolic || 122);
    setAdjDbp(vitals?.bpDiastolic || 80);
    setAdjCreatinine(calcData.crcl.inputsUsed.find(i => i.key === 'scr')?.value as number || 0.95);
    setAdjAst(calcData.fib4.inputsUsed.find(i => i.key === 'ast')?.value as number || 28);
    setAdjAlt(calcData.fib4.inputsUsed.find(i => i.key === 'alt')?.value as number || 32);
    setAdjPlatelets(calcData.fib4.inputsUsed.find(i => i.key === 'plt')?.value as number || 250);
    setAdjGlucose(calcData.homaIr.inputsUsed.find(i => i.key === 'glu')?.value as number || 95);
    setAdjInsulin(calcData.homaIr.inputsUsed.find(i => i.key === 'ins')?.value as number || 11);
    setAdjTc(calcData.prevent.inputsUsed.find(i => i.key === 'tc')?.value as number || 195);
    setAdjHdl(calcData.prevent.inputsUsed.find(i => i.key === 'hdl')?.value as number || 45);
    setAdjSmoker(Boolean(lifestyle?.smokingStatus && lifestyle.smokingStatus.toLowerCase().includes('current')));
    setAdjDiabetes(diseases.some(d => {
      const dl = d.toLowerCase();
      return (dl.includes('diabet') && !dl.includes('prediabet')) || dl.includes('type 2') || dl.includes('type 1');
    }));
    setAdjBpMeds(diseases.some(d => d.toLowerCase().includes('hypertens')));
    setAdjStatin(diseases.some(d => d.toLowerCase().includes('statin')));
    setAdjSnoring(false);
    setAdjTired(false);
    setAdjObserved(false);
  };

  // Toggle card expansion
  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy question helper
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter calculators by category
  const categories = [
    { id: 'ALL', label: `All ${calcData.allCalculators.length} Calculators` },
    { id: 'Cardiovascular & Hemodynamic', label: 'Cardiovascular & Hemodynamic' },
    { id: 'Renal & Excretion', label: 'Renal & Excretion' },
    { id: 'Metabolic & Glycemic', label: 'Metabolic & Glycemic' },
    { id: 'Hepatic & Liver', label: 'Hepatic & Liver' },
    { id: 'Pulmonary & Sleep', label: 'Pulmonary & Sleep' }
  ];

  const filteredCalculators = calcData.allCalculators.filter(c => {
    if (selectedCategory === 'ALL') return true;
    return c.category === selectedCategory;
  });

  // Calculate live adjusted result for adjuster drawer
  const liveAdjustedResult = useMemo(() => {
    const adjBmi = Number((adjWeight / Math.pow(adjHeight / 100, 2)).toFixed(1));
    const liveEgfr = calculateEGFR({
      age: adjAge,
      gender: adjGender,
      creatinine: adjCreatinine
    });

    const baselineScr = calcData.crcl.inputsUsed.find(i => i.key === 'scr')?.value as number;
    const baselineEgfr = calcData.prevent.inputsUsed.find(i => i.key === 'egfr')?.value as number;
    const effectiveEgfr = (baselineEgfr && adjCreatinine === baselineScr) ? baselineEgfr : liveEgfr.value;

    const preventParams = {
      age: adjAge,
      gender: adjGender,
      sbp: adjSbp,
      tc: adjTc,
      hdl: adjHdl,
      egfr: effectiveEgfr,
      bmi: adjBmi,
      isSmoker: adjSmoker,
      hasDiabetes: adjDiabetes,
      onBpMeds: adjBpMeds,
      onStatin: adjStatin
    };

    switch (activeAdjusterCalc) {
      case 'egfr':
        return liveEgfr;
      case 'fib4':
        return calculateFib4({
          age: adjAge,
          ast: adjAst,
          alt: adjAlt,
          platelets: adjPlatelets
        });
      case 'bri':
        return calculateBRI({
          heightCm: adjHeight,
          waistCm: adjWaist
        });
      case 'map':
        return calculateMAP({
          sbp: adjSbp,
          dbp: adjDbp
        });
      case 'crcl':
        return calculateCreatinineClearance({
          age: adjAge,
          weightKg: adjWeight,
          gender: adjGender,
          creatinine: adjCreatinine
        });
      case 'prevent':
      case 'prevent-cvd':
        return calculateAhaPreventCvd(preventParams);
      case 'prevent-ascvd':
        return calculateAhaPreventAscvd(preventParams);
      case 'prevent-hf':
        return calculateAhaPreventHf(preventParams);
      case 'stopbang':
        return calculateStopBang({
          age: adjAge,
          gender: adjGender,
          bmi: adjBmi,
          sbp: adjSbp,
          dbp: adjDbp,
          hasHypertensionHistory: adjBpMeds,
          snoring: adjSnoring,
          tired: adjTired,
          observedApnea: adjObserved
        });
      case 'homa':
        return calculateHomaIr({
          glucoseMgDl: adjGlucose,
          insulinUiuMl: adjInsulin
        });
      default:
        return calculateAhaPreventCvd(preventParams);
    }
  }, [
    activeAdjusterCalc,
    adjAge,
    adjGender,
    adjWeight,
    adjHeight,
    adjWaist,
    adjSbp,
    adjDbp,
    adjCreatinine,
    adjAst,
    adjAlt,
    adjPlatelets,
    adjGlucose,
    adjInsulin,
    adjTc,
    adjHdl,
    adjSmoker,
    adjDiabetes,
    adjBpMeds,
    adjStatin,
    adjSnoring,
    adjTired,
    adjObserved
  ]);

  // Overall risk summary counts
  const highRiskCount = calcData.allCalculators.filter(c => c.tier === 'High Risk' || c.tier === 'Critical / Urgent').length;
  const intermediateCount = calcData.allCalculators.filter(c => c.tier === 'Intermediate' || c.tier === 'Borderline').length;
  const optimalCount = calcData.allCalculators.filter(c => c.tier === 'Optimal' || c.tier === 'Low Risk').length;

  return (
    <section id="medical-calculators-panel" className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 mb-7">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
              <Calculator className="w-5 h-5 text-teal-700" />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Clinical Medical Calculators &amp; Evidence-Based Risk Scores
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-1">
                <span>MDCalc Aligned</span>
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-4xl">
            Automated clinical computation of <strong>eGFR</strong> (CKD-EPI 2021), <strong>FIB-4</strong> (Liver Fibrosis), <strong>BRI</strong> (Body Roundness), <strong>MAP</strong>, <strong>Creatinine Clearance</strong> (Cockcroft-Gault), <strong>AHA PREVENT™</strong> (Total CVD, ASCVD &amp; Heart Failure with both 10-Year &amp; Estimated 30-Year risks), <strong>STOP-BANG</strong> (Sleep Apnea), and <strong>HOMA-IR</strong> using laboratory extractions and physiologic vitals.
          </p>
        </div>

        {/* Action Button: Live Adjuster */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowLiveAdjuster(!showLiveAdjuster)}
            className={`inline-flex items-center text-xs font-bold px-3.5 py-2 rounded-xl border transition-all shadow-2xs ${
              showLiveAdjuster
                ? 'bg-teal-700 text-white border-teal-800 ring-2 ring-teal-600'
                : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 mr-1.5" />
            <span>{showLiveAdjuster ? 'Close Scenario Adjuster' : 'Adjust Inputs & Recalculate'}</span>
          </button>
        </div>
      </div>

      {/* Clinical Risk Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Optimal / Low Risk</p>
              <p className="text-sm font-black text-slate-800">{optimalCount} of {calcData.allCalculators.length} Calculators</p>
            </div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Borderline / Intermediate</p>
              <p className="text-sm font-black text-slate-800">{intermediateCount} of {calcData.allCalculators.length} Calculators</p>
            </div>
          </div>
          <AlertCircle className="w-5 h-5 text-amber-600" />
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Elevated / Follow-Up Focus</p>
              <p className="text-sm font-black text-slate-800">{highRiskCount} of {calcData.allCalculators.length} Calculators</p>
            </div>
          </div>
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-100">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Live Adjuster Drawer (when toggled) */}
      {showLiveAdjuster && (
        <div className="my-5 p-4 sm:p-5 rounded-2xl bg-teal-50/60 border border-teal-200 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-teal-200/80 gap-2">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-teal-800" />
              <h3 className="text-sm font-extrabold text-teal-950">
                Interactive Clinical Adjuster &amp; Scenario Simulator
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetAdjuster}
                className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center space-x-1 bg-white px-2.5 py-1 rounded-lg border border-teal-200 shadow-2xs hover:bg-teal-50 transition-colors"
                title="Reset all inputs back to this report's actual extracted patient values"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Record</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-2 mb-4">
            Test "what-if" clinical scenarios (e.g. what happens if blood pressure drops to 120/80, weight decreases by 5 kg, or fasting glucose normalizes). All MDCalc formulas recompute instantly in real-time.
          </p>

          {/* Calculator Selector Tabs for Adjuster */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 mb-4">
            {[
              { id: 'prevent', label: 'AHA Total CVD (10 & 30-Yr)' },
              { id: 'prevent-ascvd', label: 'AHA ASCVD (10 & 30-Yr)' },
              { id: 'prevent-hf', label: 'AHA Heart Failure (10 & 30-Yr)' },
              { id: 'egfr', label: 'eGFR (CKD-EPI)' },
              { id: 'fib4', label: 'FIB-4 (Liver Fibrosis)' },
              { id: 'bri', label: 'BRI (Body Roundness)' },
              { id: 'map', label: 'MAP (Mean Arterial)' },
              { id: 'crcl', label: 'CrCl (Cockcroft-Gault)' },
              { id: 'stopbang', label: 'STOP-BANG (Sleep Apnea)' },
              { id: 'homa', label: 'HOMA-IR (Insulin Res.)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveAdjusterCalc(tab.id)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                  activeAdjusterCalc === tab.id
                    ? 'bg-teal-800 text-white shadow-2xs'
                    : 'bg-white text-teal-900 border border-teal-200 hover:bg-teal-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Inputs Grid for Adjuster */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-3.5 rounded-xl bg-white border border-teal-100">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Age (yr)</label>
              <input
                type="number"
                value={adjAge}
                onChange={e => setAdjAge(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Sex</label>
              <select
                value={adjGender}
                onChange={e => setAdjGender(e.target.value as 'Male' | 'Female')}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                value={adjWeight}
                onChange={e => setAdjWeight(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Height (cm)</label>
              <input
                type="number"
                value={adjHeight}
                onChange={e => setAdjHeight(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Waist (cm)</label>
              <input
                type="number"
                value={adjWaist}
                onChange={e => setAdjWaist(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">BP Systolic</label>
              <input
                type="number"
                value={adjSbp}
                onChange={e => setAdjSbp(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">BP Diastolic</label>
              <input
                type="number"
                value={adjDbp}
                onChange={e => setAdjDbp(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Creatinine (mg/dL)</label>
              <input
                type="number"
                step="0.05"
                value={adjCreatinine}
                onChange={e => setAdjCreatinine(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">AST (U/L)</label>
              <input
                type="number"
                value={adjAst}
                onChange={e => setAdjAst(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">ALT (U/L)</label>
              <input
                type="number"
                value={adjAlt}
                onChange={e => setAdjAlt(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Platelets (k/µL)</label>
              <input
                type="number"
                value={adjPlatelets}
                onChange={e => setAdjPlatelets(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Fasting Glucose</label>
              <input
                type="number"
                value={adjGlucose}
                onChange={e => setAdjGlucose(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Insulin (µIU/mL)</label>
              <input
                type="number"
                step="0.5"
                value={adjInsulin}
                onChange={e => setAdjInsulin(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">Total Chol</label>
              <input
                type="number"
                value={adjTc}
                onChange={e => setAdjTc(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase">HDL Chol</label>
              <input
                type="number"
                value={adjHdl}
                onChange={e => setAdjHdl(Number(e.target.value))}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded p-1.5 mt-0.5"
              />
            </div>
            <div className="flex flex-col justify-end space-y-1">
              <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adjSmoker}
                  onChange={e => setAdjSmoker(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span className="text-[11px] font-medium">Smoker</span>
              </label>
              <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adjDiabetes}
                  onChange={e => setAdjDiabetes(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span className="text-[11px] font-medium">Diabetes</span>
              </label>
            </div>
            <div className="flex flex-col justify-end space-y-1">
              <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adjBpMeds}
                  onChange={e => setAdjBpMeds(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span className="text-[11px] font-medium">On BP Meds</span>
              </label>
              <label className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adjStatin}
                  onChange={e => setAdjStatin(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <span className="text-[11px] font-medium">On Statin</span>
              </label>
            </div>
          </div>

          {/* Live Recalculated Output Box */}
          <div className="mt-4 p-4 rounded-xl bg-white border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800">
                  Simulated Output: {liveAdjustedResult.name}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${liveAdjustedResult.tierColor.badge}`}>
                  {liveAdjustedResult.tier}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {liveAdjustedResult.plainExplanation}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-baseline justify-end space-x-1.5">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {liveAdjustedResult.displayValue}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {liveAdjustedResult.unit}
                </span>
              </div>
              {liveAdjustedResult.thirtyYearRiskPercent !== undefined && (
                <div className="text-right mt-1">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                    Est. 30-Yr Risk: <strong>{liveAdjustedResult.thirtyYearRiskPercent}%</strong> ({liveAdjustedResult.thirtyYearTier})
                  </span>
                </div>
              )}
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Ref: {liveAdjustedResult.referenceRangeText}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Medical Calculator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {filteredCalculators.map(calc => {
          const isExpanded = Boolean(expandedCards[calc.id]);
          const tierStyle = calc.tierColor;

          return (
            <div 
              key={calc.id} 
              className={`rounded-2xl border transition-all duration-200 bg-white flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-xs ${
                calc.tier === 'High Risk' || calc.tier === 'Critical / Urgent'
                  ? 'border-orange-300 ring-1 ring-orange-100'
                  : 'border-slate-200'
              }`}
            >
              <div className="p-4 sm:p-5">
                {/* Top Card Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="text-xs font-black text-slate-900">
                        {calc.acronym}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        &bull;
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {calc.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {calc.name}
                    </h3>
                  </div>

                  {/* Tier Badge & MDCalc Link */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border flex items-center space-x-1 ${tierStyle.badge}`}>
                      {calc.tier === 'Optimal' || calc.tier === 'Low Risk' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
                      ) : calc.tier === 'Intermediate' || calc.tier === 'Borderline' ? (
                        <AlertCircle className="w-3 h-3 text-amber-600 mr-1" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-orange-600 mr-1" />
                      )}
                      <span>{calc.tier}</span>
                    </span>

                    <a
                      href={calc.mdCalcUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[10px] font-semibold text-blue-600 hover:text-blue-800 hover:underline mt-0.5"
                      title="Open clinical reference and calculator formula on MDCalc.com"
                    >
                      <span>MDCalc</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </a>
                  </div>
                </div>

                {/* Score & Dual Time-Horizon Bar for 10-Yr and 30-Yr Horizons */}
                {calc.thirtyYearRiskPercent !== undefined ? (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                    {/* 10-Year Horizon Row */}
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            10-Year Predicted Risk
                          </span>
                          <div className="flex items-baseline space-x-1.5 mt-0.5">
                            <span className="text-2xl font-black text-slate-950 font-mono">
                              {calc.tenYearRiskPercent}%
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${tierStyle.badge}`}>
                              {calc.tier}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block font-mono">
                            {calc.referenceRangeText}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                        <div 
                          className={`h-full transition-all duration-500 ${tierStyle.barColor}`}
                          style={{ width: `${Math.min(100, Math.max(10, calc.scorePercent))}%` }}
                        />
                      </div>
                    </div>

                    {/* 30-Year Lifetime Horizon Row */}
                    <div className="pt-2.5 border-t border-slate-200/70">
                      <div className="flex items-baseline justify-between mb-1">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                            Estimated 30-Year Cumulative Risk
                          </span>
                          <div className="flex items-baseline space-x-1.5 mt-0.5">
                            <span className="text-2xl font-black text-indigo-950 font-mono">
                              {calc.thirtyYearRiskPercent}%
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${calc.thirtyYearTierColor?.badge || 'bg-indigo-100 text-indigo-800 border-indigo-200'}`}>
                              {calc.thirtyYearTier}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block font-mono">
                            {calc.thirtyYearReferenceRange || '30-Yr: < 20% (Low), 20-39% (Elevated), ≥ 40% (High)'}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                        <div 
                          className={`h-full transition-all duration-500 ${calc.thirtyYearTierColor?.barColor || 'bg-indigo-500'}`}
                          style={{ width: `${Math.min(100, Math.max(10, (calc.thirtyYearRiskPercent || 0) * 1.5))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                        <span>Low Lifetime (&lt;20%)</span>
                        <span>Elevated (20-39%)</span>
                        <span>High Lifetime (&ge;40%)</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                          Result from Record
                        </span>
                        <div className="flex items-baseline space-x-1.5 mt-0.5">
                          <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight font-mono">
                            {calc.displayValue}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">
                            {calc.unit}
                          </span>
                        </div>
                      </div>

                      <div className="text-right max-w-[50%]">
                        <span className="text-[10px] font-semibold text-slate-500 block leading-tight">
                          Target / Optimal
                        </span>
                        <span className="text-[11px] font-mono text-slate-700 font-semibold mt-0.5 block">
                          {calc.referenceRangeText}
                        </span>
                      </div>
                    </div>

                    {/* Relative Risk Level Visual Meter */}
                    <div className="mt-2.5">
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                        <div 
                          className={`h-full transition-all duration-500 ${tierStyle.barColor}`}
                          style={{ width: `${Math.min(100, Math.max(12, calc.scorePercent))}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-slate-600 mt-1 font-semibold">
                        <span>Optimal / Low</span>
                        <span>Moderate / Grey Zone</span>
                        <span>Elevated Risk</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Metrics Breakdown (if available, e.g. ASCVD & Heart Failure for PREVENT) */}
                {calc.subMetrics && calc.subMetrics.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {calc.subMetrics.map((sub, sIdx) => (
                      <div key={sIdx} className="p-2 rounded-lg bg-slate-50/80 border border-slate-200/60 text-xs">
                        <span className="text-[10px] text-slate-600 font-medium block truncate">
                          {sub.label}
                        </span>
                        <span className="font-bold text-slate-900 mt-0.5 block truncate">
                          {sub.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Patient Inputs Inserted from Record */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    <span>Values Inserted from Input:</span>
                    <span className="text-[9px] font-normal text-slate-600 lowercase">
                      {calc.inputsUsed.length} parameters evaluated
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {calc.inputsUsed.map((inp, iIdx) => (
                      <span 
                        key={iIdx}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-medium border flex items-center space-x-1 ${
                          inp.isEstimated 
                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title={`Source: ${inp.source}${inp.isEstimated ? ' (Estimated standard baseline)' : ''}`}
                      >
                        <span className="text-slate-500 font-sans">{inp.label}:</span>
                        <strong className="text-slate-900">{inp.value} {inp.unit || ''}</strong>
                        {inp.isEstimated && <span className="text-[9px] text-amber-600 font-sans">*est</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Plain-Language Explanation */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {calc.plainExplanation}
                  </p>
                </div>

                {/* Expandable Clinical Deep Dive */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-3 animate-in fade-in duration-200">
                    {/* Pathophysiology */}
                    <div className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-100 text-xs">
                      <span className="font-bold text-teal-900 text-[11px] block mb-0.5">
                        Clinical Mechanism &amp; Evidence:
                      </span>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        {calc.clinicalMechanism}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">
                        Formula: {calc.equationDescription}
                      </p>
                    </div>

                    {/* Bulleted Implications */}
                    <div className="text-xs">
                      <span className="font-bold text-slate-800 text-[11px] block mb-1">
                        Key Implications &amp; Action Steps:
                      </span>
                      <ul className="space-y-1 list-disc list-inside text-slate-600 text-[11px]">
                        {calc.clinicalImplications.map((imp, impIdx) => (
                          <li key={impIdx} className="leading-relaxed">
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Doctor Discussion Box with Copy Button */}
                    <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs">
                      <div className="flex items-center justify-between text-blue-900 font-bold text-[11px] mb-1">
                        <span>Suggested Question for Doctor:</span>
                        <button
                          onClick={() => handleCopy(calc.id, calc.doctorDiscussionQuestion)}
                          className="inline-flex items-center text-[10px] font-semibold text-blue-700 hover:text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs hover:bg-blue-50 transition-colors"
                          title="Copy this doctor question to clipboard"
                        >
                          {copiedId === calc.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600 mr-1" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-blue-600 mr-1" />
                              <span>Copy Question</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-blue-950 italic text-[11px] leading-relaxed">
                        "{calc.doctorDiscussionQuestion}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Footer Toggle */}
              <div className="bg-slate-50/80 px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleCard(calc.id)}
                  className="font-semibold text-slate-600 hover:text-teal-700 inline-flex items-center transition-colors"
                >
                  <span>{isExpanded ? 'Hide Clinical Details' : 'View Clinical Rationale & Discussion'}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 ml-1" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 ml-1" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveAdjusterCalc(
                      calc.id === 'calc-egfr' ? 'egfr' :
                      calc.id === 'calc-fib4' ? 'fib4' :
                      calc.id === 'calc-bri' ? 'bri' :
                      calc.id === 'calc-map' ? 'map' :
                      calc.id === 'calc-crcl' ? 'crcl' :
                      calc.id === 'calc-prevent' ? 'prevent' :
                      calc.id === 'calc-stopbang' ? 'stopbang' : 'homa'
                    );
                    setShowLiveAdjuster(true);
                    const elem = document.getElementById('medical-calculators-panel');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[11px] font-bold text-teal-700 hover:text-teal-900 inline-flex items-center space-x-1"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Adjust</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
