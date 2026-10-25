import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceArea, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calendar, 
  Info, 
  ChevronRight, 
  Layers, 
  Activity,
  History
} from 'lucide-react';
import { LabReport, LabTest } from '../types';

interface TrendAnalysisDashboardProps {
  report: LabReport;
  onSelectTestModal?: (testId: string) => void;
}

export const TrendAnalysisDashboard: React.FC<TrendAnalysisDashboardProps> = ({
  report,
  onSelectTestModal
}) => {
  // Find all tests that have historical trend data
  const trendableTests = report.tests.filter(t => t.history && t.history.length > 1);

  const [selectedTestId, setSelectedTestId] = useState<string>(
    trendableTests.length > 0 ? trendableTests[0].id : ''
  );

  const activeTest = trendableTests.find(t => t.id === selectedTestId) || trendableTests[0];

  if (!activeTest || trendableTests.length === 0) {
    return (
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Trend & Longitudinal Analysis
          </h2>
        </div>
        <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200/80">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 text-sm">
            Trend analysis will become available when previous reports are added.
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Currently displaying data for single collection date ({report.collectionDate}). Uploading past reports enables automatic longitudinal tracking and reference range trajectories.
          </p>
        </div>
      </section>
    );
  }

  // Calculate trends for active test
  const history = activeTest.history || [];
  const previousPoint = history[history.length - 2];
  const currentPoint = history[history.length - 1];

  const prevVal = previousPoint ? previousPoint.value : (typeof activeTest.previousValue === 'number' ? activeTest.previousValue : 0);
  const currVal = typeof activeTest.value === 'number' ? activeTest.value : currentPoint.value;

  const absoluteDiff = Number((currVal - prevVal).toFixed(2));
  const percentChange = prevVal !== 0 ? Number(((absoluteDiff / prevVal) * 100).toFixed(1)) : 0;

  const getDirection = () => {
    if (Math.abs(percentChange) < 3.0) return 'Relatively Stable';
    if (absoluteDiff > 0) return 'Increased';
    return 'Decreased';
  };

  const direction = getDirection();

  const getAIExplanation = () => {
    if (activeTest.id.includes('glu') || activeTest.id.includes('a1c')) {
      if (direction === 'Increased') {
        return `Fasting glucose and HbA1c have tracked upward across recent testing intervals (+${percentChange}%), shifting from high-normal into the prediabetes bracket. This underscores the value of proactive lifestyle adjustments before progression.`;
      }
      return `Glycemic levels have shown gradual improvement (-${Math.abs(percentChange)}%), showing positive response to recent interventions. Continued monitoring recommended.`;
    }

    if (activeTest.id.includes('hb')) {
      return `Hemoglobin has experienced a mild gradual decrease (-${Math.abs(percentChange)}%) from earlier in the year, corresponding with slightly lower MCV (red cell volume) and low ferritin stores. Indicates early depleted iron stores.`;
    }

    if (activeTest.id.includes('vit-d')) {
      return `Vitamin D stores have declined from insufficient into the deficient category (${currVal} ${activeTest.unit}), a common occurrence following seasons with reduced natural sunlight exposure. Oral D3 supplementation can readily replenish stores.`;
    }

    if (activeTest.id.includes('egfr')) {
      return `eGFR filtration has decreased from baseline (${prevVal} to ${currVal} mL/min/1.73m²). In the context of diabetes, prompt discussion of renal-protective medications is recommended with your physician.`;
    }

    return `This parameter has ${direction.toLowerCase()} by ${Math.abs(absoluteDiff)} ${activeTest.unit} (${Math.abs(percentChange)}%) compared to previous records. Discuss this trajectory with your physician during appointment preparation.`;
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-8">
      {/* Header & Test Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Trend & Longitudinal Analysis
            </h2>
            <span className="text-xs bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-full border border-teal-200">
              {trendableTests.length} multi-date markers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare previous laboratory draws to evaluate biological trajectory and clinical progress.
          </p>
        </div>

        {/* Dropdown test selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Select Test:</span>
          <select
            value={selectedTestId}
            onChange={(e) => setSelectedTestId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-800 focus:outline-hidden focus:border-teal-500 shadow-2xs"
          >
            {trendableTests.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.category.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Trend Overview Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
        {/* Left: Recharts Trend Chart */}
        <div className="lg:col-span-2 bg-slate-50/70 rounded-xl p-4 border border-slate-200/80">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 text-sm">{activeTest.name}</span>
              <span className="text-slate-500 ml-2 font-mono">({activeTest.unit})</span>
            </div>
            {activeTest.refRange.min !== undefined && activeTest.refRange.max !== undefined && (
              <span className="text-[11px] text-slate-500 font-medium">
                Ref Interval: <span className="text-emerald-700 font-bold">{activeTest.refRange.min} - {activeTest.refRange.max}</span>
              </span>
            )}
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  stroke="#cbd5e1" 
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  stroke="#cbd5e1"
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '8px', 
                    borderColor: '#cbd5e1', 
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                  formatter={(value: any) => [`${value} ${activeTest.unit}`, activeTest.name]}
                />
                {/* Reference Area showing standard normal interval */}
                {activeTest.refRange.min !== undefined && activeTest.refRange.max !== undefined && (
                  <ReferenceArea 
                    y1={activeTest.refRange.min} 
                    y2={activeTest.refRange.max} 
                    fill="#10b981" 
                    fillOpacity={0.12} 
                  />
                )}
                {/* Reference lines */}
                {activeTest.refRange.max !== undefined && (
                  <ReferenceLine 
                    y={activeTest.refRange.max} 
                    stroke="#059669" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Upper Limit', fill: '#059669', fontSize: 10, position: 'insideTopRight' }} 
                  />
                )}
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0d9488" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#0d9488', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#0f766e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-2">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
              <span>Reported Result</span>
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block ml-3" />
              <span>Standard Normal Range</span>
            </div>
            <span>Unit: {activeTest.unit}</span>
          </div>
        </div>

        {/* Right: Metrics & AI Longitudinal Explanation */}
        <div className="flex flex-col justify-between space-y-4">
          {/* Previous vs Current comparison card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Previous Draw</span>
                <span className="text-xs text-slate-600">{previousPoint?.date || activeTest.previousDate || 'Previous'}</span>
                <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                  {prevVal} <span className="text-xs font-normal text-slate-500">{activeTest.unit}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Current Draw</span>
                <span className="text-xs text-slate-600">{currentPoint?.date || report.reportDate}</span>
                <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  {currVal} <span className="text-xs font-normal text-slate-500">{activeTest.unit}</span>
                </p>
              </div>
            </div>

            {/* Change metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Absolute Change</span>
                <span className={`font-mono font-bold text-sm ${
                  absoluteDiff > 0 ? 'text-amber-800' : absoluteDiff < 0 ? 'text-teal-800' : 'text-slate-700'
                }`}>
                  {absoluteDiff > 0 ? `+${absoluteDiff}` : absoluteDiff} {activeTest.unit}
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Percentage Change</span>
                <span className={`font-mono font-bold text-sm flex items-center ${
                  percentChange > 0 ? 'text-amber-800' : percentChange < 0 ? 'text-teal-800' : 'text-slate-700'
                }`}>
                  {percentChange > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  ) : percentChange < 0 ? (
                    <TrendingDown className="w-3.5 h-3.5 mr-1 text-teal-600" />
                  ) : (
                    <Minus className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  )}
                  {percentChange > 0 ? `+${percentChange}%` : `${percentChange}%`}
                </span>
              </div>
            </div>

            {/* Trajectory pill */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">Trajectory:</span>
              <span className="font-semibold text-slate-800 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                {direction}
              </span>
            </div>
          </div>

          {/* AI Trend Interpretation */}
          <div className="bg-teal-50/70 rounded-xl p-4 border border-teal-200/80 text-xs">
            <h4 className="font-bold text-teal-900 mb-1 flex items-center">
              <Info className="w-4 h-4 text-teal-600 mr-1.5 shrink-0" />
              AI Longitudinal Interpretation
            </h4>
            <p className="text-slate-700 leading-relaxed">
              {getAIExplanation()}
            </p>
          </div>

          {/* Action to view details */}
          {onSelectTestModal && (
            <button
              onClick={() => onSelectTestModal(activeTest.id)}
              className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-teal-700 transition-colors flex items-center justify-center space-x-1 shadow-2xs"
            >
              <span>View Full Clinical Context for {activeTest.name}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
