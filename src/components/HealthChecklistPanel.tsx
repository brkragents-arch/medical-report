import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  FileText, 
  Pill, 
  Activity, 
  CalendarClock,
  ShieldAlert,
  Info
} from 'lucide-react';
import { ChecklistItem } from '../types';

interface HealthChecklistPanelProps {
  initialChecklist: ChecklistItem[];
}

export const HealthChecklistPanel: React.FC<HealthChecklistPanelProps> = ({
  initialChecklist
}) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);

  const toggleItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklist.filter(c => c.completed).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documents':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'medications':
        return <Pill className="w-4 h-4 text-purple-500" />;
      case 'symptoms':
        return <Activity className="w-4 h-4 text-rose-500" />;
      default:
        return <CalendarClock className="w-4 h-4 text-teal-500" />;
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Personal Appointment Preparation Checklist
            </h2>
            <span className="text-xs bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-full border border-teal-200">
              {completedCount} of {checklist.length} ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Practical preparation steps before walking into your doctor's consultation.
          </p>
        </div>

        {/* Essential Safety Guardrail */}
        <div className="inline-flex items-center px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
          <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-amber-600 shrink-0" />
          <span>Never discontinue or adjust prescription medicines without clinician consultation.</span>
        </div>
      </div>

      {/* Checklist Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4">
        {checklist.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
              item.completed
                ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 text-slate-700'
            }`}
          >
            {/* Interactive Checkbox */}
            <div className="mt-0.5 shrink-0">
              {item.completed ? (
                <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
              ) : (
                <Square className="w-5 h-5 text-slate-300 hover:text-slate-500" />
              )}
            </div>

            {/* Task Info */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-1.5">
                {getCategoryIcon(item.category)}
                <span className={`text-xs font-bold ${item.completed ? 'text-emerald-900' : 'text-slate-900'}`}>
                  {item.task}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.details}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Guidance footer */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center">
          <Info className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Tip: Completed checklist items will automatically format into your printable Doctor Discussion Sheet.
        </span>
      </div>
    </section>
  );
};
