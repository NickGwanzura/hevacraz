import {
  MembershipCategory,
  ApplicationStatus,
  ExpertiseArea,
  RefrigerantCertification,
  CareerInterest,
  SectorFocus,
  JoiningReason,
  CoreBusinessActivity,
} from "@/lib/enums";

export const MEMBERSHIP_CATEGORIES = [
  { value: MembershipCategory.STUDENT, label: "Student" },
  { value: MembershipCategory.TECHNICIAN, label: "Technician" },
  { value: MembershipCategory.NON_TECHNICAL, label: "Non Technical Professional" },
  { value: MembershipCategory.CORPORATE, label: "Corporate Company" },
] as const;

export const APPLICATION_STATUSES = [
  { value: ApplicationStatus.PENDING, label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: ApplicationStatus.UNDER_REVIEW, label: "Under Review", color: "bg-blue-100 text-blue-800" },
  { value: ApplicationStatus.APPROVED, label: "Approved", color: "bg-green-100 text-green-800" },
  { value: ApplicationStatus.REJECTED, label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: ApplicationStatus.SUSPENDED, label: "Suspended", color: "bg-gray-100 text-gray-800" },
] as const;

export const EXPERTISE_AREAS = [
  { value: ExpertiseArea.DOMESTIC_AC_HEAT_PUMPS, label: "Domestic AC & Heat Pumps" },
  { value: ExpertiseArea.COMMERCIAL_REFRIGERATION, label: "Commercial Refrigeration" },
  { value: ExpertiseArea.INDUSTRIAL_CHILLING, label: "Industrial Chilling" },
  { value: ExpertiseArea.VENTILATION_AIR_EXTRACTION, label: "Ventilation & Air Extraction" },
  { value: ExpertiseArea.VRF_SYSTEMS, label: "VRF Systems" },
  { value: ExpertiseArea.OTHER, label: "Other" },
] as const;

export const REFRIGERANT_CERTIFICATIONS = [
  { value: RefrigerantCertification.NATURAL_HYDROCARBONS, label: "Natural Hydrocarbons (R290/R600a)" },
  { value: RefrigerantCertification.R32, label: "R32" },
  { value: RefrigerantCertification.STANDARD_HFCS, label: "Standard HFCs (R134a/R410A)" },
] as const;

export const CAREER_INTERESTS = [
  { value: CareerInterest.CONTRACTING_SERVICE, label: "Contracting & Service" },
  { value: CareerInterest.MANUFACTURING, label: "Manufacturing" },
  { value: CareerInterest.ENGINEERING_DESIGN, label: "Engineering & Design" },
  { value: CareerInterest.SALES_DISTRIBUTION, label: "Sales & Distribution" },
] as const;

export const SECTOR_FOCUSES = [
  { value: SectorFocus.EQUIPMENT_DISTRIBUTION, label: "Equipment Distribution" },
  { value: SectorFocus.COMPONENT_SPARE_PARTS, label: "Component/Spare Parts Supply" },
  { value: SectorFocus.ADMINISTRATIVE_CONSULTING, label: "Administrative/Consulting" },
] as const;

export const JOINING_REASONS = [
  { value: JoiningReason.TECHNICAL_SEMINARS_CPD, label: "Technical Seminars & CPD" },
  { value: JoiningReason.PROFESSIONAL_NETWORKING_B2B, label: "Professional Networking & B2B Opportunities" },
  { value: JoiningReason.INDUSTRY_REGULATION_UPDATES, label: "Access to Industry Regulation Updates & Standards" },
  { value: JoiningReason.SUBMITTING_DATA_MARKET_INSIGHTS, label: "Submitting Data & Sector Market Insights" },
] as const;

export const CORE_BUSINESS_ACTIVITIES = [
  { value: CoreBusinessActivity.HVACR_CONTRACTOR, label: "HVACR Contractor" },
  { value: CoreBusinessActivity.EQUIPMENT_MANUFACTURER, label: "Equipment Manufacturer" },
  { value: CoreBusinessActivity.WHOLESALER_DISTRIBUTOR, label: "Wholesaler/Distributor" },
  { value: CoreBusinessActivity.CONSULTING_ENGINEERS, label: "Consulting Engineers" },
] as const;

export const CATEGORY_CODE: Record<MembershipCategory, string> = {
  [MembershipCategory.TECHNICIAN]: "TECH",
  [MembershipCategory.STUDENT]: "STUD",
  [MembershipCategory.NON_TECHNICAL]: "NTP",
  [MembershipCategory.CORPORATE]: "CORP",
};

export const CATEGORY_LABEL: Record<MembershipCategory, string> = {
  [MembershipCategory.TECHNICIAN]: "Technician",
  [MembershipCategory.STUDENT]: "Student",
  [MembershipCategory.NON_TECHNICAL]: "Non Technical Professional",
  [MembershipCategory.CORPORATE]: "Corporate Company",
};

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  [ApplicationStatus.PENDING]: "Pending",
  [ApplicationStatus.UNDER_REVIEW]: "Under Review",
  [ApplicationStatus.APPROVED]: "Approved",
  [ApplicationStatus.REJECTED]: "Rejected",
  [ApplicationStatus.SUSPENDED]: "Suspended",
};
