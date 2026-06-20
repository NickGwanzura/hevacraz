"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ApplicationStatus, MembershipCategory } from "@/lib/enums";
import { CATEGORY_CODE } from "@/lib/constants";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

async function getAdminId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

async function logAudit(adminId: string, action: string, entityType: string, entityId: string, details?: string) {
  await prisma.auditLog.create({
    data: { action, entityType, entityId, adminId, details },
  });
}

export async function getApplications(params: {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const { search, category, status, page = 1, limit = 20 } = params;

  const where: any = {};

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { membershipNumber: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category && category !== "ALL") {
    where.category = category as MembershipCategory;
  }

  if (status && status !== "ALL") {
    where.status = status as ApplicationStatus;
  }

  const [applications, total] = await Promise.all([
    prisma.memberApplication.findMany({
      where,
      include: {
        technicianProfile: true,
        studentProfile: true,
        nonTechnicalProfile: true,
        corporateProfile: true,
        adminNotes: { orderBy: { createdAt: "desc" }, take: 5 },
      },
      orderBy: { applicationDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.memberApplication.count({ where }),
  ]);

  return { applications, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getApplicationById(id: string) {
  return prisma.memberApplication.findUnique({
    where: { id },
    include: {
      technicianProfile: true,
      studentProfile: true,
      nonTechnicalProfile: true,
      corporateProfile: true,
      adminNotes: {
        include: { admin: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function approveApplication(id: string) {
  const adminId = await getAdminId();

  const application = await prisma.memberApplication.findUnique({ where: { id } });
  if (!application) throw new Error("Application not found");

  // Generate membership number
  const year = new Date().getFullYear().toString();
  const categoryCode = CATEGORY_CODE[application.category as MembershipCategory];

  // Find the current count for this category and year
  const existingCount = await prisma.memberApplication.count({
    where: {
      category: application.category,
      status: ApplicationStatus.APPROVED,
      membershipNumber: { startsWith: `HEVACRAZ-${categoryCode}-${year}` },
    },
  });

  const sequence = String(existingCount + 1).padStart(4, "0");
  const membershipNumber = `HEVACRAZ-${categoryCode}-${year}-${sequence}`;

  const updated = await prisma.memberApplication.update({
    where: { id },
    data: {
      status: ApplicationStatus.APPROVED,
      approvalDate: new Date(),
      membershipNumber,
      reviewedBy: adminId,
    },
  });

  await logAudit(adminId, "APPROVE", "MemberApplication", id, `Approved as ${membershipNumber}`);

  // Send email
  sendApprovalEmail(application.email, `${application.firstName} ${application.lastName}`, membershipNumber).catch(console.error);

  revalidatePath("/admin");
  return updated;
}

export async function rejectApplication(id: string) {
  const adminId = await getAdminId();

  const application = await prisma.memberApplication.findUnique({ where: { id } });
  if (!application) throw new Error("Application not found");

  const updated = await prisma.memberApplication.update({
    where: { id },
    data: {
      status: ApplicationStatus.REJECTED,
      rejectionDate: new Date(),
      reviewedBy: adminId,
    },
  });

  await logAudit(adminId, "REJECT", "MemberApplication", id);

  sendRejectionEmail(application.email, `${application.firstName} ${application.lastName}`).catch(console.error);

  revalidatePath("/admin");
  return updated;
}

export async function markUnderReview(id: string) {
  const adminId = await getAdminId();
  const updated = await prisma.memberApplication.update({
    where: { id },
    data: { status: ApplicationStatus.UNDER_REVIEW, reviewedBy: adminId },
  });
  await logAudit(adminId, "UNDER_REVIEW", "MemberApplication", id);
  revalidatePath("/admin");
  return updated;
}

export async function suspendMember(id: string) {
  const adminId = await getAdminId();
  const updated = await prisma.memberApplication.update({
    where: { id },
    data: { status: ApplicationStatus.SUSPENDED },
  });
  await logAudit(adminId, "SUSPEND", "MemberApplication", id);
  revalidatePath("/admin");
  return updated;
}

export async function addAdminNote(applicationId: string, content: string) {
  const adminId = await getAdminId();
  const note = await prisma.adminNote.create({
    data: { applicationId, adminId, content },
    include: { admin: { select: { name: true, email: true } } },
  });
  revalidatePath("/admin");
  return note;
}

export async function getDashboardStats() {
  const [
    totalMembers,
    pendingApplications,
    approvedMembers,
    rejectedApplications,
    membersByCategory,
    technicianExpertise,
    corporateMembers,
    refrigerantStats,
    recentApplications,
  ] = await Promise.all([
    prisma.memberApplication.count({ where: { status: ApplicationStatus.APPROVED } }),
    prisma.memberApplication.count({ where: { status: ApplicationStatus.PENDING } }),
    prisma.memberApplication.count({ where: { status: ApplicationStatus.APPROVED } }),
    prisma.memberApplication.count({ where: { status: ApplicationStatus.REJECTED } }),
    prisma.memberApplication.groupBy({
      by: ["category"],
      _count: true,
      where: { status: ApplicationStatus.APPROVED },
    }),
    prisma.technicianProfile.findMany({
      include: { application: { select: { status: true } } },
      where: { application: { status: ApplicationStatus.APPROVED } },
    }),
    prisma.memberApplication.count({
      where: { category: MembershipCategory.CORPORATE, status: ApplicationStatus.APPROVED },
    }),
    prisma.technicianProfile.findMany({
      where: { application: { status: ApplicationStatus.APPROVED } },
      select: { refrigerantCertifications: true },
    }),
    prisma.memberApplication.findMany({
      orderBy: { applicationDate: "desc" },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        category: true,
        status: true,
        applicationDate: true,
        membershipNumber: true,
      },
    }),
  ]);

  // Calculate expertise distribution
  const expertiseCount: Record<string, number> = {};
  technicianExpertise.forEach((t) => {
    const areas: string[] = JSON.parse(t.expertiseAreas || "[]");
    areas.forEach((area) => {
      expertiseCount[area] = (expertiseCount[area] || 0) + 1;
    });
  });

  // Calculate refrigerant certification counts
  const refrigerantCount: Record<string, number> = {};
  refrigerantStats.forEach((t) => {
    const certs: string[] = JSON.parse(t.refrigerantCertifications || "[]");
    certs.forEach((cert) => {
      refrigerantCount[cert] = (refrigerantCount[cert] || 0) + 1;
    });
  });

  // Student institutions
  const studentProfiles = await prisma.studentProfile.findMany({
    where: { application: { status: ApplicationStatus.APPROVED } },
    select: { institution: true },
  });
  const institutionCount: Record<string, number> = {};
  studentProfiles.forEach((s) => {
    institutionCount[s.institution] = (institutionCount[s.institution] || 0) + 1;
  });

  return {
    totalMembers,
    pendingApplications,
    approvedMembers,
    rejectedApplications,
    membersByCategory,
    expertiseCount,
    corporateMembers,
    refrigerantCount,
    institutionCount,
    recentApplications,
  };
}

export async function exportMembersCSV() {
  const members = await prisma.memberApplication.findMany({
    where: { status: ApplicationStatus.APPROVED },
    include: {
      technicianProfile: true,
      studentProfile: true,
      nonTechnicalProfile: true,
      corporateProfile: true,
    },
    orderBy: { membershipNumber: "asc" },
  });

  return members.map((m) => ({
    "Membership Number": m.membershipNumber || "",
    "First Name": m.firstName,
    "Last Name": m.lastName,
    Email: m.email,
    Phone: m.phone,
    Address: m.address,
    Category: m.category,
    Status: m.status,
    "Application Date": m.applicationDate.toISOString(),
    "Approval Date": m.approvalDate?.toISOString() || "",
    "Category Details": getCategoryDetails(m),
  }));
}

function getCategoryDetails(m: any): string {
  if (m.technicianProfile) {
    return `Technician - ${m.technicianProfile.yearsOfExperience} yrs exp`;
  }
  if (m.studentProfile) {
    return `Student - ${m.studentProfile.institution}`;
  }
  if (m.nonTechnicalProfile) {
    return `Non Technical - ${m.nonTechnicalProfile.jobTitle} at ${m.nonTechnicalProfile.employer}`;
  }
  if (m.corporateProfile) {
    return `Corporate - ${m.corporateProfile.companyName}`;
  }
  return "";
}
