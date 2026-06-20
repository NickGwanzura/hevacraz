"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { submitApplication } from "@/actions/submit-application";
import {
  MEMBERSHIP_CATEGORIES,
  EXPERTISE_AREAS,
  REFRIGERANT_CERTIFICATIONS,
  CAREER_INTERESTS,
  SECTOR_FOCUSES,
  JOINING_REASONS,
  CORE_BUSINESS_ACTIVITIES,
} from "@/lib/constants";
import { MembershipCategory } from "@/lib/enums";

type FormData = Record<string, any>;

const initialFormData: FormData = {
  firstName: "", lastName: "", email: "", phone: "", address: "", category: "",
  qualifications: "", yearsOfExperience: "", expertiseAreas: [] as string[], refrigerantCertifications: [] as string[],
  institution: "", programme: "", expectedGraduation: "", careerInterest: "",
  jobTitle: "", employer: "", sectorFocus: "", joiningGoal: "",
  companyName: "", coreBusinessActivity: "", totalEmployees: "", activeFieldTechnicians: "",
  regulatoryAffiliations: "", representativeName: "", representativeEmail: "",
  joiningReasons: [] as string[], declaration: false, signatureName: "",
  date: new Date().toISOString().split("T")[0],
};

function InputField({ label, type = "text", value, onChange, required = true, placeholder = "", error }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  required?: boolean; placeholder?: string; error?: string;
}) {
  return (
    <div>
      <label className="label">{label} {required && <span className="text-red-400">*</span>}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        placeholder={placeholder}
        className={`input ${error ? "input-error" : ""}`} />
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder = "Select...", required = true, error }: {
  label: string; value: string; onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder?: string; required?: boolean; error?: string;
}) {
  return (
    <div>
      <label className="label">{label} {required && <span className="text-red-400">*</span>}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className={`input bg-white ${error ? "input-error" : ""}`}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}

function CheckboxGroup({ label, options, selected, onChange }: {
  label: string; options: readonly { value: string; label: string }[];
  selected: string[]; onChange: (selected: string[]) => void;
}) {
  return (
    <fieldset>
      <legend className="label mb-2">{label}</legend>
      <div className="grid sm:grid-cols-2 gap-2">
        {options.map((opt) => (
          <label key={opt.value}
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
              selected.includes(opt.value) ? "border-teal-300 bg-teal-50/50" : "border-gray-200"
            }`}>
            <input type="checkbox" checked={selected.includes(opt.value)}
              onChange={(e) => onChange(e.target.checked ? [...selected, opt.value] : selected.filter((v) => v !== opt.value))}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RadioGroup({ label, options, value, onChange }: {
  label: string; options: readonly { value: string; label: string }[];
  value: string; onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="label mb-2">{label}</legend>
      <div className="grid sm:grid-cols-2 gap-2">
        {options.map((opt) => (
          <label key={opt.value}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
              value === opt.value ? "border-teal-300 bg-teal-50/50" : "border-gray-200"
            }`}>
            <input type="radio" name={label} checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const STEPS = [
  { num: 1, label: "Contact", desc: "Personal details & category" },
  { num: 2, label: "Details", desc: "Category-specific info" },
  { num: 3, label: "Declaration", desc: "Alignment & agreement" },
];

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = (field: string, value: any) => {
    setFormData((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!formData.firstName.trim()) e.firstName = "Required";
      if (!formData.lastName.trim()) e.lastName = "Required";
      if (!formData.email.trim()) e.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email";
      if (!formData.phone.trim()) e.phone = "Required";
      if (!formData.address.trim()) e.address = "Required";
      if (!formData.category) e.category = "Required";
    }
    if (step === 2) {
      const cat = formData.category as MembershipCategory;
      if (cat === MembershipCategory.TECHNICIAN) {
        if (!formData.qualifications.trim()) e.qualifications = "Required";
        if (formData.yearsOfExperience === "" || Number(formData.yearsOfExperience) < 0) e.yearsOfExperience = "Valid number";
        if (formData.expertiseAreas.length === 0) e.expertiseAreas = "Select at least one";
      } else if (cat === MembershipCategory.STUDENT) {
        if (!formData.institution.trim()) e.institution = "Required";
        if (!formData.programme.trim()) e.programme = "Required";
        if (!formData.expectedGraduation) e.expectedGraduation = "Required";
        if (!formData.careerInterest) e.careerInterest = "Required";
      } else if (cat === MembershipCategory.NON_TECHNICAL) {
        if (!formData.jobTitle.trim()) e.jobTitle = "Required";
        if (!formData.employer.trim()) e.employer = "Required";
        if (!formData.sectorFocus) e.sectorFocus = "Required";
        if (!formData.joiningGoal.trim()) e.joiningGoal = "Required";
      } else if (cat === MembershipCategory.CORPORATE) {
        if (!formData.companyName.trim()) e.companyName = "Required";
        if (!formData.coreBusinessActivity) e.coreBusinessActivity = "Required";
        if (!formData.totalEmployees || Number(formData.totalEmployees) < 1) e.totalEmployees = "At least 1";
        if (formData.activeFieldTechnicians === "" || Number(formData.activeFieldTechnicians) < 0) e.activeFieldTechnicians = "Required";
        if (!formData.representativeName.trim()) e.representativeName = "Required";
        if (!formData.representativeEmail.trim()) e.representativeEmail = "Required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.representativeEmail)) e.representativeEmail = "Invalid email";
      }
    }
    if (step === 3) {
      if (formData.joiningReasons.length === 0) e.joiningReasons = "Select at least one reason";
      if (!formData.declaration) e.declaration = "You must accept the declaration";
      if (!formData.signatureName.trim()) e.signatureName = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true); setSubmitError("");
    try {
      const payload = { ...formData, yearsOfExperience: Number(formData.yearsOfExperience) || 0,
        totalEmployees: Number(formData.totalEmployees) || 0, activeFieldTechnicians: Number(formData.activeFieldTechnicians) || 0, declaration: true };
      const fd = new FormData();
      fd.append("data", JSON.stringify(payload));
      const result = await submitApplication(fd);
      result.success ? setSubmitted(true) : setSubmitError(result.error || "Submission failed.");
    } catch { setSubmitError("An unexpected error occurred."); }
    finally { setSubmitting(false); }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-teal-50 px-4">
        <div className="animate-scale-in max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0f3b5e] mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for applying to HEVACRAZ. Your application has been received and will be reviewed by our team.
            A confirmation email will be sent to <strong className="text-gray-700">{formData.email}</strong>.
          </p>
          <button onClick={() => router.push("/")} className="btn-primary btn-md">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const cat = formData.category as MembershipCategory;
  const stepLabels = ["Contact Information", "Category Details", "Declaration"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="HEVACRAZ" width={32} height={32}
              className="rounded-lg" />
            <span className="text-sm font-semibold text-[#0f3b5e]">HEVACRAZ Application</span>
          </div>
          <span className="text-xs text-gray-400">Step {step} of 3</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        {/* Step progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex flex-col items-center">
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  s.num === step ? "bg-teal-500 text-white ring-4 ring-teal-100" :
                  s.num < step ? "bg-teal-100 text-teal-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {s.num < step ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s.num}
                </div>
                <span className={`text-xs mt-2 font-medium ${s.num === step ? "text-teal-600" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          {/* Connecting lines */}
          <div className="relative max-w-md mx-auto -mt-[52px] z-[-1]">
            <div className="flex justify-between px-[18px]">
              {[1, 2].map((i) => (
                <div key={i} className="flex-1 flex justify-center">
                  <div className={`h-0.5 w-full max-w-[80px] rounded-full transition-colors duration-300 ${
                    i < step ? "bg-teal-400" : "bg-gray-200"
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10">
          {/* Step heading */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#0f3b5e]">
              Step {step}: {stepLabels[step - 1]}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {step === 1 && "Please provide your personal contact details and select your membership category."}
              {step === 2 && `Provide details specific to your selected ${cat?.replace(/_/g, " ").toLowerCase() || ""} membership category.`}
              {step === 3 && "Tell us why you want to join and complete the declaration."}
            </p>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="First Name" value={formData.firstName} onChange={(v) => update("firstName", v)} error={errors.firstName} />
                <InputField label="Last Name" value={formData.lastName} onChange={(v) => update("lastName", v)} error={errors.lastName} />
              </div>
              <InputField label="Email Address" type="email" value={formData.email} onChange={(v) => update("email", v)} error={errors.email} />
              <InputField label="Phone Number" value={formData.phone} onChange={(v) => update("phone", v)} placeholder="+260 XXX XXX XXX" error={errors.phone} />
              <div>
                <label className="label">Physical / Postal Address <span className="text-red-400">*</span></label>
                <textarea value={formData.address} onChange={(e) => update("address", e.target.value)} required rows={3}
                  className={`input ${errors.address ? "input-error" : ""}`} />
                {errors.address && <p className="text-red-500 text-xs mt-1.5">{errors.address}</p>}
              </div>
              <SelectField label="Membership Category" value={formData.category} onChange={(v) => update("category", v)}
                options={MEMBERSHIP_CATEGORIES} error={errors.category} />
            </div>
          )}

          {/* Step 2 — Technician */}
          {step === 2 && cat === MembershipCategory.TECHNICIAN && (
            <div className="space-y-5 animate-slide-up">
              <InputField label="Trade Qualifications / Certifications" value={formData.qualifications} onChange={(v) => update("qualifications", v)} error={errors.qualifications} />
              <InputField label="Years of Active Experience" type="number" value={formData.yearsOfExperience} onChange={(v) => update("yearsOfExperience", v)} error={errors.yearsOfExperience} />
              <CheckboxGroup label="Primary Areas of Expertise" options={EXPERTISE_AREAS} selected={formData.expertiseAreas} onChange={(v) => update("expertiseAreas", v)} />
              {errors.expertiseAreas && <p className="text-red-500 text-xs -mt-3">{errors.expertiseAreas}</p>}
              <CheckboxGroup label="Refrigerant Handling Certifications" options={REFRIGERANT_CERTIFICATIONS} selected={formData.refrigerantCertifications} onChange={(v) => update("refrigerantCertifications", v)} />
            </div>
          )}

          {/* Step 2 — Student */}
          {step === 2 && cat === MembershipCategory.STUDENT && (
            <div className="space-y-5 animate-slide-up">
              <InputField label="Educational Institution" value={formData.institution} onChange={(v) => update("institution", v)} error={errors.institution} />
              <InputField label="Current Programme / Course of Study" value={formData.programme} onChange={(v) => update("programme", v)} error={errors.programme} />
              <InputField label="Expected Graduation Date" type="date" value={formData.expectedGraduation} onChange={(v) => update("expectedGraduation", v)} error={errors.expectedGraduation} />
              <RadioGroup label="Primary Career Interest" options={CAREER_INTERESTS} value={formData.careerInterest} onChange={(v) => update("careerInterest", v)} />
              {errors.careerInterest && <p className="text-red-500 text-xs -mt-3">{errors.careerInterest}</p>}
            </div>
          )}

          {/* Step 2 — Non Technical */}
          {step === 2 && cat === MembershipCategory.NON_TECHNICAL && (
            <div className="space-y-5 animate-slide-up">
              <InputField label="Current Job Title" value={formData.jobTitle} onChange={(v) => update("jobTitle", v)} error={errors.jobTitle} />
              <InputField label="Current Employer" value={formData.employer} onChange={(v) => update("employer", v)} error={errors.employer} />
              <RadioGroup label="Sector Focus" options={SECTOR_FOCUSES} value={formData.sectorFocus} onChange={(v) => update("sectorFocus", v)} />
              {errors.sectorFocus && <p className="text-red-500 text-xs -mt-3">{errors.sectorFocus}</p>}
              <InputField label="Primary Goal of Joining" value={formData.joiningGoal} onChange={(v) => update("joiningGoal", v)} error={errors.joiningGoal} />
            </div>
          )}

          {/* Step 2 — Corporate */}
          {step === 2 && cat === MembershipCategory.CORPORATE && (
            <div className="space-y-5 animate-slide-up">
              <InputField label="Registered Company Name" value={formData.companyName} onChange={(v) => update("companyName", v)} error={errors.companyName} />
              <RadioGroup label="Core Business Activity" options={CORE_BUSINESS_ACTIVITIES} value={formData.coreBusinessActivity} onChange={(v) => update("coreBusinessActivity", v)} />
              {errors.coreBusinessActivity && <p className="text-red-500 text-xs -mt-3">{errors.coreBusinessActivity}</p>}
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Total Employees" type="number" value={formData.totalEmployees} onChange={(v) => update("totalEmployees", v)} error={errors.totalEmployees} />
                <InputField label="Active Field Technicians" type="number" value={formData.activeFieldTechnicians} onChange={(v) => update("activeFieldTechnicians", v)} error={errors.activeFieldTechnicians} />
              </div>
              <InputField label="Regulatory / Standard Affiliations" value={formData.regulatoryAffiliations} onChange={(v) => update("regulatoryAffiliations", v)} required={false} />
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Corporate Representative Name" value={formData.representativeName} onChange={(v) => update("representativeName", v)} error={errors.representativeName} />
                <InputField label="Corporate Representative Email" type="email" value={formData.representativeEmail} onChange={(v) => update("representativeEmail", v)} error={errors.representativeEmail} />
              </div>
            </div>
          )}

          {step === 2 && !cat && (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Please select a membership category in Step 1 first.</p>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-slide-up">
              <CheckboxGroup label="Reasons for Joining" options={JOINING_REASONS} selected={formData.joiningReasons} onChange={(v) => update("joiningReasons", v)} />
              {errors.joiningReasons && <p className="text-red-500 text-xs -mt-4">{errors.joiningReasons}</p>}

              <div className="divider" />
              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.declaration}
                    onChange={(e) => update("declaration", e.target.checked)}
                    className="mt-0.5 h-5 w-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    I hereby declare that the information provided in this application is true and correct to the
                    best of my knowledge. I agree to abide by the constitution, rules, and regulations of HEVACRAZ.
                    <span className="text-red-400 font-medium"> *</span>
                  </span>
                </label>
                {errors.declaration && <p className="text-red-500 text-xs mt-2 ml-8">{errors.declaration}</p>}
              </div>

              <InputField label="Signature (Type your full name)" value={formData.signatureName}
                onChange={(v) => update("signatureName", v)} error={errors.signatureName}
                placeholder="e.g. John Doe" />

              <InputField label="Date" type="date" value={formData.date}
                onChange={(v) => update("date", v)} required={false} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 divider">
            <div>
              {step > 1 && (
                <button onClick={() => { setStep((s) => s - 1); setErrors({}); }}
                  className="btn-outline btn-md">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
            </div>
            <div>
              {step < 3 ? (
                <button onClick={() => { if (validate()) setStep((s) => s + 1); }}
                  className="btn-accent btn-md">
                  Continue
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting}
                  className="btn-primary btn-md min-w-[160px]">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : "Submit Application"}
                </button>
              )}
            </div>
          </div>

          {submitError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{submitError}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
