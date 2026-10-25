import React from 'react';
import { 
  Droplet, 
  Activity, 
  Heart, 
  Dna, 
  Stethoscope, 
  FlaskConical, 
  Sun, 
  Zap, 
  Flame, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { LabTest, MedicalCategory, TestPriority } from '../types';

interface CategoryCardsGridProps {
  tests: LabTest[];
  selectedCategory: string | null;
  onSelectCategory: (category: MedicalCategory | null) => void;
}

export const CategoryCardsGrid: React.FC<CategoryCardsGridProps> = ({
  tests,
  selectedCategory,
  onSelectCategory,
}) => {
  // Extract all categories present in the report
  const categoryMap = tests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<MedicalCategory, LabTest[]>);

  const getCategoryIcon = (category: MedicalCategory) => {
    switch (category) {
      case 'Complete Blood Count (CBC)':
        return <Droplet className="w-5 h-5 text-rose-500" />;
      case 'Blood Sugar & Diabetes Screening':
        return <Activity className="w-5 h-5 text-amber-500" />;
      case 'Lipid Profile & Cholesterol':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'Kidney Function':
        return <FlaskConical className="w-5 h-5 text-blue-500" />;
      case 'Liver Function':
        return <Layers className="w-5 h-5 text-emerald-500" />;
      case 'Complete Urine Examination (CUE)':
        return <Droplet className="w-5 h-5 text-yellow-500" />;
      case 'Thyroid Function':
        return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'Vitamins & Nutritional Markers':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'Electrolytes & Minerals':
        return <Zap className="w-5 h-5 text-indigo-500" />;
      case 'Inflammatory Markers':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Cardiac & Coagulation Markers':
        return <Heart className="w-5 h-5 text-pink-500" />;
      default:
        return <Stethoscope className="w-5 h-5 text-teal-500" />;
    }
  };

  const getHighestPriority = (categoryTests: LabTest[]): TestPriority => {
    if (categoryTests.some(t => t.priority === 'RED')) return 'RED';
    if (categoryTests.some(t => t.priority === 'ORANGE')) return 'ORANGE';
    if (categoryTests.some(t => t.priority === 'YELLOW')) return 'YELLOW';
    if (categoryTests.some(t => t.priority === 'GRAY')) return 'GRAY';
    return 'GREEN';
  };

  const getPriorityBadge = (priority: TestPriority) => {
    switch (priority) {
      case 'RED':
        return { label: 'Urgent', bg: 'bg-red-50 text-red-700 border-red-200' };
      case 'ORANGE':
        return { label: 'Prompt Review', bg: 'bg-orange-50 text-orange-700 border-orange-200' };
      case 'YELLOW':
        return { label: 'Follow-Up', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'GREEN':
        return { label: 'Normal', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'Pending', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const categories = Object.keys(categoryMap) as MedicalCategory[];

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Health Test Categories
          </h2>
          <p className="text-xs text-slate-500">
            Click any category card to filter the comprehensive results table below.
          </p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline self-start sm:self-auto"
          >
            Clear Filter (Viewing: {selectedCategory})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {categories.map((category) => {
          const categoryTests = categoryMap[category];
          const abnormalCount = categoryTests.filter(t => t.status !== 'Normal' && t.status !== 'Unverified').length;
          const highestPriority = getHighestPriority(categoryTests);
          const priorityBadge = getPriorityBadge(highestPriority);
          const isSelected = selectedCategory === category;

          return (
            <div
              key={category}
              onClick={() => onSelectCategory(isSelected ? null : category)}
              className={`rounded-2xl border p-4 transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-teal-50/90 border-teal-500 ring-2 ring-teal-500/30 shadow-md'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Header: Icon & Priority Badge */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-2xs">
                    {getCategoryIcon(category)}
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${priorityBadge.bg}`}>
                    {priorityBadge.label}
                  </span>
                </div>

                {/* Category Title */}
                <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">
                  {category}
                </h3>

                {/* Test count & abnormal count */}
                <div className="flex items-center space-x-2 text-xs text-slate-600 mb-2.5">
                  <span>{categoryTests.length} tests</span>
                  <span>&bull;</span>
                  {abnormalCount > 0 ? (
                    <span className="font-medium text-amber-700">
                      {abnormalCount} flagged
                    </span>
                  ) : (
                    <span className="font-medium text-emerald-600 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1 inline" />
                      All normal
                    </span>
                  )}
                </div>

                {/* Test snippets preview */}
                <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 rounded-lg p-2 border border-slate-100">
                  {categoryTests.map(t => `${t.name} (${t.value} ${t.unit})`).join(' · ')}
                </div>
              </div>

              {/* Card Footer action */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-teal-700">
                  {isSelected ? 'Viewing in Table' : 'Filter in Table'}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 text-teal-600 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
