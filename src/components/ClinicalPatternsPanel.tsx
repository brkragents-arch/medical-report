import React, { useState } from 'react';
import { 
  Network, 
  HelpCircle, 
  MessageSquare, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { ClinicalPattern } from '../types';

interface ClinicalPatternsPanelProps {
  patterns: ClinicalPattern[];
  onSelectTest?: (testId: string) => void;
}

export const ClinicalPatternsPanel: React.FC<ClinicalPatternsPanelProps> = ({
  patterns,
  onSelectTest
}) => {
  if (!patterns || patterns.length === 0) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Network className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Possible Clinical Patterns
          </h2>
        </div>
        <div className="bg-slate-50 rounded-xl p-6 text-center border border-slate-200/80">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="font-semibold text-slate-800 text-sm">
            No Multisystem Clinical Patterns Identified
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Reviewed laboratory values do not demonstrate clustered syndromic patterns (such as combined glycemic dysregulation or renal markers).
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Possible Clinical Patterns & Findings Combinations
            </h2>
            <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
              {patterns.length} observations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluates how individual lab tests correlate together to help your doctor see the larger physiological picture.
          </p>
        </div>

        {/* Disclaimer Pill */}
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 text-slate-500" />
          Preliminary Observation &bull; Not a Diagnosis
        </span>
      </div>

      {/* Pattern Cards List */}
      <div className="space-y-4">
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow p-5 sm:p-6"
          >
            {/* Pattern Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    Multivariate Pattern
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {pattern.supportingTestIds.length} Correlated Tests
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {pattern.title}
                </h3>
              </div>

              {/* Supporting Results Badges */}
              <div className="flex flex-wrap gap-1.5 self-start sm:self-auto max-w-sm">
                {pattern.supportingResultsSummary.map((res, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-50 border border-slate-200 text-slate-800"
                  >
                    <span className="font-sans font-semibold text-slate-700 mr-1">{res.name}:</span>
                    <span className={res.status !== 'Normal' ? 'text-amber-800 font-bold' : 'text-slate-900'}>
                      {res.value}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Pattern Body Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 text-xs">
              {/* 1. Possible Meaning in Plain Language */}
              <div className="bg-teal-50/50 rounded-xl p-4 border border-teal-100/80 space-y-1.5">
                <p className="font-bold text-teal-900 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0" />
                  Possible Meaning in Plain Language:
                </p>
                <p className="text-slate-700 leading-relaxed">
                  {pattern.possibleMeaning}
                </p>
              </div>

              {/* 2. Important Alternative Explanations or Limitations */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-1.5">
                <p className="font-bold text-slate-800 flex items-center">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600 mr-1.5 shrink-0" />
                  Alternative Explanations & Limitations:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
                  {pattern.alternativeExplanations.map((alt, idx) => (
                    <li key={idx}>{alt}</li>
                  ))}
                </ul>
              </div>

              {/* 3. Recommended Questions for Doctor */}
              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/80 space-y-2 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-amber-900 flex items-center">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-700 mr-1.5 shrink-0" />
                    Doctor Discussion Points:
                  </p>
                  <ul className="space-y-1.5 mt-1.5">
                    {pattern.recommendedDoctorQuestions.map((q, idx) => (
                      <li key={idx} className="text-slate-800 italic bg-white p-2 rounded-lg border border-amber-200/80">
                        "{q}"
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Discuss these possibilities with your clinician to clarify the best next steps.
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
