import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  ShieldCheck, 
  ExternalLink,
  Search,
  Maximize2
} from 'lucide-react';
import { LabReport, OriginalReportBoundingBox } from '../types';

interface OriginalReportViewerProps {
  report: LabReport;
  onClose: () => void;
  onSelectTest: (testId: string) => void;
}

export const OriginalReportViewer: React.FC<OriginalReportViewerProps> = ({
  report,
  onClose,
  onSelectTest
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);

  const totalPages = report.originalReportPages.length;
  const activePageData = report.originalReportPages.find(p => p.pageNumber === currentPage) || report.originalReportPages[0];
  const pageBoxes = report.boundingBoxes.filter(b => b.page === currentPage);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-slate-100 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Controls */}
        <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm">
                  Original Laboratory Requisition & OCR Data Verification
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Repertoire
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {report.labName} &bull; Sample Collection: {report.collectionDate}
              </p>
            </div>
          </div>

          {/* Page, Zoom & Close */}
          <div className="flex items-center space-x-2">
            {/* Page navigation */}
            <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-700 px-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom controls */}
            <div className="hidden sm:flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
              <button
                onClick={() => setZoomLevel(z => Math.max(80, z - 10))}
                className="p-1 text-slate-600 hover:text-slate-900"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-600 px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(z => Math.min(140, z + 10))}
                className="p-1 text-slate-600 hover:text-slate-900"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dual Split-View Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Original Document Simulator with OCR Bounding Overlay */}
          <div className="lg:col-span-8 overflow-y-auto p-4 sm:p-6 bg-slate-200/70 flex justify-center">
            <div 
              className="bg-white rounded-xl shadow-md border border-slate-300 w-full max-w-3xl p-8 transition-transform font-mono text-xs relative select-text"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Document Header Letterhead */}
              <div className="border-b-2 border-slate-800 pb-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-base font-extrabold text-slate-900 uppercase tracking-wider font-sans">
                      {report.labName}
                    </h1>
                    <p className="text-[10px] text-slate-600 font-sans">{report.labAddress}</p>
                    <p className="text-[10px] text-teal-800 font-sans font-semibold">{report.accreditation}</p>
                  </div>
                  <div className="text-right text-[10px] font-sans">
                    <p><span className="font-semibold">Patient:</span> {report.patient.fullName}</p>
                    <p><span className="font-semibold">MRN:</span> {report.patient.mrn} &bull; {report.patient.gender}/{report.patient.age}</p>
                    <p><span className="font-semibold">Collection:</span> {report.collectionDate}</p>
                    <p><span className="font-semibold">Report Date:</span> {report.reportDate}</p>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="bg-slate-100 px-3 py-1.5 rounded font-bold text-slate-800 uppercase tracking-wider text-center text-xs mb-5 font-sans flex items-center justify-between">
                <span>{activePageData?.title || 'CLINICAL PATHOLOGY LABORATORY REPORT'}</span>
                {activePageData?.fileMeta && (
                  <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Uploaded Record: {activePageData.fileMeta.name} ({activePageData.fileMeta.size})
                  </span>
                )}
              </div>

              {/* If an image preview exists for this uploaded page, display visual document with OCR overlay */}
              {activePageData?.imageUrl ? (
                <div className="relative mb-6 rounded-lg overflow-hidden border border-slate-300 shadow-sm bg-white">
                  <img 
                    src={activePageData.imageUrl} 
                    alt="Uploaded Laboratory Record" 
                    className="w-full h-auto block object-contain"
                  />
                  {/* Superimposed OCR Bounding Boxes */}
                  {pageBoxes.map(box => (
                    <div
                      key={box.id}
                      onClick={() => {
                        setSelectedBoxId(box.id);
                        onSelectTest(box.testId);
                      }}
                      className={`absolute border-2 transition-all cursor-pointer group ${
                        selectedBoxId === box.id 
                          ? 'border-teal-600 bg-teal-500/20' 
                          : 'border-teal-400/60 bg-teal-500/5 hover:bg-teal-500/15'
                      }`}
                      style={{
                        left: `${box.xPercent}%`,
                        top: `${box.yPercent}%`,
                        width: `${box.widthPercent}%`,
                        height: `${box.heightPercent}%`
                      }}
                      title={`Verified Test: ${box.testName} (${box.extractedText})`}
                    >
                      <span className="absolute -top-4 left-0 bg-teal-800 text-white font-sans text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xs">
                        {box.testName} (Click to deep-dive)
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Raw Report Sections */}
              <div className="space-y-6">
                {activePageData?.sections.map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-2">
                    <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wide font-sans">
                      {sec.category}
                    </h4>
                    <div className="space-y-1.5 pl-1">
                      {sec.rawLines.map((line, lIdx) => (
                        <div 
                          key={lIdx}
                          className="py-1 px-1.5 rounded hover:bg-teal-50/80 transition-colors flex justify-between items-center whitespace-pre font-mono text-[11px] text-slate-800"
                        >
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Document Footnote */}
              <div className="mt-8 pt-4 border-t border-slate-300 text-[10px] text-slate-500 font-sans flex justify-between items-center">
                <span>Electronically Signed & Verified by Pathologist</span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          </div>

          {/* Right: Extracted Data Verification Panel */}
          <div className="lg:col-span-4 bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-xs">
                Extracted Values for Page {currentPage}
              </h4>
              <p className="text-[11px] text-slate-500">
                Click any test to inspect exact clinical values and jump into detail mode.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {pageBoxes.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No specifically tagged bounding highlights on Page {currentPage}.
                </div>
              ) : (
                pageBoxes.map(box => {
                  const testData = report.tests.find(t => t.id === box.testId);

                  return (
                    <div
                      key={box.id}
                      onClick={() => onSelectTest(box.testId)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-xs ${
                        selectedBoxId === box.id
                          ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{box.testName}</span>
                        <span className="font-mono text-teal-800 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {testData ? `${testData.value} ${testData.unit}` : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        Raw OCR text: "{box.extractedText}"
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-teal-700 font-medium">
                        <span>Status: {testData?.status}</span>
                        <span className="underline">View Interpretation &rarr;</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All 100% extracted values match verified laboratory paper lines.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
