import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  History
} from 'lucide-react';
import { LabReport } from '../types';

interface ReportComparisonModalProps {
  report: LabReport;
  allPatientReports?: LabReport[];
  onClose: () => void;
  onSelectTest: (testId: string) => void;
}

export const ReportComparisonModal: React.FC<ReportComparisonModalProps> = ({
  report,
  allPatientReports,
  onClose,
  onSelectTest
}) => {
  const reportsList = allPatientReports && allPatientReports.length > 0 ? allPatientReports : [report];
  const [reportAId, setReportAId] = useState<string>(report.id);
  const [reportBId, setReportBId] = useState<string>(reportsList.length > 1 ? reportsList[1].id : report.id);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const reportA = reportsList.find(r => r.id === reportAId) || report;
  const reportB = reportsList.find(r => r.id === reportBId) || (reportsList.length > 1 ? reportsList[1] : report);

  // Match tests between reportA and reportB
  const matchedTests = reportA.tests.map(tA => {
    const foundB = reportB.tests.find(tB => tB.name.toLowerCase() === tA.name.toLowerCase());
    const prevNumeric = foundB 
      ? (typeof foundB.numericValue === 'number' ? foundB.numericValue : (typeof foundB.value === 'number' ? foundB.value : undefined))
      : tA.previousNumericValue;
    const prevDate = foundB ? reportB.reportDate : (tA.previousDate || 'Previous');

    return {
      ...tA,
      comparisonPreviousValue: foundB ? foundB.value : tA.previousValue,
      comparisonPreviousNumeric: prevNumeric,
      comparisonPreviousDate: prevDate
    };
  });

  const comparableTests = matchedTests.filter(t => t.comparisonPreviousValue !== undefined || t.previousValue !== undefined);

  const categories = Array.from(new Set(comparableTests.map(t => t.category)));

  const filteredTests = comparableTests.filter(t => {
    if (selectedCategory === 'ALL') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Longitudinal Report Comparison
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side comparative analysis between {reportB.reportDate} ({reportB.reportTitle || reportB.labName}) and {reportA.reportDate} ({reportA.reportTitle || reportA.labName}).
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Report Comparison Selectors */}
        {reportsList.length > 1 && (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Select Base Report (Current / Newer):
              </label>
              <select
                value={reportAId}
                onChange={e => setReportAId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-slate-900"
              >
                {reportsList.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.reportDate} — {r.reportTitle || r.labName} ({r.tests.length} tests)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Compare Against Historical Report (Past / Older):
              </label>
              <select
                value={reportBId}
                onChange={e => setReportBId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-slate-900"
              >
                {reportsList.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.reportDate} — {r.reportTitle || r.labName} ({r.tests.length} tests)
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-4 text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories ({comparableTests.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Comparative Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Laboratory Parameter</th>
                <th className="py-2.5 px-3 text-right">Past ({reportB.reportDate})</th>
                <th className="py-2.5 px-3 text-center">Change</th>
                <th className="py-2.5 px-3 text-right">Current ({reportA.reportDate})</th>
                <th className="py-2.5 px-3 text-center">Current Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTests.map((test) => {
                const prev = test.comparisonPreviousNumeric !== undefined 
                  ? test.comparisonPreviousNumeric 
                  : (typeof test.comparisonPreviousValue === 'number' ? test.comparisonPreviousValue : Number(test.previousValue));
                const curr = typeof test.numericValue === 'number' ? test.numericValue : Number(test.value);
                const diff = !isNaN(prev) && !isNaN(curr) ? Number((curr - prev).toFixed(2)) : null;
                const percent = diff !== null && prev !== 0 ? Number(((diff / prev) * 100).toFixed(1)) : null;

                return (
                  <tr key={test.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{test.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">Ref: {test.refRange.text}</span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      <span className="font-semibold">{test.comparisonPreviousValue ?? test.previousValue}</span> {test.unit}
                    </td>

                    <td className="py-3 px-3 text-center">
                      {diff !== null && percent !== null ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                          diff === 0 
                            ? 'bg-slate-100 text-slate-600' 
                            : diff > 0 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-teal-100 text-teal-800'
                        }`}>
                          {diff > 0 ? `+${diff}` : diff} ({diff > 0 ? `+${percent}%` : `${percent}%`})
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-mono">
                      <span className="font-bold text-slate-900">{test.value}</span> {test.unit}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        test.status === 'Normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {test.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          onSelectTest(test.id);
                          onClose();
                        }}
                        className="text-xs font-semibold text-teal-700 hover:underline"
                      >
                        Deep Dive
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Comparisons account for identical units and validated laboratory intervals.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-800 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
