import React from 'react';
import { 
  X, 
  Info, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Link2, 
  MessageSquare, 
  Calendar,
  Activity,
  ShieldCheck,
  TrendingUp,
  FileText
} from 'lucide-react';
import { LabTest, ResultStatus } from '../types';

interface TestDetailModalProps {
  test: LabTest | null;
  onClose: () => void;
  onSelectRelatedTest?: (testName: string) => void;
}

export const TestDetailModal: React.FC<TestDetailModalProps> = ({
  test,
  onClose,
  onSelectRelatedTest
}) => {
  if (!test) return null;

  // Visual Gauge Calculation for numeric tests
  const renderRangeGauge = () => {
    if (typeof test.value !== 'number' || !test.refRange.min || !test.refRange.max) {
      return null;
    }

    const min = test.refRange.min;
    const max = test.refRange.max;
    const val = test.value;

    // Calculate percentage position along a scale
    const span = max - min;
    const lowerBuffer = span * 0.4;
    const upperBuffer = span * 0.4;
    const scaleMin = min - lowerBuffer;
    const scaleMax = max + upperBuffer;
    const clampedVal = Math.max(scaleMin, Math.min(scaleMax, val));
    const percent = ((clampedVal - scaleMin) / (scaleMax - scaleMin)) * 100;

    return (
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-slate-700">Laboratory Range Visualization</span>
          <span className="font-mono text-xs text-slate-500">
            Reference Range: <span className="font-bold text-slate-800">{min} - {max} {test.unit}</span>
          </span>
        </div>

        {/* Multi-colored range track */}
        <div className="relative h-4 rounded-full overflow-hidden bg-slate-200 flex">
          {/* Below range band */}
          <div className="h-full bg-amber-200/90" style={{ width: '25%' }} title="Below Normal Range" />
          {/* Normal range band */}
          <div className="h-full bg-emerald-400" style={{ width: '50%' }} title="Standard Reference Interval" />
          {/* Above range band */}
          <div className="h-full bg-amber-200/90" style={{ width: '25%' }} title="Above Normal Range" />
        </div>

        {/* Marker Indicator */}
        <div className="relative w-full h-6 mt-1">
          <div 
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
            style={{ left: `${Math.max(5, Math.min(95, percent))}%` }}
          >
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-900" />
            <span className="font-mono font-extrabold text-xs text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-300 mt-0.5 whitespace-nowrap">
              You: {val} {test.unit}
            </span>
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
          <span>Low (&lt; {min})</span>
          <span className="font-semibold text-emerald-700">Normal Range ({min} - {max})</span>
          <span>High (&gt; {max})</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header & Close */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {test.category}
              </span>
              {test.isCalculated && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Calculated Value
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {test.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Reported Value Banner */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs text-slate-500 block">Reported Patient Value</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {test.value}
              </span>
              <span className="text-sm font-semibold text-slate-600">
                {test.unit}
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 block">Laboratory Reference</span>
            <span className="font-mono font-semibold text-slate-800 text-sm">
              {test.refRange.text}
            </span>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                test.status === 'Normal' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                Status: {test.status}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Gauge */}
        {renderRangeGauge()}

        {/* Section 1: What It Measures & 5th-Grade Explanation */}
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="bg-teal-50/60 rounded-xl p-4 border border-teal-100">
            <h4 className="font-bold text-teal-900 text-xs mb-1.5 flex items-center">
              <Info className="w-4 h-4 text-teal-600 mr-1.5" />
              What this test measures in simple terms
            </h4>
            <p className="text-teal-950 font-medium mb-1">
              {test.whatItMeasures}
            </p>
            <p className="text-slate-600">
              {test.plainMeaning}
            </p>
          </div>

          {/* Section 2: Established Facts vs Possible Causes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Clinical Significance */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <h4 className="font-bold text-slate-800 mb-1 flex items-center">
                <Activity className="w-3.5 h-3.5 text-teal-600 mr-1.5" />
                Why this result matters
              </h4>
              <p className="text-slate-600">
                {test.whyItMatters}
              </p>
            </div>

            {/* Common Possible Causes (Labeled as possibilities, NOT confirmed diagnoses) */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <h4 className="font-bold text-slate-800 mb-1 flex items-center">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
                Common possible factors (Not a diagnosis)
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {test.commonCauses.map((cause, idx) => (
                  <li key={idx} className="leading-snug">{cause}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Influencing Factors & Related Tests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Influencing Lifestyle Factors */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <h4 className="font-bold text-slate-800 mb-1">
                Influencing factors to keep in mind:
              </h4>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                {test.influencingFactors.map((factor, idx) => (
                  <li key={idx} className="leading-snug">{factor}</li>
                ))}
              </ul>
            </div>

            {/* Related Tests */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
              <h4 className="font-bold text-slate-800 mb-1.5 flex items-center">
                <Link2 className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
                Clinically related tests in this panel:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {test.relatedTests.map((rel, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded bg-white text-slate-700 font-medium border border-slate-200 text-[11px]"
                  >
                    {rel}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Clinical Follow-up Advice & Question for Doctor */}
          <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/80">
            <h4 className="font-bold text-amber-900 text-xs mb-1">
              Recommended Clinical Follow-Up:
            </h4>
            <p className="text-amber-950 mb-3">
              {test.clinicalFollowUp}
            </p>

            <div className="bg-white rounded-lg p-3 border border-amber-200">
              <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wide flex items-center mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-teal-600 mr-1.5" />
                Personalized Question to Ask Your Doctor:
              </p>
              <p className="text-xs font-semibold text-slate-800 italic">
                "{test.doctorQuestion}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Source: Laboratory requisition analysis &bull; Verification complete
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition-colors shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
