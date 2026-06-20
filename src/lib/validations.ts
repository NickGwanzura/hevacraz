import { z } from "zod";
import {
  MembershipCategory,
  ExpertiseArea,
  RefrigerantCertification,
  CareerInterest,
  SectorFocus,
  JoiningReason,
  CoreBusinessActivity,
} from "@/lib/enums";

const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;

export const step1Schema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Valid email is required"),
  phone: z.string().regex(phoneRegex, "Valid phone number is required"),
  address: z.string().min(1, "Address is required").max(500),
  category: z.nativeEnum(MembershipCategory),
});

export const technicianSchema = z.object({
  qualifications: z.string().min(1, "Qualifications/certifications are required"),
  yearsOfExperience: z.coerce.number().min(0, "Must be 0 or more").max(70),
  expertiseAreas: z.array(z.nativeEnum(ExpertiseArea)).min(1, "Select at least one area"),
  refrigerantCertifications: z.array(z.nativeEnum(RefrigerantCertification)).optional(),
});

export const studentSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  programme: z.string().min(1, "Programme/course is required"),
  expectedGraduation: z.string().min(1, "Expected graduation date is required"),
  careerInterest: z.nativeEnum(CareerInterest),
});

export const nonTechnicalSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  employer: z.string().min(1, "Employer is required"),
  sectorFocus: z.nativeEnum(SectorFocus),
  joiningGoal: z.string().min(1, "Primary goal is required"),
});

export const corporateSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  coreBusinessActivity: z.nativeEnum(CoreBusinessActivity),
  totalEmployees: z.coerce.number().min(1, "At least 1 employee required"),
  activeFieldTechnicians: z.coerce.number().min(0, "Must be 0 or more"),
  regulatoryAffiliations: z.string().optional(),
  representativeName: z.string().min(1, "Representative name is required"),
  representativeEmail: z.string().email("Valid email is required"),
});

export const step3Schema = z.object({
  joiningReasons: z.array(z.nativeEnum(JoiningReason)).min(1, "Select at least one reason"),
  declaration: z.literal(true, { message: "You must accept the declaration" }),
  signatureName: z.string().min(1, "Signature name is required"),
  date: z.string().min(1, "Date is required"),
});

export const fullApplicationSchema = step1Schema
  .and(step3Schema)
  .and(
    z.union([
      technicianSchema,
      studentSchema,
      nonTechnicalSchema,
      corporateSchema,
    ])
  );

export type Step1Data = z.infer<typeof step1Schema>;
export type TechnicianData = z.infer<typeof technicianSchema>;
export type StudentData = z.infer<typeof studentSchema>;
export type NonTechnicalData = z.infer<typeof nonTechnicalSchema>;
export type CorporateData = z.infer<typeof corporateSchema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type FullApplicationData = z.infer<typeof fullApplicationSchema>;
