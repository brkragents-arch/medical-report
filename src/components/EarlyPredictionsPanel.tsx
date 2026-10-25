import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  ShieldAlert, 
  Flame, 
  Droplet, 
  FlaskConical, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  Info, 
  HelpCircle, 
  Layers, 
  Calculator, 
  ChevronRight,
  TrendingUp,
  Dna,
  ShieldCheck,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import { EarlyPredictionItem, LabReport, PredictionCategory } from '../types';
import { generateEarlyPredictions } from '../utils/predictionEngine';

interface EarlyPredictionsPanelProps {
  report: LabReport;
}

export const EarlyPredictionsPanel: React.FC<EarlyPredictionsPanelProps> = ({
  report
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showCalculator, setShowCalculator] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Custom Interactive Calculator State
  const [calcType, setCalcType] = useState<'homa' | 'lipid' | 'crcl' | 'metabolic'>('homa');
  const [calcGlucose, setCalcGlucose] = useState<number>(118);
  const [calcInsulin, setCalcInsulin] = useState<number>(12);
  const [calcTc, setCalcTc] = useState<number>(224);
  const [calcHdl, setCalcHdl] = useState<number>(43);
  const [calcTgl, setCalcTgl] = useState<number>(195);
  const [calcCreat, setCalcCreat] = useState<number>(0.95);
  const [calcAge, setCalcAge] = useState<number>(report.patient.age || 48);
  const [calcGender, setCalcGender] = useState<'Male' | 'Female'>(report.patient.gender === 'Female' ? 'Female' : 'Male');
  const [calcWeight, setCalcWeight] = useState<number>(report.patient.vitals?.weightKg || 75);
  const [calcWaist, setCalcWaist] = useState<number>(report.patient.vitals?.waistCircumferenceCm || 88);
  const [calcBpSys, setCalcBpSys] = useState<number>(report.patient.vitals?.bpSystolic || 124);
  const [calcBpDia, setCalcBpDia] = useState<number>(report.patient.vitals?.bpDiastolic || 82);

  // Compute live early predictions
  const predictions: EarlyPredictionItem[] = report.earlyPredictions && report.earlyPredictions.length > 0
    ? report.earlyPredictions
    : generateEarlyPredictions(report);

  const categories = Array.from(new Set(predictions.map(p => p.category)));

  const filteredPredictions = predictions.filter(item => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const handleCopyQuestion = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculator calculations
  const calculatedHoma = Number(((calcGlucose * calcInsulin) / 405).toFixed(2));
  const calculatedTcHdl = calcHdl > 0 ? Number((calcTc / calcHdl).toFixed(2)) : 0;
  const calculatedTglHdl = calcHdl > 0 ? Number((calcTgl / calcHdl).toFixed(2)) : 0;
  const crclGenderFactor = calcGender === 'Female' ? 0.85 : 1.0;
  const calculatedCrcl = calcCreat > 0 ? Math.round((((140 - calcAge) * calcWeight) / (72 * calcCreat)) * crclGenderFactor) : 0;

  const simAbdominal = calcWaist >= (calcGender === 'Female' ? 88 : 102);
  const simBp = calcBpSys >= 130 || calcBpDia >= 85;
  const simGlu = calcGlucose >= 100;
  const simTgl = calcTgl >= 150;
  const simHdl = calcHdl < (calcGender === 'Female' ? 50 : 40);
  const simCriteriaCount = [simAbdominal, simBp, simGlu, simTgl, simHdl].filter(Boolean).length;

  const getTierBadge = (tier: EarlyPredictionItem['riskTier']) => {
    switch (tier) {
      case 'Elevated Risk':
        return {
          bg: 'bg-orange-50 text-orange-800 border-orange-200',
          barColor: 'bg-orange-500',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
        };
      case 'Moderate / Early Warning':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          barColor: 'bg-amber-500',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
        };
      case 'Surveillance Stable':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          barColor: 'bg-blue-500',
          icon: <Info className="w-3.5 h-3.5 text-blue-600" />
        };
      case 'Optimal / Low Risk':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          barColor: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        };
    }
  };

  const getCategoryIcon = (category: PredictionCategory) => {
    switch (category) {
      case 'Cardiovascular & Arterial Plaque':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'Insulin Resistance & Pancreatic Load':
        return <Activity className="w-4 h-4 text-amber-500" />;
      case 'Early Renal Function Decline':
        return <FlaskConical className="w-4 h-4 text-blue-500" />;
      case 'Oxidative Stress & Liver Iron Load':
        return <Droplet className="w-4 h-4 text-purple-500" />;
      case 'Cerebrovascular & Endothelial Injury':
        return <Zap className="w-4 h-4 text-indigo-500" />;
      case 'Cancer Biomarkers & Cellular Turnover':
        return <Dna className="w-4 h-4 text-pink-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-8" id="early-predictions-panel">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Early Biomarker Risk Predictions &amp; Advanced Preventive Analytics
              </h2>
              <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 ml-2">
                Predictive Biomarkers &bull; Not a Medical Diagnosis
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multivariate evidence-based indicators estimating early coronary plaque risk, arterial inflammation, insulin resistance (HOMA-IR), early renal decline, and oncological cell turnover surveillance.
          </p>
        </div>

        {/* Action: Open Interactive Calculator */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors shadow-2xs"
          >
            <Calculator className="w-3.5 h-3.5 mr-1 text-teal-600" />
            <span>{showCalculator ? 'Hide Biomarker Calculator' : 'Biomarker Calculator'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Calculator Drawer */}
      {showCalculator && (
        <div className="mt-4 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
            <span className="font-bold text-slate-900 flex items-center">
              <Calculator className="w-4 h-4 text-teal-600 mr-1.5" />
              Interactive Biomarker Simulator &amp; Ratio Estimator
            </span>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setCalcType('homa')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${calcType === 'homa' ? 'bg-teal-600 text-white' : 'bg-white border text-slate-600'}`}
              >
                HOMA-IR (Insulin)
              </button>
              <button
                onClick={() => setCalcType('lipid')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${calcType === 'lipid' ? 'bg-teal-600 text-white' : 'bg-white border text-slate-600'}`}
              >
                Atherogenic Ratios
              </button>
              <button
                onClick={() => setCalcType('crcl')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${calcType === 'crcl' ? 'bg-teal-600 text-white' : 'bg-white border text-slate-600'}`}
              >
                CrCl (Weight-Adjusted)
              </button>
              <button
                onClick={() => setCalcType('metabolic')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${calcType === 'metabolic' ? 'bg-teal-600 text-white' : 'bg-white border text-slate-600'}`}
              >
                Metabolic Syndrome (ATP III)
              </button>
            </div>
          </div>

          {/* Calculator Inputs */}
          {calcType === 'homa' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Fasting Glucose (mg/dL)</label>
                <input
                  type="number"
                  value={calcGlucose}
                  onChange={e => setCalcGlucose(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Fasting Insulin (uIU/mL)</label>
                <input
                  type="number"
                  value={calcInsulin}
                  onChange={e => setCalcInsulin(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div className="bg-white p-3 rounded-lg border border-teal-200">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Estimated HOMA-IR:</span>
                <span className={`text-xl font-black font-mono ${calculatedHoma > 2.0 ? 'text-orange-600' : calculatedHoma > 1.0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {calculatedHoma}
                </span>
                <span className="text-[10px] text-slate-500 ml-2">
                  {calculatedHoma > 2.0 ? '(Elevated Insulin Resistance)' : calculatedHoma > 1.0 ? '(Early Metabolic Strain)' : '(Optimal Sensitivity)'}
                </span>
              </div>
            </div>
          )}

          {calcType === 'lipid' && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Total Cholesterol</label>
                <input
                  type="number"
                  value={calcTc}
                  onChange={e => setCalcTc(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">HDL Cholesterol</label>
                <input
                  type="number"
                  value={calcHdl}
                  onChange={e => setCalcHdl(parseFloat(e.target.value) || 1)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Triglycerides</label>
                <input
                  type="number"
                  value={calcTgl}
                  onChange={e => setCalcTgl(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-teal-200">
                <p className="text-[11px] font-mono"><span className="font-bold">TC/HDL:</span> {calculatedTcHdl} {calculatedTcHdl > 4.5 ? '⚠️' : '✓'}</p>
                <p className="text-[11px] font-mono mt-0.5"><span className="font-bold">TGL/HDL:</span> {calculatedTglHdl} {calculatedTglHdl > 3.0 ? '⚠️ (sdLDL)' : '✓'}</p>
              </div>
            </div>
          )}

          {calcType === 'crcl' && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 items-center">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Creatinine</label>
                <input
                  type="number"
                  step="0.01"
                  value={calcCreat}
                  onChange={e => setCalcCreat(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={calcWeight}
                  onChange={e => setCalcWeight(parseFloat(e.target.value) || 50)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Age</label>
                <input
                  type="number"
                  value={calcAge}
                  onChange={e => setCalcAge(parseInt(e.target.value) || 30)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Gender</label>
                <select
                  value={calcGender}
                  onChange={e => setCalcGender(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-teal-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">CrCl (Cockcroft):</span>
                <span className="text-xl font-black font-mono text-teal-800">{calculatedCrcl}</span>
                <span className="text-[10px] text-slate-500 ml-1">mL/min</span>
              </div>
            </div>
          )}

          {calcType === 'metabolic' && (
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 items-center">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Waist (cm)</label>
                <input
                  type="number"
                  value={calcWaist}
                  onChange={e => setCalcWaist(parseFloat(e.target.value) || 70)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">BP Sys/Dia</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    value={calcBpSys}
                    onChange={e => setCalcBpSys(parseInt(e.target.value) || 120)}
                    className="w-1/2 bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                  />
                  <input
                    type="number"
                    value={calcBpDia}
                    onChange={e => setCalcBpDia(parseInt(e.target.value) || 80)}
                    className="w-1/2 bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Glucose</label>
                <input
                  type="number"
                  value={calcGlucose}
                  onChange={e => setCalcGlucose(parseFloat(e.target.value) || 90)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Triglycerides</label>
                <input
                  type="number"
                  value={calcTgl}
                  onChange={e => setCalcTgl(parseFloat(e.target.value) || 120)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">HDL</label>
                <input
                  type="number"
                  value={calcHdl}
                  onChange={e => setCalcHdl(parseFloat(e.target.value) || 45)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-teal-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Criteria Met:</span>
                <span className={`text-base font-black font-mono ${simCriteriaCount >= 3 ? 'text-orange-600' : 'text-emerald-600'}`}>
                  {simCriteriaCount} / 5
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {simCriteriaCount >= 3 ? 'Metabolic Syndrome' : 'Low / Incomplete'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-3 mb-4 text-xs">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
            selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Predictions ({predictions.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {getCategoryIcon(cat)}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Predictions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPredictions.map(item => {
          const badge = getTierBadge(item.riskTier);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header: Category, Icon & Risk Tier */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="flex items-center text-xs font-semibold text-slate-600 space-x-1.5">
                    {getCategoryIcon(item.category)}
                    <span>{item.category}</span>
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                    {badge.icon}
                    <span className="ml-1">{item.riskTier}</span>
                  </span>
                </div>

                {/* Prediction Title */}
                <h3 className="font-extrabold text-slate-900 text-base mb-2">
                  {item.name}
                </h3>

                {/* Calculated Score / Ratio Bar */}
                {item.calculatedRatioOrScore && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">
                        {item.calculatedRatioOrScore.label}:
                      </span>
                      <div className="font-mono font-black text-sm text-slate-900">
                        {item.calculatedRatioOrScore.value} {item.calculatedRatioOrScore.unit || ''}
                      </div>
                    </div>

                    {/* Progress / Risk Score Visual Meter */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${badge.barColor}`}
                        style={{ width: `${Math.min(100, Math.max(8, item.riskScorePercent))}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                      <span>Optimal: {item.calculatedRatioOrScore.optimalRange}</span>
                    </div>
                  </div>
                )}

                {/* Plain-Language 5th-Grade Explanation */}
                <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100 text-xs mb-3">
                  <p className="font-bold text-teal-900 text-[11px] mb-1 flex items-center">
                    <Info className="w-3.5 h-3.5 text-teal-600 mr-1.5" />
                    Simple Language Meaning:
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    {item.plainMeaning}
                  </p>
                </div>

                {/* Clinical Mechanism */}
                <div className="text-xs text-slate-600 mb-3">
                  <span className="font-bold text-slate-800">Biological Significance: </span>
                  <span>{item.clinicalMechanism}</span>
                </div>

                {/* Critical Medical Limitations / Benign Explanations */}
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs mb-3">
                  <p className="font-bold text-amber-900 text-[11px] mb-1 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700 mr-1.5" />
                    Important Caveats &amp; Non-Malignant Explanations:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
                    {item.importantCaveats.map((c, cIdx) => (
                      <li key={cIdx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Doctor Question */}
              <div className="pt-3 border-t border-slate-100 bg-slate-50/80 -mx-5 -mb-5 p-4 rounded-b-2xl">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block mb-0.5">
                      Recommended Question for Your Doctor:
                    </span>
                    <p className="text-xs italic text-slate-800">
                      "{item.doctorDiscussion}"
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyQuestion(item.id, item.doctorDiscussion)}
                    className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-white rounded transition-colors shrink-0"
                    title="Copy question for doctor appointment notes"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
