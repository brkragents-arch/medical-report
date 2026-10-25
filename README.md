# MediInsight AI — Personal Health Report Dashboard

A modern, responsive, evidence-based clinical analytics web dashboard designed to transform raw laboratory diagnostic reports (CBC, Blood Glucose, HbA1c, Lipid Panel, Kidney Function, Liver Function, Complete Urine Exam, Thyroid Function, Vitamins, and Minerals) into an accessible, visually engaging, patient-empowering health overview.

---

## 🌟 Key Features

### 1. Top Navigation & Identity
- **Branding**: MediInsight AI with clinical accreditation badges.
- **Patient Context**: Patient demographics (Age, Gender, DOB, MRN, Referring Physician) and sample collection timestamps.
- **Review Status**: Analysis complete status pill with verification checkpoints.
- **Actions**:
  - `View Original Report`: Inspect simulated raw lab documents alongside OCR bounding box extractions.
  - `Trends & Compare`: Longitudinal multi-date comparative view.
  - `Doctor Sheet`: Dedicated printable discussion guide with questions, notes, and checklist.
  - `Print / PDF`: Print-optimized layout.
  - **Scenario Switcher**: Switch between 5 rich, permanent clinical scenarios:
    1. **Alex M. Morgan (48M)** — *Executive Panel*: Impaired Fasting Glucose, Elevated LDL & Triglycerides, Vitamin D Deficiency, Borderline Low Ferritin.
    2. **Eleanor R. Vance (62F)** — *Metabolic & Diabetic Management*: HbA1c 8.2%, eGFR 54 mL/min/1.73m², Microalbuminuria 68 mg/g.
    3. **David K. Chen (31M)** — *Routine Annual Wellness Screen*: All tests within reference intervals.
    4. **Samantha J. Reed (36F)** — *Fatigue & Endocrine Workup*: Primary Hypothyroidism (TSH 8.90 mIU/L, FT4 0.68 ng/dL) and Microcytic Iron Deficiency Anemia (Hb 10.4 g/dL, MCV 71.5 fL, Ferritin 8 ng/mL).
    5. **Robert H. Gallagher (67M)** — *Cardiometabolic & Hepatic Evaluation*: Hyperuricemia with Gout Risk (Uric Acid 8.8 mg/dL), Metabolic Liver Strain / Transaminitis (ALT 68 U/L, AST 54 U/L), High Triglycerides (285 mg/dL), Early Diabetes (A1c 6.6%).

### 2. Upload Lab Records (JPEG / PDF / PNG) for Any Patient
- **Patient Contextual Upload**: Select any patient from the dropdown and click **`Upload Scan (PDF/JPEG)`** in the header or patient card.
- **File Input & Drag-and-Drop**: Accepts `.pdf`, `.jpg`, `.jpeg`, `.png`, `.webp`, `.bmp`.
- **Live Document Preview**: Renders high-resolution image preview of uploaded lab slips or digital PDF metadata.
- **Instant Demo Scans**: Convenient buttons to test sample Quest or Hospital CBC scans with 1-click.
- **AI OCR Optical Extraction Simulation**: Animated scanner sweeps across the document to extract parameters, match reference ranges, and categorize urgency.
- **Merge & View**: Attaches document directly into the patient's record and auto-opens the **Original Report Viewer** with interactive OCR bounding boxes superimposed!

### 2. Patient & Report Summary Card
- Non-overlapping metrics computed directly from extracted tests:
  - Total Tests Reviewed
  - Within Reference Range (Normal)
  - Flagged (High/Low)
  - Borderline Results
  - Findings Requiring Follow-Up
  - Unverified / Missing
- **Evidence-Based Status Banner**: Adapts dynamically without misleading aggregate "health scores".

### 3. Key Findings & Clinical Attention Panel
- Prioritized findings sorted by clinical urgency:
  - **RED**: Potential Emergency (only displayed if clinically warranted).
  - **ORANGE**: Prompt Medical Review (e.g. eGFR decline, suboptimal diabetic control).
  - **YELLOW**: Follow-Up Recommended (e.g. prediabetes, borderline lipids, low Vitamin D).
  - **GREEN**: Normal In-Range Screening.
  - **GRAY**: Insufficient Information.
- Each finding features 5th-grade plain language explanation, clinical significance, and direct link to deep-dive interpretation.

### 4. Interactive Health Category Cards Grid
- Dynamically generated from tests present in the report:
  - Complete Blood Count (CBC)
  - Blood Sugar & Diabetes Screening
  - Lipid Profile & Cholesterol
  - Kidney Function
  - Liver Function
  - Complete Urine Examination (CUE)
  - Thyroid Function
  - Vitamins & Nutritional Markers
  - Electrolytes & Minerals
  - Inflammatory Markers
  - Cardiac & Coagulation Markers
- One-click filtering to isolate specific organ systems in the results table.

### 5. Complete Laboratory Results Table
- Live search by test name or keyword.
- Category filter pills, status dropdown (Normal, High, Low, Borderline), priority filter.
- Quick toggle: "All Results" vs "Flagged Only".
- Clear identification of calculated values (e.g. eGFR, Friedewald LDL, eAG).
- Expandable rows with plain-language explanations and doctor discussion tips.

### 6. Detailed Result Interpretation Modal
- Exact reported value with unit and laboratory reference range.
- Interactive **Visual Range Meter** showing where the patient's result sits relative to low, normal, and high intervals.
- **Established Facts vs Possible Explanations** (never presents possible causes as confirmed diagnoses).
- Influencing lifestyle factors (diet, hydration, fasting duration, exercise).
- Clinically related tests and personalized question for physician.

### 7. Trend Analysis Dashboard
- Recharts interactive longitudinal line graphs.
- Reference interval shaded bands.
- Absolute and percentage changes with trajectory indicators (Increased, Decreased, Relatively Stable).
- AI longitudinal narrative contextualizing multi-date trends.

### 8. Possible Clinical Patterns Panel
- Highlights multi-test syndromes (e.g. Prediabetes Clustering, Microcytic Iron Depletion, Diabetic Microvascular Renal Strain).
- Supporting results, plain-language meaning, alternative explanations/limitations, and physician discussion points.
- Strictly labeled as **Preliminary Observation — Not a Diagnosis**.

### 9. Doctor Discussion Panel & Printable Sheet
- 5–12 ranked questions tailored to actual lab findings.
- Interactive checkboxes to mark questions as discussed.
- Editable note fields for patient notes or doctor instructions.
- Add custom questions feature.
- **Print Doctor Discussion Sheet**: Formatted specifically for Letter/A4 printing with handwriting lines.

### 10. Personal Health Preparation Checklist
- Practical checklist for appointment preparation (previous records, medication box check, symptom tracking).
- Strict guardrails: Explicit warning against discontinuing or altering prescription medicines without a doctor's order.

### 11. Recommended Clinical Follow-Up Tiers
- Tier 1: Emergency (if applicable).
- Tier 2: Prompt Clinical Review (1 to 2 weeks).
- Tier 3: Routine Appointment Discussion & Monitoring.

### 12. Original Report & Data Verification Viewer
- Side-by-side / split-screen document viewer simulating the original lab slip.
- Interactive OCR text bounding overlay to cross-check extracted numbers against raw requisition lines.

---

## 🚀 Running the Project

```bash
# Start Vite development server
npm run dev

# Or build for production
npm run build
npm run preview
```
