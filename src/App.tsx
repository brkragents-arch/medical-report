import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PatientSummaryCard } from './components/PatientSummaryCard';
import { KeyFindingsPanel } from './components/KeyFindingsPanel';
import { CategoryCardsGrid } from './components/CategoryCardsGrid';
import { EarlyPredictionsPanel } from './components/EarlyPredictionsPanel';
import { LabResultsTable } from './components/LabResultsTable';
import { TestDetailModal } from './components/TestDetailModal';
import { TrendAnalysisDashboard } from './components/TrendAnalysisDashboard';
import { ClinicalPatternsPanel } from './components/ClinicalPatternsPanel';
import { DoctorDiscussionPanel } from './components/DoctorDiscussionPanel';
import { HealthChecklistPanel } from './components/HealthChecklistPanel';
import { RecommendedFollowUpPanel } from './components/RecommendedFollowUpPanel';
import { OriginalReportViewer } from './components/OriginalReportViewer';
import { DoctorDiscussionPrintSheet } from './components/DoctorDiscussionPrintSheet';
import { ReportComparisonModal } from './components/ReportComparisonModal';
import { AddReportModal } from './components/AddReportModal';
import { PatientDocumentUploadModal } from './components/PatientDocumentUploadModal';
import { EditDemographicsModal } from './components/EditDemographicsModal';
import { MOCK_REPORTS, PATIENTS, INITIAL_PATIENT_REPORTS } from './data/mockReports';
import { LabReport, MedicalCategory, PatientProfile } from './types';
import { ShieldCheck, Heart, Info, ArrowUp, Activity } from 'lucide-react';

