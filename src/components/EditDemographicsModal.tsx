import React, { useState } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Droplet, 
  Check, 
  Activity, 
  Heart, 
  Scale, 
  Ruler, 
  Stethoscope, 
  Cigarette, 
  Wine, 
  Dumbbell, 
  Plus, 
  Trash2,
  Sparkles,
  Info
} from 'lucide-react';
import { LabReport, PatientProfile, PatientVitals, PatientLifestyle } from '../types';

interface EditDemographicsModalProps {
  currentReport: LabReport;
  onClose: () => void;
  onUpdatePatient: (updatedPatient: PatientProfile) => void;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

const COMMON_DISEASES = [
  'Essential Hypertension',
  'Type 2 Diabetes Mellitus',
  'Impaired Fasting Glucose (Prediabetes)',
  'Dyslipidemia / Hypercholesterolemia',
  'Coronary Artery Disease (CAD)',
  'Non-Alcoholic Fatty Liver (NAFLD / MASH)',
  'Chronic Kidney Disease (Stage 2-3)',
  'Hashimoto\'s Hypothyroidism',
  'Asthma / Chronic Bronchitis',
  'Hyperuricemia / Gout',
  'Osteopenia / Osteoporosis'
];

export const EditDemographicsModal: React.FC<EditDemographicsModalProps> = ({
  currentReport,
  onClose,
  onUpdatePatient
}) => {
  const p = currentReport.patient;
  const initialVitals = p.vitals || {};
  const initialLifestyle = p.lifestyle || {};

  const [activeTab, setActiveTab] = useState<'vitals' | 'demographics' | 'conditions' | 'habits'>('vitals');

  // Demographics
  const [fullName, setFullName] = useState(p.fullName);
  const [dob, setDob] = useState(p.dob || '1980-01-01');
  const [bloodGroup, setBloodGroup] = useState(p.bloodGroup || 'O+');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(p.gender);
  const [age, setAge] = useState<number>(p.age);
  const [referringDoctor, setReferringDoctor] = useState(p.referringDoctor || '');

  // Vitals & Body Metrics
  const [heightCm, setHeightCm] = useState<number>(initialVitals.heightCm || 175);
  const [weightKg, setWeightKg] = useState<number>(initialVitals.weightKg || 75);
  const [waistCm, setWaistCm] = useState<number>(initialVitals.waistCircumferenceCm || 86);
  const [bpSys, setBpSys] = useState<number>(initialVitals.bpSystolic || 122);
  const [bpDia, setBpDia] = useState<number>(initialVitals.bpDiastolic || 80);
  const [pulse, setPulse] = useState<number>(initialVitals.heartRateBpm || 72);
  const [spo2, setSpo2] = useState<number>(initialVitals.spo2Percent || 98);

  // Pre-Existing Conditions
  const [diseases, setDiseases] = useState<string[]>(p.preExistingDiseases || []);
  const [customDiseaseInput, setCustomDiseaseInput] = useState('');

  // Lifestyle & Habits
  const [smokingStatus, setSmokingStatus] = useState<PatientLifestyle['smokingStatus']>(
    initialLifestyle.smokingStatus || 'Never Smoker'
  );
  const [smokingDetails, setSmokingDetails] = useState(initialLifestyle.smokingDetails || '');
  const [alcoholIntake, setAlcoholIntake] = useState<PatientLifestyle['alcoholIntake']>(
    initialLifestyle.alcoholIntake || 'Occasional'
  );
  const [alcoholDetails, setAlcoholDetails] = useState(initialLifestyle.alcoholDetails || '');
  const [physicalActivity, setPhysicalActivity] = useState<PatientLifestyle['physicalActivity']>(
    initialLifestyle.physicalActivity || 'Moderate (3-4 days/wk)'
  );
  const [dietType, setDietType] = useState<PatientLifestyle['dietType']>(
    initialLifestyle.dietType || 'Standard / Mixed'
  );
  const [sleepHours, setSleepHours] = useState<number>(initialLifestyle.sleepHoursPerNight || 7.0);

  // Live Calculations
  const heightM = heightCm > 0 ? heightCm / 100 : 1.75;
  const calculatedBmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  const calculatedBmiCategory = calculatedBmi < 18.5
    ? 'Underweight'
    : calculatedBmi < 25.0
    ? 'Normal'
    : calculatedBmi < 30.0
    ? 'Overweight'
    : calculatedBmi < 35.0
    ? 'Obese Class I'
    : 'Obese Class II+';

  const calculatedWhtr = heightCm > 0 ? Number((waistCm / heightCm).toFixed(2)) : 0.50;

  const calculatedBpStage = bpSys >= 180 || bpDia >= 120
    ? 'Hypertensive Crisis'
    : bpSys >= 140 || bpDia >= 90
    ? 'Stage 2 Hypertension'
    : bpSys >= 130 || bpDia >= 80
    ? 'Stage 1 Hypertension'
    : bpSys >= 120 && bpDia < 80
    ? 'Elevated'
    : 'Normal';

  const handleDobChange = (newDob: string) => {
    setDob(newDob);
    if (newDob) {
      const birthDate = new Date(newDob);
      const today = new Date();
      let calcAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calcAge--;
      }
      if (calcAge > 0 && calcAge < 125) {
        setAge(calcAge);
      }
    }
  };

