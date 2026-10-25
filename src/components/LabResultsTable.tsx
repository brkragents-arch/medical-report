import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  ExternalLink, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { LabTest, MedicalCategory, ResultStatus, TestPriority } from '../types';

interface LabResultsTableProps {
  tests: LabTest[];
  selectedCategory: MedicalCategory | null;
  onClearCategory: () => void;
  onSelectTest: (testId: string) => void;
  metricStatusFilter?: string | null;
  onClearMetricFilter?: () => void;
}

export const LabResultsTable: React.FC<LabResultsTableProps> = ({
  tests,
  selectedCategory,
  onClearCategory,
  onSelectTest,
  metricStatusFilter,
  onClearMetricFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAbnormalOnly, setShowAbnormalOnly] = useState(false);
  const [sortField, setSortField] = useState<'name' | 'category' | 'status' | 'priority'>('category');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSort = (field: 'name' | 'category' | 'status' | 'priority') => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      // 1. Category filter
      if (selectedCategory && test.category !== selectedCategory) {
        return false;
      }

      // 2. Metric status filter (from PatientSummaryCard click)
      if (metricStatusFilter) {
        if (metricStatusFilter === 'Normal' && test.status !== 'Normal') return false;
        if (metricStatusFilter === 'Flagged' && (test.status === 'Normal' || test.status === 'Unverified')) return false;
        if (metricStatusFilter === 'Borderline' && test.status !== 'Borderline High' && test.status !== 'Borderline Low') return false;
      }

      // 3. Abnormal only toggle
      if (showAbnormalOnly && test.status === 'Normal') {
        return false;
      }

      // 4. Dropdown status filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'NORMAL' && test.status !== 'Normal') return false;
        if (statusFilter === 'HIGH' && !test.status.includes('High')) return false;
        if (statusFilter === 'LOW' && !test.status.includes('Low')) return false;
        if (statusFilter === 'BORDERLINE' && !test.status.includes('Borderline')) return false;
        if (statusFilter === 'UNVERIFIED' && test.status !== 'Unverified') return false;
      }

      // 5. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = test.name.toLowerCase().includes(query);
        const matchCategory = test.category.toLowerCase().includes(query);
        const matchMeaning = test.plainMeaning.toLowerCase().includes(query);
        const matchUnit = test.unit.toLowerCase().includes(query);
        if (!matchName && !matchCategory && !matchMeaning && !matchUnit) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      let result = 0;
      if (sortField === 'name') {
        result = a.name.localeCompare(b.name);
      } else if (sortField === 'category') {
        result = a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      } else if (sortField === 'status') {
        result = a.status.localeCompare(b.status);
      } else if (sortField === 'priority') {
        const priorityRank: Record<TestPriority, number> = {
          RED: 4,
          ORANGE: 3,
          YELLOW: 2,
          GRAY: 1,
          GREEN: 0
        };
        result = priorityRank[b.priority] - priorityRank[a.priority];
      }
      return sortDirection === 'asc' ? result : -result;
    });
  }, [tests, selectedCategory, metricStatusFilter, showAbnormalOnly, statusFilter, searchQuery, sortField, sortDirection]);

  // Status visual badge styling
  const renderStatusBadge = (status: ResultStatus) => {
    switch (status) {
      case 'Normal':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Normal
          </span>
        );
      case 'High':
      case 'Critical High':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3 mr-1 text-red-600" />
            {status}
          </span>
        );
      case 'Low':
      case 'Critical Low':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 mr-1 text-amber-600" />
            {status}
          </span>
        );
      case 'Borderline High':
      case 'Borderline Low':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <AlertTriangle className="w-3 h-3 mr-1 text-orange-500" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <HelpCircle className="w-3 h-3 mr-1 text-slate-500" />
            {status}
          </span>
        );
    }
  };

  // Priority indicator pill
  const renderPriorityPill = (priority: TestPriority) => {
    switch (priority) {
      case 'RED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">Urgent</span>;
      case 'ORANGE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-300">Prompt</span>;
      case 'YELLOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">Follow-Up</span>;
      case 'GREEN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">Routine</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">Review</span>;
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-8" id="laboratory-results-table">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Complete Laboratory Results
            </h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
              {filteredTests.length} shown
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Preserves original units, verified reference ranges, and calculates evidence-based clinical context.
          </p>
        </div>

        {/* Filter & Toggle Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search test name or category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Toggle All vs Abnormal */}
          <button
            onClick={() => setShowAbnormalOnly(!showAbnormalOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              showAbnormalOnly
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {showAbnormalOnly ? 'Showing Flagged Only' : 'Flagged Only'}
          </button>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NORMAL">Normal In-Range</option>
            <option value="HIGH">Elevated / High</option>
            <option value="LOW">Below Range / Low</option>
            <option value="BORDERLINE">Borderline</option>
          </select>
        </div>
      </div>

      {/* Active filters pill bar */}
      {(selectedCategory || metricStatusFilter || showAbnormalOnly || searchQuery) && (
        <div className="flex items-center flex-wrap gap-2 py-2.5 px-3 bg-slate-50 border-b border-slate-100 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Active Filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[11px] font-medium">
              Category: {selectedCategory}
              <button onClick={onClearCategory} className="ml-1.5 hover:text-red-600 font-bold">&times;</button>
            </span>
          )}
          {metricStatusFilter && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-medium">
              Metric: {metricStatusFilter}
              <button onClick={onClearMetricFilter} className="ml-1.5 hover:text-red-600 font-bold">&times;</button>
            </span>
          )}
          {showAbnormalOnly && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-medium">
              Flagged Only
              <button onClick={() => setShowAbnormalOnly(false)} className="ml-1.5 hover:text-red-600 font-bold">&times;</button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-200 text-slate-800 text-[11px] font-medium">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="ml-1.5 hover:text-red-600 font-bold">&times;</button>
            </span>
          )}
          <button
            onClick={() => {
              onClearCategory();
              if (onClearMetricFilter) onClearMetricFilter();
              setShowAbnormalOnly(false);
              setSearchQuery('');
              setStatusFilter('ALL');
            }}
            className="text-[11px] font-semibold text-teal-700 hover:underline ml-auto"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Results Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3 w-8"></th>
              <th 
                onClick={() => handleSort('name')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none"
              >
                <div className="flex items-center space-x-1">
                  <span>Test Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('category')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none hidden md:table-cell"
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-right">
                <span>Reported Result</span>
              </th>
              <th className="py-3 px-3 hidden lg:table-cell">
                <span>Reference Range</span>
              </th>
              <th 
                onClick={() => handleSort('status')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none text-center"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('priority')}
                className="py-3 px-3 cursor-pointer hover:text-slate-900 select-none text-center hidden sm:table-cell"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Priority</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3 text-right">
                <span>Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredTests.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600">No matching laboratory tests found</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting filters or adjusting search keywords.</p>
                </td>
              </tr>
            ) : (
              filteredTests.map((test) => {
                const isExpanded = !!expandedRows[test.id];

                return (
                  <React.Fragment key={test.id}>
                    <tr 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isExpanded ? 'bg-slate-50/60' : ''
                      } ${
                        test.status !== 'Normal' ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      {/* Expander toggle */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleRow(test.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          title="Expand for plain-language interpretation"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-teal-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Test Name */}
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => onSelectTest(test.id)}
                            className="hover:text-teal-700 transition-colors text-left"
                          >
                            {test.name}
                          </button>
                          {test.isCalculated && (
                            <span 
                              className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200"
                              title="Calculated mathematical value from raw laboratory parameters"
                            >
                              <Calculator className="w-2.5 h-2.5 mr-0.5" />
                              Calc
                            </span>
                          )}
                          {test.sourcePage && (
                            <span 
                              className="text-[10px] text-slate-400 font-mono hidden sm:inline"
                              title={`Source report page ${test.sourcePage}`}
                            >
                              p.{test.sourcePage}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-slate-500 hidden md:table-cell text-[11px]">
                        {test.category}
                      </td>

                      {/* Patient Result */}
                      <td className="py-3 px-3 text-right">
                        <span className={`font-mono font-bold text-sm ${
                          test.status === 'Normal' ? 'text-slate-900' : 'text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200'
                        }`}>
                          {test.value}
                        </span>
                        {test.unit && (
                          <span className="text-[11px] text-slate-500 ml-1 font-normal">
                            {test.unit}
                          </span>
                        )}
                      </td>

                      {/* Reference Range */}
                      <td className="py-3 px-3 text-slate-600 text-[11px] hidden lg:table-cell font-mono">
                        {test.refRange.text}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {renderStatusBadge(test.status)}
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3 text-center hidden sm:table-cell">
                        {renderPriorityPill(test.priority)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onSelectTest(test.id)}
                          className="inline-flex items-center text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/80 hover:bg-teal-100/70 transition-colors"
                        >
                          <span>Explain</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Row with Plain-Language Meaning & Doctor Question */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90 border-b border-slate-200">
                        <td colSpan={8} className="py-3 px-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs py-1">
                            {/* Simple Plain Meaning */}
                            <div className="space-y-1">
                              <p className="font-bold text-slate-700 flex items-center">
                                <Info className="w-3.5 h-3.5 text-teal-600 mr-1.5" />
                                What this measures:
                              </p>
                              <p className="text-slate-600 leading-relaxed">
                                {test.whatItMeasures}
                              </p>
                              <p className="text-[11px] text-slate-500 pt-1">
                                {test.plainMeaning}
                              </p>
                            </div>

                            {/* Why it matters & Causes */}
                            <div className="space-y-1">
                              <p className="font-bold text-slate-700">Clinical context:</p>
                              <p className="text-slate-600 leading-relaxed">
                                {test.whyItMatters}
                              </p>
                              {test.commonCauses.length > 0 && (
                                <p className="text-[11px] text-slate-500 pt-1">
                                  <span className="font-semibold text-slate-600">Possible influences: </span>
                                  {test.commonCauses.slice(0, 2).join('; ')}
                                </p>
                              )}
                            </div>

                            {/* Doctor Question */}
                            <div className="bg-white rounded-lg p-3 border border-slate-200 space-y-1 flex flex-col justify-between">
                              <div>
                                <p className="font-bold text-teal-800 text-[11px] uppercase tracking-wider">
                                  Question for your doctor:
                                </p>
                                <p className="text-slate-700 italic mt-0.5 text-xs">
                                  "{test.doctorQuestion}"
                                </p>
                              </div>
                              <div className="pt-2 flex items-center justify-between">
                                <span className="text-[10px] text-slate-400">
                                  Ref: {test.refRange.text}
                                </span>
                                <button
                                  onClick={() => onSelectTest(test.id)}
                                  className="text-xs font-semibold text-teal-700 hover:underline"
                                >
                                  Open Full Clinical Deep-Dive &rarr;
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
