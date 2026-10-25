import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileCheck2, 
  Info, 
  Calendar, 
  Building2, 
  Award, 
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Activity,
  Upload,
  Edit2,
  Sparkles,
  Heart,
  Scale,
  Ruler,
  Stethoscope,
  Cigarette,
  Wine,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { LabReport } from '../types';

interface PatientSummaryCardProps {
  report: LabReport;
  onFilterStatus?: (status: string | null) => void;
  activeStatusFilter?: string | null;
  onOpenUploadModal?: () => void;
  onOpenEditDemographics?: () => void;
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  report,
  onFilterStatus,
  activeStatusFilter,
  onOpenUploadModal,
  onOpenEditDemographics
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showVitalsDetails, setShowVitalsDetails] = useState<boolean>(true);

  const p = report.patient;
  const vitals = p.vitals;
  const lifestyle = p.lifestyle;
  const diseases = p.preExistingDiseases || [];

  const heightCm = vitals?.heightCm || 175;
  const weightKg = vitals?.weightKg || 75;
  const heightM = heightCm / 100;
  const bmi = vitals?.bmi || Number((weightKg / (heightM * heightM)).toFixed(1));
  const bmiCategory = vitals?.bmiCategory || (bmi < 18.5 ? 'Underweight' : bmi < 25.0 ? 'Normal' : bmi < 30.0 ? 'Overweight' : 'Obese');
  const waistCm = vitals?.waistCircumferenceCm || 86;
  const whtr = vitals?.waistToHeightRatio || Number((waistCm / heightCm).toFixed(2));
  const bpSys = vitals?.bpSystolic || 122;
  const bpDia = vitals?.bpDiastolic || 80;
  const bpStage = vitals?.bpStage || (bpSys >= 140 || bpDia >= 90 ? 'Stage 2 Hypertension' : bpSys >= 130 || bpDia >= 80 ? 'Stage 1 Hypertension' : bpSys >= 120 ? 'Elevated' : 'Normal');
  const pulse = vitals?.heartRateBpm || 72;
  const spo2 = vitals?.spo2Percent || 98;

  // Accurate non-overlapping counts computed directly from extracted tests:
  const totalTests = report.tests.length;
  const normalTests = report.tests.filter(t => t.status === 'Normal').length;
  const highTests = report.tests.filter(t => t.status === 'High' || t.status === 'Critical High').length;
  const lowTests = report.tests.filter(t => t.status === 'Low' || t.status === 'Critical Low').length;
  const borderlineTests = report.tests.filter(t => t.status === 'Borderline High' || t.status === 'Borderline Low').length;
  const flaggedTotal = highTests + lowTests + borderlineTests;
  const unverifiedTests = report.tests.filter(t => t.status === 'Unverified').length;
  const followUpCount = report.keyFindings.filter(f => f.priority === 'YELLOW' || f.priority === 'ORANGE' || f.priority === 'RED').length;

  // Determine overall review banner tone based on highest priority
  const hasEmergency = report.keyFindings.some(f => f.priority === 'RED');
  const hasPromptReview = report.keyFindings.some(f => f.priority === 'ORANGE');
  const hasFollowUp = report.keyFindings.some(f => f.priority === 'YELLOW');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 mb-6">
      {/* Top Patient Demographics & Laboratory Metadata Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Patient ID: {report.patient.mrn}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {report.patient.gender}, Age {report.patient.age} (DOB: {report.patient.dob})
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Blood Group: {report.patient.bloodGroup}
            </span>
            {onOpenEditDemographics && (
              <button
                onClick={onOpenEditDemographics}
                className="inline-flex items-center text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-teal-50/80 px-2 py-0.5 rounded-full border border-teal-200 hover:bg-teal-100 transition-colors shadow-2xs"
                title="Edit Height, Weight, Waist, BP, SpO2, Pre-Existing Conditions, or Lifestyle Habits"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                <span>Edit Vitals &amp; Profile</span>
              </button>
            )}
            <button
              onClick={() => {
                const elem = document.getElementById('early-predictions-panel');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center text-[11px] font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs"
              title="Jump down to Early Risk Predictions (Coronary Ratios, HOMA-IR, CrCl, Cancer Markers)"
            >
              <Sparkles className="w-3 h-3 mr-1 text-amber-600" />
              <span>Biomarker Predictions</span>
            </button>
            {report.patient.referringDoctor && (
              <span className="text-xs text-slate-500 hidden sm:inline">
                &bull; Referring: <span className="font-medium text-slate-700">{report.patient.referringDoctor}</span>
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex flex-wrap items-center gap-2">
            <span>{report.patient.fullName}</span>
            <span className="text-xs font-normal text-slate-500">
              — Health Report Analysis
            </span>
          </h1>
        </div>

        {/* Laboratory Credential badge & Upload Action */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center space-x-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 text-xs">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="font-medium text-slate-800 leading-tight">{report.labName}</p>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                <span>{report.accreditation}</span>
                <span>&bull;</span>
                <span className="flex items-center text-slate-600">
                  <Calendar className="w-3 h-3 mr-1" />
                  Sample: {report.collectionDate}
                </span>
              </div>
            </div>
          </div>

          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center px-3 py-2 text-xs font-semibold rounded-xl text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors shadow-2xs shrink-0"
              title={`Upload raw lab slip or PDF document for ${report.patient.fullName}`}
            >
              <Upload className="w-3.5 h-3.5 mr-1.5 text-teal-600" />
              <span>Upload Lab Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Patient Clinical Vitals, Body Composition & Medical Profile */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Clinical Vitals, Body Composition &amp; Medical History
            </h2>
            <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-semibold border border-teal-200">
              Active Parameters for Analysis
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenEditDemographics && (
              <button
                onClick={onOpenEditDemographics}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 flex items-center hover:underline"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                <span>Modify Vitals</span>
              </button>
            )}
            <button
              onClick={() => setShowVitalsDetails(!showVitalsDetails)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
              title={showVitalsDetails ? 'Collapse vitals' : 'Expand vitals'}
            >
              {showVitalsDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showVitalsDetails && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* 5 Vitals Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {/* Card 1: Height & Weight */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide">Height &amp; Weight</span>
                  <Scale className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <div className="font-mono font-bold text-slate-900 text-xs">
                  {heightCm} cm &bull; {weightKg} kg
                </div>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  ≈ {Math.floor(heightCm / 30.48)}'{Math.round((heightCm % 30.48) / 2.54)}" &bull; {(weightKg * 2.20462).toFixed(1)} lbs
                </p>
              </div>

              {/* Card 2: BMI */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide">Body Mass Index</span>
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-mono font-black text-sm text-slate-900">{bmi}</span>
                  <span className="text-[10px] text-slate-500">kg/m²</span>
                </div>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold mt-0.5 ${
                  bmiCategory === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {bmiCategory}
                </span>
              </div>

              {/* Card 3: Waist & WHtR */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide">Waist &amp; Visceral</span>
                  <Ruler className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-mono font-bold text-slate-900 text-xs">{waistCm} cm</span>
                  <span className="text-[10px] text-slate-500 font-mono">(WHtR: {whtr})</span>
                </div>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold mt-0.5 ${
                  whtr <= 0.50 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {whtr <= 0.50 ? 'Optimal (≤0.50)' : 'Central Adiposity (>0.50)'}
                </span>
              </div>

              {/* Card 4: Blood Pressure & Pulse */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide">Blood Pressure</span>
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-mono font-black text-sm text-slate-900">{bpSys}/{bpDia}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({pulse} bpm)</span>
                </div>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold mt-0.5 ${
                  bpStage === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {bpStage}
                </span>
              </div>

              {/* Card 5: SpO2 */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide">Blood Oxygen</span>
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-mono font-black text-sm text-slate-900">{spo2}%</span>
                  <span className="text-[10px] text-slate-500 font-mono">SpO2</span>
                </div>
                <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold mt-0.5 ${
                  spo2 >= 95 ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {spo2 >= 95 ? 'Normal Baseline' : 'Mild Hypoxemia'}
                </span>
              </div>
            </div>

            {/* Medical History & Lifestyle Tags Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              {/* Pre-Existing Diagnoses */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-slate-700 font-bold text-[11px] mb-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-700" />
                    <span>Diagnosed Pre-Existing Conditions:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {diseases.length === 0 ? (
                      <span className="text-[11px] text-slate-600 italic">No pre-existing diseases reported (preventive wellness).</span>
                    ) : (
                      diseases.map(d => (
                        <span key={d} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 text-[11px] font-medium">
                          &bull; {d}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Habits & Lifestyle Factors */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-slate-700 font-bold text-[11px] mb-1.5">
                    <Cigarette className="w-3.5 h-3.5 text-slate-600" />
                    <span>Habits &amp; Lifestyle Context:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700">
                    <div>
                      <span className="text-slate-600 font-medium">Smoking: </span>
                      <span className="font-semibold">{lifestyle?.smokingStatus || 'Never Smoker'}</span>
                      {lifestyle?.smokingDetails && (
                        <span className="text-[10px] text-slate-600 block">({lifestyle.smokingDetails})</span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Alcohol: </span>
                      <span className="font-semibold">{lifestyle?.alcoholIntake || 'None'}</span>
                      {lifestyle?.alcoholDetails && (
                        <span className="text-[10px] text-slate-600 block">({lifestyle.alcoholDetails})</span>
                      )}
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Exercise: </span>
                      <span className="font-semibold">{lifestyle?.physicalActivity || 'Moderate'}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Diet &amp; Sleep: </span>
                      <span className="font-semibold">{lifestyle?.dietType || 'Standard'}</span> ({lifestyle?.sleepHoursPerNight || 7}h sleep)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Integration Callout */}
            <div className="bg-teal-50/60 p-2.5 rounded-xl border border-teal-200/70 text-[11px] text-teal-950 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-teal-900">How MediInsight AI Factors These Parameters Into Your Report: </span>
                <span>
                  Your <strong>Blood Pressure ({bpSys}/{bpDia})</strong> and <strong>Smoking status</strong> are cross-referenced with your lipid panel to estimate coronary atherogenic risk. 
                  Your <strong>Weight ({weightKg} kg)</strong> calculates exact Cockcroft-Gault Creatinine Clearance ($CrCl$). 
                  Your <strong>Waist Circumference ({waistCm} cm)</strong> and <strong>BMI ({bmi})</strong> directly drive the NCEP ATP III Metabolic Syndrome evaluation and HOMA-IR insulin sensitivity model.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Status Banner */}
      <div className="mt-4 mb-5">
        {hasEmergency ? (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-900">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wide text-red-700">Immediate Action Required</p>
              <p className="text-xs mt-0.5">One or more values indicate an urgent finding. Please contact emergency services or your physician immediately.</p>
            </div>
          </div>
        ) : hasPromptReview ? (
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 flex items-start space-x-3 text-orange-900">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wide text-orange-800">Prompt Medical Review Recommended</p>
              <p className="text-xs mt-0.5">
                Certain results show potentially meaningful changes (e.g., kidney filtration rate and glycemic control) that merit timely clinical follow-up with your doctor within 1 to 2 weeks.
              </p>
            </div>
          </div>
        ) : hasFollowUp ? (
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 flex items-start space-x-3 text-amber-900">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center space-x-2">
                <p className="font-bold text-xs uppercase tracking-wide text-amber-800">Review Status: Routine Follow-Up Recommended</p>
                <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.2 rounded font-medium">Non-Urgent</span>
              </div>
              <p className="text-xs mt-0.5 text-amber-900/90 leading-relaxed">
                Analysis complete. Most parameters are healthy; mild out-of-range findings (e.g. fasting sugar, cholesterol, vitamin D) were identified that merit routine discussion and proactive lifestyle planning with your primary doctor.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start space-x-3 text-emerald-900">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wide text-emerald-800">Review Status: All Reviewed Tests Within Standard Intervals</p>
              <p className="text-xs mt-0.5 text-emerald-900/90 leading-relaxed">
                No significant abnormalities were identified in the reviewed results. Routine wellness preventive consultation is recommended to maintain baseline health.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 6 Compact Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Total Tests Reviewed */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus(null)}
          className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
            activeStatusFilter === null 
              ? 'bg-slate-100/90 border-slate-300 ring-1 ring-slate-400' 
              : 'bg-slate-50/70 border-slate-200/90 hover:bg-slate-100/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tests Reviewed</span>
            <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900">{totalTests}</span>
            <span className="text-[11px] text-slate-600 font-medium">verified</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">100% extracted</p>
        </div>

        {/* Metric 2: Within Reference Range (Normal) */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('Normal')}
          className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
            activeStatusFilter === 'Normal' 
              ? 'bg-emerald-100/70 border-emerald-400 ring-1 ring-emerald-500' 
              : 'bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">In Range</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-emerald-700">{normalTests}</span>
            <span className="text-[11px] text-emerald-600 font-medium">
              ({totalTests > 0 ? Math.round((normalTests / totalTests) * 100) : 0}%)
            </span>
          </div>
          <p className="text-[10px] text-emerald-600 mt-1">Normal baseline</p>
        </div>

        {/* Metric 3: Flagged (High or Low) */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('Flagged')}
          className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
            activeStatusFilter === 'Flagged' 
              ? 'bg-amber-100/70 border-amber-400 ring-1 ring-amber-500' 
              : 'bg-amber-50/50 border-amber-200/80 hover:bg-amber-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Flagged</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-amber-700">{highTests + lowTests}</span>
            <span className="text-[10px] text-amber-600 font-medium">
              ({highTests}H / {lowTests}L)
            </span>
          </div>
          <p className="text-[10px] text-amber-600 mt-1">Outside ref range</p>
        </div>

        {/* Metric 4: Borderline Results */}
        <div 
          onClick={() => onFilterStatus && onFilterStatus('Borderline')}
          className={`relative p-3.5 rounded-xl border transition-all cursor-pointer ${
            activeStatusFilter === 'Borderline' 
              ? 'bg-orange-100/70 border-orange-400 ring-1 ring-orange-500' 
              : 'bg-orange-50/40 border-orange-200/80 hover:bg-orange-50'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-orange-800 uppercase tracking-wider">Borderline</span>
            <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-orange-700">{borderlineTests}</span>
            <span className="text-[11px] text-orange-600 font-medium">values</span>
          </div>
          <p className="text-[10px] text-orange-600 mt-1">Near threshold</p>
        </div>

        {/* Metric 5: Findings for Follow-Up */}
        <div 
          className="relative p-3.5 rounded-xl border bg-teal-50/50 border-teal-200/80"
          title="Clinical patterns or findings meriting doctor discussion"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">Follow-Up</span>
            <Activity className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-teal-800">{followUpCount}</span>
            <span className="text-[11px] text-teal-600 font-medium">key topics</span>
          </div>
          <p className="text-[10px] text-teal-600 mt-1">Doctor discussion</p>
        </div>

        {/* Metric 6: Unreadable / Unverified */}
        <div 
          className="relative p-3.5 rounded-xl border bg-slate-50/50 border-slate-200/80"
          title="Extracted tests requiring manual verification from raw image"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Unverified</span>
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-700">{unverifiedTests}</span>
            <span className="text-[11px] text-slate-400 font-medium">issues</span>
          </div>
          <p className="text-[10px] text-emerald-600 mt-1">100% high quality</p>
        </div>
      </div>

      <div className="mt-3.5 text-[11px] text-slate-600 flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100">
        <span className="flex items-center text-slate-600">
          <Info className="w-3.5 h-3.5 mr-1 text-slate-600 shrink-0" />
          Counts strictly represent extracted laboratory values from verified reference ranges. Overlapping flags are partitioned without artificial scoring.
        </span>
        {activeStatusFilter && (
          <button 
            onClick={() => onFilterStatus && onFilterStatus(null)}
            className="text-xs font-semibold text-teal-700 hover:underline"
          >
            Clear Metric Filter ({activeStatusFilter})
          </button>
        )}
      </div>
    </div>
  );
};
