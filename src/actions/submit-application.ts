"use server";

import { prisma } from "@/lib/prisma";
import { MembershipCategory, ApplicationStatus } from "@/lib/enums";
import { sendApplicationConfirmation, sendNewApplicationAlert } from "@/lib/email";
import { step1Schema, technicianSchema, studentSchema, nonTechnicalSchema, corporateSchema, step3Schema } from "@/lib/validations";

export async function submitApplication(formData: FormData) {
  const rawData = JSON.parse(formData.get("data") as string);

  // Validate step 1
  const step1Result = step1Schema.safeParse(rawData);
  if (!step1Result.success) {
    return { success: false, error: "Step 1 validation failed", details: step1Result.error.flatten() };
  }

  // Validate step 3
  const step3Result = step3Schema.safeParse(rawData);
  if (!step3Result.success) {
    return { success: false, error: "Step 3 validation failed", details: step3Result.error.flatten() };
  }

  // Validate category-specific data
  let categoryData: Record<string, any> = {};
  const category = rawData.category as MembershipCategory;

  switch (category) {
    case MembershipCategory.TECHNICIAN: {
      const result = technicianSchema.safeParse(rawData);
      if (!result.success) return { success: false, error: "Technician data invalid", details: result.error.flatten() };
      categoryData = result.data;
      break;
    }
    case MembershipCategory.STUDENT: {
      const result = studentSchema.safeParse(rawData);
      if (!result.success) return { success: false, error: "Student data invalid", details: result.error.flatten() };
      categoryData = result.data;
      break;
    }
    case MembershipCategory.NON_TECHNICAL: {
      const result = nonTechnicalSchema.safeParse(rawData);
      if (!result.success) return { success: false, error: "Non-technical data invalid", details: result.error.flatten() };
      categoryData = result.data;
      break;
    }
    case MembershipCategory.CORPORATE: {
      const result = corporateSchema.safeParse(rawData);
      if (!result.success) return { success: false, error: "Corporate data invalid", details: result.error.flatten() };
      categoryData = result.data;
      break;
    }
  }

  try {
    const application = await prisma.memberApplication.create({
      data: {
        firstName: rawData.firstName,
        lastName: rawData.lastName,
        email: rawData.email,
        phone: rawData.phone,
        address: rawData.address,
        category: rawData.category as MembershipCategory,
        joiningReasons: JSON.stringify(rawData.joiningReasons),
        declaration: rawData.declaration === true || rawData.declaration === "true",
        signatureName: rawData.signatureName,
        status: ApplicationStatus.PENDING,
        ...(category === MembershipCategory.TECHNICIAN && {
          technicianProfile: {
            create: {
              qualifications: categoryData.qualifications,
              yearsOfExperience: Number(categoryData.yearsOfExperience),
              expertiseAreas: JSON.stringify(categoryData.expertiseAreas),
              refrigerantCertifications: JSON.stringify(categoryData.refrigerantCertifications || []),
            },
          },
        }),
        ...(category === MembershipCategory.STUDENT && {
          studentProfile: {
            create: {
              institution: categoryData.institution,
              programme: categoryData.programme,
              expectedGraduation: new Date(categoryData.expectedGraduation),
              careerInterest: categoryData.careerInterest,
            },
          },
        }),
        ...(category === MembershipCategory.NON_TECHNICAL && {
          nonTechnicalProfile: {
            create: {
              jobTitle: categoryData.jobTitle,
              employer: categoryData.employer,
              sectorFocus: categoryData.sectorFocus,
              joiningGoal: categoryData.joiningGoal,
            },
          },
        }),
        ...(category === MembershipCategory.CORPORATE && {
          corporateProfile: {
            create: {
              companyName: categoryData.companyName,
              coreBusinessActivity: categoryData.coreBusinessActivity,
              totalEmployees: Number(categoryData.totalEmployees),
              activeFieldTechnicians: Number(categoryData.activeFieldTechnicians),
              regulatoryAffiliations: categoryData.regulatoryAffiliations || "",
              representativeName: categoryData.representativeName,
              representativeEmail: categoryData.representativeEmail,
            },
          },
        }),
      },
      include: {
        technicianProfile: true,
        studentProfile: true,
        nonTechnicalProfile: true,
        corporateProfile: true,
      },
    });

    // Send emails (non-blocking)
    const fullName = `${rawData.firstName} ${rawData.lastName}`;
    const catLabel = category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    Promise.all([
      sendApplicationConfirmation(rawData.email, fullName, application.id),
      sendNewApplicationAlert(fullName, catLabel),
    ]).catch((e) => console.error("Email sending failed:", e));

    return { success: true, applicationId: application.id };
  } catch (error) {
    console.error("Application submission error:", error);
    return { success: false, error: "Failed to submit application. Please try again." };
  }
}
