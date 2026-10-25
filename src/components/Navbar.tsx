import React, { useState } from 'react';
import { 
  Activity, 
  FileText, 
  TrendingUp, 
  Printer, 
  ShieldCheck, 
  ChevronDown, 
  Eye, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  Upload,
  Sparkles 
} from 'lucide-react';
import { LabReport, PatientProfile } from '../types';

interface NavbarProps {
  currentReport: LabReport;
  selectedPatientId: string;
  patientList: PatientProfile[];
  onSelectPatient: (patientId: string) => void;
  onOpenOriginalReport: () => void;
  onOpenCompare: () => void;
  onOpenDoctorSheet: () => void;
  onOpenAddReport: () => void;
  onOpenUploadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentReport,
  selectedPatientId,
  patientList,
  onSelectPatient,
  onOpenOriginalReport,
  onOpenCompare,
  onOpenDoctorSheet,
  onOpenAddReport,
  onOpenUploadModal,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPrivacyNote, setShowPrivacyNote] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs no-print w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand & Title (Clean, unclipped, responsive) */}
          <div className="flex items-center space-x-2.5 shrink-0 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-xs shadow-teal-500/20 ring-2 ring-teal-600/20 shrink-0">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl leading-none">
                  MediInsight <span className="text-teal-600 font-bold text-xs sm:text-sm px-1.5 py-0.5 bg-teal-50 border border-teal-200 rounded">AI</span>
                </span>
                <span className="text-[10px] sm:text-[11px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block leading-tight mt-0.5 truncate">
                Personal Health Overview &amp; Physician Guide
              </p>
            </div>
          </div>

          {/* Actions & Profile Dropdown (Never overflows container) */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors shadow-2xs"
              title={`Upload raw lab slip, JPEG image, or PDF document for ${currentReport.patient.fullName}`}
            >
              <Upload className="w-3.5 h-3.5 sm:mr-1 text-teal-600 shrink-0" />
              <span className="hidden md:inline">Upload Scan</span>
            </button>

            <button
              onClick={onOpenOriginalReport}
              className="inline-flex items-center px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
              title="Inspect raw laboratory documents with OCR data verification overlay"
            >
              <Eye className="w-3.5 h-3.5 sm:mr-1 text-teal-600 shrink-0" />
              <span className="hidden md:inline">Original Report</span>
            </button>

            <button
              onClick={onOpenCompare}
              className="inline-flex items-center px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
              title="Compare with past test dates and review historical trend trajectories"
            >
              <TrendingUp className="w-3.5 h-3.5 sm:mr-1 text-teal-600 shrink-0" />
              <span className="hidden lg:inline">Trends</span>
            </button>

            <button
              onClick={onOpenDoctorSheet}
              className="inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors shadow-2xs"
              title="Interactive checklist of personalized clinical questions for your physician"
            >
              <FileText className="w-3.5 h-3.5 sm:mr-1 text-teal-700 shrink-0" />
              <span className="hidden sm:inline">Doctor Sheet</span>
            </button>

            <button
              onClick={() => {
                const elem = document.getElementById('early-predictions-panel');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden lg:inline-flex items-center px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
              title="Jump to Early Predictive Risk Estimations & Biomarkers"
            >
              <Sparkles className="w-3.5 h-3.5 sm:mr-1 text-amber-600 shrink-0" />
              <span className="hidden xl:inline">Early Risks</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs inline-flex items-center"
              title="Print full dashboard summary"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600 sm:mr-1 shrink-0" />
              <span className="hidden xl:inline">Print</span>
            </button>

            <button
              onClick={onOpenAddReport}
              className="inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-xs"
              title="Add a new patient or parse custom laboratory report"
            >
              <UserPlus className="w-3.5 h-3.5 sm:mr-1 shrink-0" />
              <span className="hidden sm:inline">+ Add Report</span>
              <span className="sm:hidden">+ Add</span>
            </button>

            {/* Profile / Scenario Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-1 p-1 sm:p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                title="Switch patient scenario or privacy settings"
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {currentReport.patient.initials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-800">Switch Patient Profile</p>
                    <p className="text-[11px] text-slate-700">Explore pre-loaded clinical scenarios</p>
                  </div>

                  <div className="py-1 max-h-64 overflow-y-auto">
                    {patientList.map((pat) => (
                      <button
                        key={pat.id}
                        onClick={() => {
                          onSelectPatient(pat.id);
                          setShowProfileMenu(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 flex items-start space-x-2.5 transition-colors ${
                          selectedPatientId === pat.id ? 'bg-teal-50 text-teal-900 font-medium' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          selectedPatientId === pat.id ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {pat.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-900 truncate">{pat.fullName}</p>
                          <p className="text-[11px] text-slate-700 truncate">
                            Age {pat.age} &bull; {pat.gender} &bull; Blood: {pat.bloodGroup}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 px-3.5 py-1.5">
                    <button
                      onClick={() => {
                        onOpenAddReport();
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center text-xs text-teal-700 hover:text-teal-800 font-bold w-full py-1"
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                      + Add Custom Patient / Report
                    </button>
                  </div>

                  <div className="border-t border-slate-100 px-3.5 pt-2 pb-1">
                    <button
                      onClick={() => {
                        setShowPrivacyNote(true);
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center text-[11px] text-slate-700 hover:text-teal-700 font-medium w-full py-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
                      HIPAA &amp; Privacy Guarantee
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy modal */}
      {showPrivacyNote && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-3 text-teal-700 mb-3">
              <ShieldCheck className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Privacy &amp; Medical Data Protection</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              MediInsight AI processes laboratory reports strictly in local privacy sandbox memory. 
              No protected health information (PHI) is sold or utilized for third-party commercial profiling. 
              This portal does not substitute for a clinical consultation. Always share your complete report with your treating physician.
            </p>
            <div className="bg-slate-50 rounded-lg p-3 text-[11px] text-slate-600 space-y-1 mb-4 border border-slate-200">
              <p className="font-semibold text-slate-700">Patient Identifier:</p>
              <p>MRN: {currentReport.patient.mrn} &bull; DOB: {currentReport.patient.dob}</p>
              <p className="text-slate-500">Laboratory: {currentReport.labName}</p>
            </div>
            <button
              onClick={() => setShowPrivacyNote(false)}
              className="w-full py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
