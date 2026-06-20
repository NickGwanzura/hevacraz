"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  category: "",
  // Technician
  qualifications: "",
  yearsOfExperience: "",
  expertiseAreas: [] as string[],
  refrigerantCertifications: [] as string[],
  // Student
  institution: "",
  programme: "",
  expectedGraduation: "",
  careerInterest: "",
  // Non-Technical
  jobTitle: "",
  employer: "",
  sectorFocus: "",
  joiningGoal: "",
  // Corporate
  companyName: "",
  coreBusinessActivity: "",
  totalEmployees: "",
  activeFieldTechnicians: "",
  regulatoryAffiliations: "",
  representativeName: "",
  representativeEmail: "",
  // Step 3
  joiningReasons: [] as string[],
  declaration: false,
  signatureName: "",
  date: new Date().toISOString().split("T")[0],
};

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gray-700 mb-2">{label}</legend>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt.value)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...selected, opt.value]);
                } else {
                  onChange(selected.filter((v) => v !== opt.value));
                }
              }}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RadioGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="block text-sm font-medium text-gray-700 mb-2">{label}</legend>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={label}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  required = true,
  placeholder = "",
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  required = true,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "Required";
      if (!formData.lastName.trim()) newErrors.lastName = "Required";
      if (!formData.email.trim()) newErrors.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";
      if (!formData.phone.trim()) newErrors.phone = "Required";
      if (!formData.address.trim()) newErrors.address = "Required";
      if (!formData.category) newErrors.category = "Required";
    }

    if (step === 2) {
      const cat = formData.category as MembershipCategory;
      if (cat === MembershipCategory.TECHNICIAN) {
        if (!formData.qualifications.trim()) newErrors.qualifications = "Required";
        if (!formData.yearsOfExperience || Number(formData.yearsOfExperience) < 0) newErrors.yearsOfExperience = "Valid number required";
        if (formData.expertiseAreas.length === 0) newErrors.expertiseAreas = "Select at least one";
      } else if (cat === MembershipCategory.STUDENT) {
        if (!formData.institution.trim()) newErrors.institution = "Required";
        if (!formData.programme.trim()) newErrors.programme = "Required";
        if (!formData.expectedGraduation) newErrors.expectedGraduation = "Required";
        if (!formData.careerInterest) newErrors.careerInterest = "Required";
      } else if (cat === MembershipCategory.NON_TECHNICAL) {
        if (!formData.jobTitle.trim()) newErrors.jobTitle = "Required";
        if (!formData.employer.trim()) newErrors.employer = "Required";
        if (!formData.sectorFocus) newErrors.sectorFocus = "Required";
        if (!formData.joiningGoal.trim()) newErrors.joiningGoal = "Required";
      } else if (cat === MembershipCategory.CORPORATE) {
        if (!formData.companyName.trim()) newErrors.companyName = "Required";
        if (!formData.coreBusinessActivity) newErrors.coreBusinessActivity = "Required";
        if (!formData.totalEmployees || Number(formData.totalEmployees) < 1) newErrors.totalEmployees = "At least 1";
        if (formData.activeFieldTechnicians === "" || Number(formData.activeFieldTechnicians) < 0) newErrors.activeFieldTechnicians = "Required";
        if (!formData.representativeName.trim()) newErrors.representativeName = "Required";
        if (!formData.representativeEmail.trim()) newErrors.representativeEmail = "Required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.representativeEmail)) newErrors.representativeEmail = "Invalid email";
      }
    }

    if (step === 3) {
      if (formData.joiningReasons.length === 0) newErrors.joiningReasons = "Select at least one reason";
      if (!formData.declaration) newErrors.declaration = "You must accept the declaration";
      if (!formData.signatureName.trim()) newErrors.signatureName = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = { ...formData };
      // Convert numeric fields
      if (payload.yearsOfExperience) payload.yearsOfExperience = Number(payload.yearsOfExperience);
      if (payload.totalEmployees) payload.totalEmployees = Number(payload.totalEmployees);
      if (payload.activeFieldTechnicians) payload.activeFieldTechnicians = Number(payload.activeFieldTechnicians);
      payload.declaration = true;

      const fd = new FormData();
      fd.append("data", JSON.stringify(payload));

      const result = await submitApplication(fd);

      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmitError(result.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0f3b5e] mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for applying to HEVACRAZ. Your application has been received and will be reviewed by our team.
            You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-[#0f3b5e] text-white rounded-lg hover:bg-[#1a5a8a] transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const cat = formData.category as MembershipCategory;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#0f3b5e] rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f3b5e]">HEVACRAZ Membership Application</h1>
          <p className="text-gray-500 text-sm mt-1">Complete all steps to apply</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? "bg-teal-500 text-white"
                    : step > s
                    ? "bg-teal-100 text-teal-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s ? "✓" : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 sm:w-20 h-1 mx-1 rounded ${
                    step > s ? "bg-teal-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Step labels */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#0f3b5e]">
              {step === 1 && "Step 1: General Contact Information"}
              {step === 2 && "Step 2: Category-Specific Information"}
              {step === 3 && "Step 3: Professional Alignment & Declaration"}
            </h2>
            <p className="text-sm text-gray-500">
              {step === 1 && "Please provide your personal contact details and select your membership category."}
              {step === 2 && "Provide details specific to your selected membership category."}
              {step === 3 && "Tell us why you want to join and accept the declaration."}
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(v) => updateField("firstName", v)}
                  error={errors.firstName}
                />
                <InputField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(v) => updateField("lastName", v)}
                  error={errors.lastName}
                />
              </div>
              <InputField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(v) => updateField("email", v)}
                error={errors.email}
              />
              <InputField
                label="Phone Number"
                value={formData.phone}
                onChange={(v) => updateField("phone", v)}
                placeholder="+260 XXX XXX XXX"
                error={errors.phone}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Physical/Postal Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  required
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.address ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <SelectField
                label="Membership Category"
                value={formData.category}
                onChange={(v) => updateField("category", v)}
                options={MEMBERSHIP_CATEGORIES}
                error={errors.category}
              />
            </div>
          )}

          {step === 2 && cat === MembershipCategory.TECHNICIAN && (
            <div className="space-y-4">
              <InputField
                label="Trade Qualifications / Certifications"
                value={formData.qualifications}
                onChange={(v) => updateField("qualifications", v)}
                error={errors.qualifications}
              />
              <InputField
                label="Years of Active Experience"
                type="number"
                value={formData.yearsOfExperience}
                onChange={(v) => updateField("yearsOfExperience", v)}
                error={errors.yearsOfExperience}
              />
              <CheckboxGroup
                label="Primary Areas of Expertise"
                options={EXPERTISE_AREAS}
                selected={formData.expertiseAreas}
                onChange={(v) => updateField("expertiseAreas", v)}
              />
              {errors.expertiseAreas && <p className="text-red-500 text-xs">{errors.expertiseAreas}</p>}
              <CheckboxGroup
                label="Refrigerant Handling Certifications"
                options={REFRIGERANT_CERTIFICATIONS}
                selected={formData.refrigerantCertifications}
                onChange={(v) => updateField("refrigerantCertifications", v)}
              />
            </div>
          )}

          {step === 2 && cat === MembershipCategory.STUDENT && (
            <div className="space-y-4">
              <InputField
                label="Educational Institution"
                value={formData.institution}
                onChange={(v) => updateField("institution", v)}
                error={errors.institution}
              />
              <InputField
                label="Current Programme / Course of Study"
                value={formData.programme}
                onChange={(v) => updateField("programme", v)}
                error={errors.programme}
              />
              <InputField
                label="Expected Graduation Date"
                type="date"
                value={formData.expectedGraduation}
                onChange={(v) => updateField("expectedGraduation", v)}
                error={errors.expectedGraduation}
              />
              <RadioGroup
                label="Primary Career Interest"
                options={CAREER_INTERESTS}
                value={formData.careerInterest}
                onChange={(v) => updateField("careerInterest", v)}
              />
              {errors.careerInterest && <p className="text-red-500 text-xs">{errors.careerInterest}</p>}
            </div>
          )}

          {step === 2 && cat === MembershipCategory.NON_TECHNICAL && (
            <div className="space-y-4">
              <InputField
                label="Current Job Title"
                value={formData.jobTitle}
                onChange={(v) => updateField("jobTitle", v)}
                error={errors.jobTitle}
              />
              <InputField
                label="Current Employer"
                value={formData.employer}
                onChange={(v) => updateField("employer", v)}
                error={errors.employer}
              />
              <RadioGroup
                label="Sector Focus"
                options={SECTOR_FOCUSES}
                value={formData.sectorFocus}
                onChange={(v) => updateField("sectorFocus", v)}
              />
              {errors.sectorFocus && <p className="text-red-500 text-xs">{errors.sectorFocus}</p>}
              <InputField
                label="Primary Goal of Joining"
                value={formData.joiningGoal}
                onChange={(v) => updateField("joiningGoal", v)}
                error={errors.joiningGoal}
              />
            </div>
          )}

          {step === 2 && cat === MembershipCategory.CORPORATE && (
            <div className="space-y-4">
              <InputField
                label="Registered Company Name"
                value={formData.companyName}
                onChange={(v) => updateField("companyName", v)}
                error={errors.companyName}
              />
              <RadioGroup
                label="Core Business Activity"
                options={CORE_BUSINESS_ACTIVITIES}
                value={formData.coreBusinessActivity}
                onChange={(v) => updateField("coreBusinessActivity", v)}
              />
              {errors.coreBusinessActivity && <p className="text-red-500 text-xs">{errors.coreBusinessActivity}</p>}
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Total Number of Employees"
                  type="number"
                  value={formData.totalEmployees}
                  onChange={(v) => updateField("totalEmployees", v)}
                  error={errors.totalEmployees}
                />
                <InputField
                  label="Number of Active Field Technicians"
                  type="number"
                  value={formData.activeFieldTechnicians}
                  onChange={(v) => updateField("activeFieldTechnicians", v)}
                  error={errors.activeFieldTechnicians}
                />
              </div>
              <InputField
                label="Regulatory/Standard Affiliations"
                value={formData.regulatoryAffiliations}
                onChange={(v) => updateField("regulatoryAffiliations", v)}
                required={false}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField
                  label="Designated Corporate Representative Name"
                  value={formData.representativeName}
                  onChange={(v) => updateField("representativeName", v)}
                  error={errors.representativeName}
                />
                <InputField
                  label="Designated Corporate Representative Email"
                  type="email"
                  value={formData.representativeEmail}
                  onChange={(v) => updateField("representativeEmail", v)}
                  error={errors.representativeEmail}
                />
              </div>
            </div>
          )}

          {step === 2 && !cat && (
            <div className="text-center py-8 text-gray-500">
              <p>Please select a membership category in Step 1 first.</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <CheckboxGroup
                label="Reasons for Joining"
                options={JOINING_REASONS}
                selected={formData.joiningReasons}
                onChange={(v) => updateField("joiningReasons", v)}
              />
              {errors.joiningReasons && <p className="text-red-500 text-xs">{errors.joiningReasons}</p>}

              <div className="border-t pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.declaration}
                    onChange={(e) => updateField("declaration", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">
                    I hereby declare that the information provided in this application is true and correct to the
                    best of my knowledge. I agree to abide by the constitution, rules, and regulations of HEVACRAZ.
                    <span className="text-red-500"> *</span>
                  </span>
                </label>
                {errors.declaration && <p className="text-red-500 text-xs mt-1">{errors.declaration}</p>}
              </div>

              <InputField
                label="Signature Name (Type your full name)"
                value={formData.signatureName}
                onChange={(v) => updateField("signatureName", v)}
                error={errors.signatureName}
              />

              <InputField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(v) => updateField("date", v)}
                required={false}
              />
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div>
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Back
                </button>
              )}
            </div>
            <div>
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-2 bg-[#0f3b5e] text-white rounded-lg hover:bg-[#1a5a8a] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </div>

          {submitError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