  const handleAddDisease = (conditionName: string) => {
    const trimmed = conditionName.trim();
    if (trimmed && !diseases.includes(trimmed)) {
      setDiseases([...diseases, trimmed]);
      setCustomDiseaseInput('');
    }
  };

  const handleRemoveDisease = (conditionName: string) => {
    setDiseases(diseases.filter(d => d !== conditionName));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedVitals: PatientVitals = {
      heightCm,
      weightKg,
      bmi: calculatedBmi,
      bmiCategory: calculatedBmiCategory,
      waistCircumferenceCm: waistCm,
      waistToHeightRatio: calculatedWhtr,
      bpSystolic: bpSys,
      bpDiastolic: bpDia,
      bpStage: calculatedBpStage,
      heartRateBpm: pulse,
      spo2Percent: spo2
    };

    const updatedLifestyle: PatientLifestyle = {
      smokingStatus,
      smokingDetails: smokingDetails.trim() || undefined,
      alcoholIntake,
      alcoholDetails: alcoholDetails.trim() || undefined,
      physicalActivity,
      dietType,
      sleepHoursPerNight: sleepHours
    };

    const updated: PatientProfile = {
      ...p,
      fullName,
      dob,
      bloodGroup,
      gender,
      age: Number(age) || p.age,
      referringDoctor,
      vitals: updatedVitals,
      lifestyle: updatedLifestyle,
      preExistingDiseases: diseases
    };

    onUpdatePatient(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Patient Clinical Profile, Vitals &amp; Medical History
              </h3>
              <p className="text-[11px] text-slate-500">
                Height, Weight, Waist, BP, SpO2, Pre-Existing Conditions &amp; Habits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1.5 border-b border-slate-100 pb-2 mb-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('vitals')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-colors ${
              activeTab === 'vitals'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Vitals &amp; Body Metrics</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('conditions')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-colors ${
              activeTab === 'conditions'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Pre-Existing Diseases ({diseases.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('habits')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-colors ${
              activeTab === 'habits'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Cigarette className="w-3.5 h-3.5" />
            <span>Lifestyle &amp; Habits</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('demographics')}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-colors ${
              activeTab === 'demographics'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Demographics</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* TAB 1: VITALS & BODY METRICS */}
          {activeTab === 'vitals' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              {/* Live Status Indicators Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">BMI</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="font-mono font-black text-sm text-slate-900">{calculatedBmi}</span>
                    <span className="text-[10px] text-slate-500">kg/m²</span>
                  </div>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    calculatedBmiCategory === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {calculatedBmiCategory}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Waist / Height (WHtR)</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="font-mono font-black text-sm text-slate-900">{calculatedWhtr}</span>
                  </div>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    calculatedWhtr <= 0.50 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {calculatedWhtr <= 0.50 ? 'Healthy Ratio (≤0.50)' : 'Central Adiposity (>0.50)'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">BP Stage</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="font-mono font-black text-sm text-slate-900">{bpSys}/{bpDia}</span>
                    <span className="text-[10px] text-slate-500">mmHg</span>
                  </div>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    calculatedBpStage === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {calculatedBpStage}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Oxygen Saturation</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="font-mono font-black text-sm text-slate-900">{spo2}%</span>
                    <span className="text-[10px] text-slate-500">SpO2</span>
                  </div>
                  <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    spo2 >= 95 ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {spo2 >= 95 ? 'Optimal (≥95%)' : 'Sub-optimal (<95%)'}
                  </span>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Ruler className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={heightCm}
                    onChange={e => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    ≈ {Math.floor(heightCm / 30.48)} ft {Math.round((heightCm % 30.48) / 2.54)} in
                  </p>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Scale className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={e => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    ≈ {(weightKg * 2.20462).toFixed(1)} lbs
                  </p>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Ruler className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Waist Circumference (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={waistCm}
                    onChange={e => setWaistCm(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    ≈ {(waistCm / 2.54).toFixed(1)} inches (Umbilical level)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Heart className="w-3.5 h-3.5 mr-1 text-rose-500" />
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={bpSys}
                    onChange={e => setBpSys(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                    placeholder="120"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Heart className="w-3.5 h-3.5 mr-1 text-rose-500" />
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={bpDia}
                    onChange={e => setBpDia(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                    placeholder="80"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Activity className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={e => setPulse(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                    placeholder="72"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Activity className="w-3.5 h-3.5 mr-1 text-blue-600" />
                    SpO2 Oxygen (%)
                  </label>
                  <input
                    type="number"
                    min="70"
                    max="100"
                    value={spo2}
                    onChange={e => setSpo2(parseInt(e.target.value) || 98)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono"
                    placeholder="98"
                    required
                  />
                </div>
              </div>

              <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200/80 text-[11px] text-teal-900 flex items-start space-x-2">
                <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Clinical Analysis Connection:</strong> Weight is fed directly into the Cockcroft-Gault Creatinine Clearance equation. Waist circumference and Blood Pressure are cross-referenced with your Lipid and Glucose panels to compute Metabolic Syndrome (ATP III) criteria and atherogenic plaque vulnerability.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRE-EXISTING CONDITIONS */}
          {activeTab === 'conditions' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Active Diagnosed Conditions ({diseases.length}):
                </label>
                <div className="flex flex-wrap gap-1.5 min-h-[42px] p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  {diseases.length === 0 ? (
                    <span className="text-slate-600 italic py-1">No chronic diseases registered (Wellness profile).</span>
                  ) : (
                    diseases.map(d => (
                      <span 
                        key={d}
                        className="inline-flex items-center px-2.5 py-1 rounded-lg bg-teal-100 text-teal-900 font-semibold text-xs border border-teal-200"
                      >
                        <Stethoscope className="w-3 h-3 mr-1 text-teal-700" />
                        <span>{d}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDisease(d)}
                          className="ml-1.5 text-teal-700 hover:text-rose-600 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Add Custom Disease */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customDiseaseInput}
                  onChange={e => setCustomDiseaseInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDisease(customDiseaseInput);
                    }
                  }}
                  placeholder="Type condition name (e.g. Mild Sleep Apnea)..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => handleAddDisease(customDiseaseInput)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center space-x-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Condition</span>
                </button>
              </div>

              {/* Clickable Quick Presets */}
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Quick Select Common Conditions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_DISEASES.map(cond => {
                    const isSelected = diseases.includes(cond);
                    return (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => isSelected ? handleRemoveDisease(cond) : handleAddDisease(cond)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-teal-50 border-teal-400 text-teal-800 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {cond}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIFESTYLE & HABITS */}
          {activeTab === 'habits' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Smoking */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Cigarette className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    Smoking Status
                  </label>
                  <select
                    value={smokingStatus}
                    onChange={e => setSmokingStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="Never Smoker">Never Smoker</option>
                    <option value="Former Smoker">Former Smoker</option>
                    <option value="Current Smoker (Light)">Current Smoker (Light, &lt;10/day)</option>
                    <option value="Current Smoker (Heavy)">Current Smoker (Heavy, 10+/day)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Smoking Details / Pack-Years
                  </label>
                  <input
                    type="text"
                    value={smokingDetails}
                    onChange={e => setSmokingDetails(e.target.value)}
                    placeholder="e.g. Quit 4 yrs ago, or 10 cigs/day for 20 yrs"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Alcohol */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Wine className="w-3.5 h-3.5 mr-1 text-purple-600" />
                    Alcohol Consumption
                  </label>
                  <select
                    value={alcoholIntake}
                    onChange={e => setAlcoholIntake(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="None">None</option>
                    <option value="Occasional">Occasional (Social 1-2 drinks/wk)</option>
                    <option value="Moderate">Moderate (1 drink/day)</option>
                    <option value="Heavy">Heavy (2+ drinks/day)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Alcohol Intake Details
                  </label>
                  <input
                    type="text"
                    value={alcoholDetails}
                    onChange={e => setAlcoholDetails(e.target.value)}
                    placeholder="e.g. 1 glass red wine on weekends"
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Activity, Diet, Sleep */}
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Dumbbell className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    Physical Activity Level
                  </label>
                  <select
                    value={physicalActivity}
                    onChange={e => setPhysicalActivity(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="Sedentary">Sedentary (Desk job, &lt;30m walk/wk)</option>
                    <option value="Light (1-2 days/wk)">Light (1-2 days/wk)</option>
                    <option value="Moderate (3-4 days/wk)">Moderate (3-4 days/wk)</option>
                    <option value="Active (5+ days/wk)">Active (5+ days/wk)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Dietary Pattern</label>
                  <select
                    value={dietType}
                    onChange={e => setDietType(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="Standard / Mixed">Standard / Mixed</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Low-Carb / Keto">Low-Carb / Keto</option>
                    <option value="Vegetarian / Plant-Based">Vegetarian / Plant-Based</option>
                    <option value="High-Sodium / Processed">High-Sodium / Processed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Sleep (Hours / Night)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="3"
                    max="14"
                    value={sleepHours}
                    onChange={e => setSleepHours(parseFloat(e.target.value) || 7.0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start space-x-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Biomarker Correlation Note:</strong> Smoking status modulates baseline tumor marker interpretation (e.g. non-malignant CEA elevations up to 5.0 ng/mL in smokers). Alcohol intake is correlated with liver enzymes (ALT/AST) and Ferritin to distinguish steatohepatitis from iron overload.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: DEMOGRAPHICS */}
          {activeTab === 'demographics' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    Date of Birth (DOB)
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => handleDobChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 flex items-center">
                    <Droplet className="w-3.5 h-3.5 mr-1 text-rose-500" />
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-bold"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Biological Sex</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Referring Physician</label>
                <input
                  type="text"
                  value={referringDoctor}
                  onChange={e => setReferringDoctor(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-600">
              * Updates dynamically recalculate all biomarker risks, CrCl, and HOMA-IR.
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save &amp; Recalculate Analysis</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
