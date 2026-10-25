import React from 'react';
import { 
  X, 
  Printer, 
  FileText, 
  CheckSquare, 
  Square, 
  Activity, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { LabReport } from '../types';

interface DoctorDiscussionPrintSheetProps {
  report: LabReport;
  onClose: () => void;
}

export const DoctorDiscussionPrintSheet: React.FC<DoctorDiscussionPrintSheetProps> = ({
  report,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-6 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls - Hidden when printing */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 no-print mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Physician Appointment Discussion Sheet Preview
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              <span>Print Sheet / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Document Content */}
        <div className="text-slate-900 text-xs font-sans leading-normal print:p-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex justify-between items-start">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                MediInsight AI — Doctor Discussion Sheet
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Prepared for Clinical Consultation & Appointment Preparation
              </p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-900">{report.patient.fullName}</p>
              <p className="text-slate-600">MRN: {report.patient.mrn} &bull; Age {report.patient.age} ({report.patient.gender})</p>
              <p className="text-slate-500">Report Date: {report.reportDate}</p>
            </div>
          </div>

          {/* Clinical Overview Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
              Summary of Significant Findings Requiring Review:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {report.keyFindings.map((f, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                    <span>{f.testName}</span>
                    <span className="font-mono text-teal-800">{f.reportedResult}</span>
                  </div>
                  <p className="text-[11px] text-slate-600">{f.whyItMatters}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Questions Section */}
          <div className="mb-6">
            <h3 className="font-black text-sm uppercase tracking-wide text-slate-900 border-b border-slate-200 pb-1.5 mb-3">
              Questions to Discuss with Physician:
            </h3>
            <div className="space-y-4">
              {report.doctorQuestions.map((q, idx) => (
                <div key={q.id} className="border-b border-dashed border-slate-200 pb-3">
                  <div className="flex items-start space-x-2">
                    <span className="w-4 h-4 border border-slate-400 rounded shrink-0 mt-0.5 inline-block" />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-xs">
                        {idx + 1}. "{q.question}"
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Context: {q.whyItMatters}
                      </p>
                      {/* Blank writing lines for physician notes */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Doctor's recommendation / Plan:</span>
                        <span className="italic">___________________________________________________________</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist reminder */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
              Patient Checklist & Reminders:
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {report.checklist.map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <span className={`w-3.5 h-3.5 border rounded flex items-center justify-center text-[10px] ${
                    item.completed ? 'bg-teal-600 border-teal-600 text-white font-bold' : 'border-slate-300'
                  }`}>
                    {item.completed ? '✓' : ''}
                  </span>
                  <span className="text-slate-700">{item.task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal / Medical Disclaimer Footer */}
          <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-500 leading-tight">
            <p className="font-semibold text-slate-700 mb-0.5">Medical Education & Appointment Preparation Notice:</p>
            <p>
              This discussion sheet is produced for personal educational preparation and appointment alignment. 
              MediInsight AI does not provide definitive medical diagnoses, prescribe drugs, or substitute for a clinical consultation with a licensed healthcare provider.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
