import React, { useState } from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  ChevronRight, 
  ExternalLink, 
  ArrowUpRight, 
  ShieldAlert,
  Info,
  Filter
} from 'lucide-react';
import { KeyFinding, TestPriority } from '../types';

interface KeyFindingsPanelProps {
  findings: KeyFinding[];
  onSelectTest: (testId: string) => void;
}

export const KeyFindingsPanel: React.FC<KeyFindingsPanelProps> = ({
  findings,
  onSelectTest,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filteredFindings = findings.filter(f => {
    if (selectedFilter === 'ALL') return true;
    return f.priority === selectedFilter;
  });

  const getPriorityBadge = (priority: TestPriority) => {
    switch (priority) {
      case 'RED':
        return {
          bg: 'bg-red-500/10 text-red-700 border-red-300 ring-1 ring-red-400',
          icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
          label: 'RED — Potential Emergency'
        };
      case 'ORANGE':
        return {
          bg: 'bg-orange-500/10 text-orange-800 border-orange-300 ring-1 ring-orange-400',
          icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
          label: 'ORANGE — Prompt Medical Review'
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-500/10 text-amber-800 border-amber-300',
          icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
          label: 'YELLOW — Follow-Up Recommended'
        };
      case 'GREEN':
        return {
          bg: 'bg-emerald-500/10 text-emerald-800 border-emerald-300',
          icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
          label: 'GREEN — No Significant Abnormality'
        };
      case 'GRAY':
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: <HelpCircle className="w-4 h-4 text-slate-500" />,
          label: 'GRAY — Insufficient Information'
        };
    }
  };

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Key Clinical Findings & Attention Panel
            </h2>
            <span className="text-xs bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-full border border-teal-200">
              {findings.length} prioritized
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Findings organized by evidence-based clinical urgency rather than simple raw numerical deviations.
          </p>
        </div>

        {/* Priority Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              selectedFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All ({findings.length})
          </button>
          {findings.some(f => f.priority === 'ORANGE') && (
            <button
              onClick={() => setSelectedFilter('ORANGE')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedFilter === 'ORANGE'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100/70'
              }`}
            >
              Prompt Review
            </button>
          )}
          {findings.some(f => f.priority === 'YELLOW') && (
            <button
              onClick={() => setSelectedFilter('YELLOW')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedFilter === 'YELLOW'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100/70'
              }`}
            >
              Follow-Up ({findings.filter(f => f.priority === 'YELLOW').length})
            </button>
          )}
          {findings.some(f => f.priority === 'GREEN') && (
            <button
              onClick={() => setSelectedFilter('GREEN')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                selectedFilter === 'GREEN'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/70'
              }`}
            >
              Normal Screen
            </button>
          )}
        </div>
      </div>

      {/* Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFindings.map((finding) => {
          const badge = getPriorityBadge(finding.priority);

          return (
            <div
              key={finding.id}
              className={`rounded-2xl border p-5 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between ${
                finding.priority === 'RED'
                  ? 'bg-red-50/40 border-red-200/90'
                  : finding.priority === 'ORANGE'
                  ? 'bg-orange-50/40 border-orange-200/90'
                  : finding.priority === 'YELLOW'
                  ? 'bg-amber-50/30 border-amber-200/80'
                  : 'bg-white border-slate-200/90'
              }`}
            >
              <div>
                {/* Priority Banner & Category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${badge.bg}`}>
                    {badge.icon}
                    <span className="ml-1.5">{badge.label}</span>
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 truncate max-w-[170px]">
                    {finding.category}
                  </span>
                </div>

                {/* Test Name & Reported Result */}
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {finding.testName}
                  </h3>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {finding.reportedResult}
                    </span>
                  </div>
                </div>

                {/* Reference Range info */}
                <div className="text-[11px] text-slate-500 mb-3 flex items-center space-x-1">
                  <span>Lab Reference:</span>
                  <span className="font-medium text-slate-700">{finding.refRange}</span>
                </div>

                {/* Plain-Language 5th-Grade Explanation */}
                <div className="bg-white/80 rounded-xl p-3 border border-slate-200/80 mb-3 text-xs">
                  <p className="font-semibold text-slate-700 text-[11px] mb-1 flex items-center">
                    <Info className="w-3.5 h-3.5 text-teal-600 mr-1.5 shrink-0" />
                    What this means in simple language:
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    {finding.plainLanguageExplanation}
                  </p>
                </div>

                {/* Why it may matter */}
                <div className="text-xs text-slate-600 mb-3">
                  <span className="font-semibold text-slate-800">Why it matters: </span>
                  <span>{finding.whyItMatters}</span>
                </div>

                {/* Recommended discussion / follow-up */}
                <div className="text-xs text-teal-900 bg-teal-50/70 rounded-lg p-2.5 border border-teal-100 mb-3">
                  <span className="font-semibold text-teal-800">Suggested Follow-Up: </span>
                  <span>{finding.recommendedFollowUp}</span>
                </div>
              </div>

              {/* Action Button: Jump to full test details */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Status: <span className="font-semibold text-slate-700">{finding.status}</span>
                </span>
                <button
                  onClick={() => onSelectTest(finding.testId)}
                  className="inline-flex items-center text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors group"
                >
                  <span>Detailed Clinical Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