export function App() {
  const [patientReportsMap, setPatientReportsMap] = useState<Record<string, LabReport[]>>(INITIAL_PATIENT_REPORTS);
  const [patientList, setPatientList] = useState<PatientProfile[]>(PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p-1');
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-001');
  const [selectedCategory, setSelectedCategory] = useState<MedicalCategory | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [metricStatusFilter, setMetricStatusFilter] = useState<string | null>(null);

  // Modal visibility states
  const [showOriginalReport, setShowOriginalReport] = useState(false);
  const [showDoctorSheet, setShowDoctorSheet] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showAddReport, setShowAddReport] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditDemographics, setShowEditDemographics] = useState(false);

  const currentPatientReports = patientReportsMap[selectedPatientId] || INITIAL_PATIENT_REPORTS['p-1'];
  const currentReport = currentPatientReports.find(r => r.id === selectedReportId) || currentPatientReports[0];
  const activeTest = selectedTestId ? currentReport.tests.find(t => t.id === selectedTestId) || null : null;

  const handleSelectReport = (reportId: string) => {
    setSelectedReportId(reportId);
    setSelectedCategory(null);
    setSelectedTestId(null);
    setMetricStatusFilter(null);
  };

  const handleSaveMultipleReports = (
    patientId: string, 
    newReports: LabReport[], 
    newPatient?: PatientProfile
  ) => {
    if (newPatient) {
      setPatientList(prev => [newPatient, ...prev]);
      setPatientReportsMap(prev => ({
        ...prev,
        [newPatient.id]: newReports
      }));
      setSelectedPatientId(newPatient.id);
      setSelectedReportId(newReports[0].id);
    } else {
      setPatientReportsMap(prev => {
        const existing = prev[patientId] || [];
        const existingIds = new Set(newReports.map(r => r.id));
        const filteredExisting = existing.filter(r => !existingIds.has(r.id));
        return {
          ...prev,
          [patientId]: [...newReports, ...filteredExisting]
        };
      });
      setSelectedPatientId(patientId);
      setSelectedReportId(newReports[0].id);
    }

    setSelectedCategory(null);
    setSelectedTestId(null);
    setMetricStatusFilter(null);
  };

  const handleAddNewReport = (newReport: LabReport) => {
    handleSaveMultipleReports(newReport.patient.id, [newReport]);
  };

  const handleUpdateCurrentReport = (updatedReport: LabReport) => {
    setPatientReportsMap(prev => {
      const existing = prev[updatedReport.patient.id] || [];
      const updatedList = existing.map(r => r.id === updatedReport.id ? updatedReport : r);
      return {
        ...prev,
        [updatedReport.patient.id]: updatedList.length > 0 ? updatedList : [updatedReport]
      };
    });
    setSelectedCategory(null);
    setSelectedTestId(null);
  };

  const handleUpdatePatientDemographics = (updatedPatient: PatientProfile) => {
    setPatientList(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    setPatientReportsMap(prev => {
      const existingReports = prev[updatedPatient.id] || [];
      return {
        ...prev,
        [updatedPatient.id]: existingReports.map(r => ({
          ...r,
          patient: updatedPatient
        }))
      };
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToResultsTable = (cat: MedicalCategory | null) => {
    setSelectedCategory(cat);
    const tableElem = document.getElementById('laboratory-results-table');
    if (tableElem) {
      tableElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
      {/* Top Navigation */}
      <Navbar
        currentReport={currentReport}
        selectedPatientId={selectedPatientId}
        patientList={patientList}
        onSelectPatient={(pId) => {
          setSelectedPatientId(pId);
          const reports = patientReportsMap[pId] || [];
          if (reports.length > 0) {
            setSelectedReportId(reports[0].id);
          }
          setSelectedCategory(null);
          setSelectedTestId(null);
          setMetricStatusFilter(null);
        }}
        onOpenOriginalReport={() => setShowOriginalReport(true)}
        onOpenCompare={() => setShowCompareModal(true)}
        onOpenDoctorSheet={() => setShowDoctorSheet(true)}
        onOpenAddReport={() => setShowAddReport(true)}
        onOpenUploadModal={() => setShowUploadModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7 min-w-0">
        {/* Section B: Patient & Report Summary Card */}
        <PatientSummaryCard
          report={currentReport}
          allPatientReports={currentPatientReports}
          selectedReportId={currentReport.id}
          onSelectReport={handleSelectReport}
          activeStatusFilter={metricStatusFilter}
          onOpenUploadModal={() => setShowUploadModal(true)}
          onOpenEditDemographics={() => setShowEditDemographics(true)}
          onFilterStatus={(status) => {
            setMetricStatusFilter(status);
            const tableElem = document.getElementById('laboratory-results-table');
            if (tableElem) {
              tableElem.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Section C: Key Clinical Findings & Attention Panel */}
        <KeyFindingsPanel
          findings={currentReport.keyFindings}
          onSelectTest={(tId) => setSelectedTestId(tId)}
        />

        {/* Section: Early Predictive Risk Estimations & Biomarkers */}
        <EarlyPredictionsPanel
          report={currentReport}
        />

        {/* Section D: Health Test Category Cards (Interactive Grid) */}
        <CategoryCardsGrid
          tests={currentReport.tests}
          selectedCategory={selectedCategory}
          onSelectCategory={scrollToResultsTable}
        />

        {/* Section E: Complete Laboratory Results Table */}
        <LabResultsTable
          tests={currentReport.tests}
          selectedCategory={selectedCategory}
          onClearCategory={() => setSelectedCategory(null)}
          onSelectTest={(tId) => setSelectedTestId(tId)}
          metricStatusFilter={metricStatusFilter}
          onClearMetricFilter={() => setMetricStatusFilter(null)}
        />

        {/* Section G: Trend Analysis Dashboard */}
        <TrendAnalysisDashboard
          report={currentReport}
          allPatientReports={currentPatientReports}
          onSelectTestModal={(tId) => setSelectedTestId(tId)}
        />

        {/* Section H: Possible Clinical Patterns Panel */}
        <ClinicalPatternsPanel
          patterns={currentReport.patterns}
          onSelectTest={(tId) => setSelectedTestId(tId)}
        />

        {/* Section I: Doctor Discussion & Appointment Preparation */}
        <DoctorDiscussionPanel
          report={currentReport}
          onOpenPrintSheet={() => setShowDoctorSheet(true)}
        />

        {/* Section J: Personal Health Preparation Checklist */}
        <HealthChecklistPanel
          initialChecklist={currentReport.checklist}
        />

        {/* Section K: Recommended Clinical Follow-Up Tiers */}
        <RecommendedFollowUpPanel
          followUps={currentReport.followUps}
        />

        {/* Quick Back to Top */}
        <div className="flex justify-end mb-8 no-print">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-teal-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5 mr-1" />
            <span>Back to top</span>
          </button>
        </div>
      </main>

      {/* Footer & Educational Disclaimer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 mt-auto no-print text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold">
            <Activity className="w-4 h-4 text-teal-600" />
            <span>MediInsight AI — Personal Health Report Dashboard</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-500 text-xs">
            <button onClick={() => setShowOriginalReport(true)} className="hover:text-teal-700">
              Data Verification
            </button>
            <button onClick={() => setShowCompareModal(true)} className="hover:text-teal-700">
              Trends
            </button>
            <button onClick={() => setShowDoctorSheet(true)} className="hover:text-teal-700">
              Doctor Sheet
            </button>
            <button onClick={() => window.print()} className="hover:text-teal-700">
              Print Report
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-600 mb-0.5">
            Important Educational Disclaimer:
          </p>
          <p>
            MediInsight AI is built solely for personal health education and physician appointment preparation. 
            It does not provide definitive medical diagnosis, prescribe drugs or treatments, or replace the professional judgment of a licensed physician. 
            Never start, stop, or change medications without direct medical orders from your doctor.
          </p>
        </div>
      </footer>

      {/* Modals & Overlays */}

      {/* 1. Detailed Result Interpretation Modal */}
      {selectedTestId && (
        <TestDetailModal
          test={activeTest}
          onClose={() => setSelectedTestId(null)}
          onSelectRelatedTest={(relName) => {
            const found = currentReport.tests.find(t => t.name.toLowerCase().includes(relName.toLowerCase()));
            if (found) setSelectedTestId(found.id);
          }}
        />
      )}

      {/* 2. Original Report & Data Verification Viewer */}
      {showOriginalReport && (
        <OriginalReportViewer
          report={currentReport}
          onClose={() => setShowOriginalReport(false)}
          onSelectTest={(tId) => {
            setShowOriginalReport(false);
            setSelectedTestId(tId);
          }}
        />
      )}

      {/* 3. Doctor Discussion Printable Sheet */}
      {showDoctorSheet && (
        <DoctorDiscussionPrintSheet
          report={currentReport}
          onClose={() => setShowDoctorSheet(false)}
        />
      )}

      {/* 4. Report Comparison Modal */}
      {showCompareModal && (
        <ReportComparisonModal
          report={currentReport}
          allPatientReports={currentPatientReports}
          onClose={() => setShowCompareModal(false)}
          onSelectTest={(tId) => {
            setShowCompareModal(false);
            setSelectedTestId(tId);
          }}
        />
      )}

      {/* 5. Add / Upload Custom Report Modal */}
      {showAddReport && (
        <AddReportModal
          patientList={patientList}
          currentPatientId={selectedPatientId}
          onClose={() => setShowAddReport(false)}
          onAddReport={handleAddNewReport}
        />
      )}

      {/* 6. Upload Patient Lab Records (PDF, JPEG, PNG) Modal */}
      {showUploadModal && (
        <PatientDocumentUploadModal
          patientList={patientList}
          currentPatientId={selectedPatientId}
          currentReport={currentReport}
          onClose={() => setShowUploadModal(false)}
          onSaveMultipleReports={handleSaveMultipleReports}
          onOpenOriginalViewer={() => setShowOriginalReport(true)}
        />
      )}

      {/* 7. Edit Patient Demographics (DOB, Blood Group, MRN) Modal */}
      {showEditDemographics && (
        <EditDemographicsModal
          currentReport={currentReport}
          onClose={() => setShowEditDemographics(false)}
          onUpdatePatient={handleUpdatePatientDemographics}
        />
      )}
    </div>
  );
}

export default App;
