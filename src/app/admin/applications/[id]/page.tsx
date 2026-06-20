import { getApplicationById, approveApplication, rejectApplication, markUnderReview, suspendMember, addAdminNote } from "@/actions/admin-actions";
import { CATEGORY_LABEL, JOINING_REASONS, EXPERTISE_AREAS, REFRIGERANT_CERTIFICATIONS } from "@/lib/constants";
import { MembershipCategory, ApplicationStatus } from "@/lib/enums";
import { notFound } from "next/navigation";
import { AdminActions } from "./admin-actions";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    UNDER_REVIEW: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    SUSPENDED: "bg-gray-100 text-gray-800",
  };
  const labels: Record<string, string> = {
    PENDING: "Pending",
    UNDER_REVIEW: "Under Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    SUSPENDED: "Suspended",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[status] || "bg-gray-100"}`}>
      {labels[status] || status}
    </span>
  );
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const app = await getApplicationById(id);

  if (!app) {
    notFound();
  }

  const cat = app.category as MembershipCategory;
  const joiningReasons: string[] = JSON.parse(app.joiningReasons || "[]");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/applications" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#0f3b5e]">
              {app.firstName} {app.lastName}
            </h1>
            <p className="text-gray-500 text-sm">
              {CATEGORY_LABEL[cat]} • {app.membershipNumber ? `#${app.membershipNumber}` : "No membership number"}
            </p>
          </div>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {/* Admin Actions */}
      <AdminActions application={JSON.parse(JSON.stringify(app))} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Main details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-[#0f3b5e] mb-4">Personal & Contact Information</h2>
            <dl className="grid sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Full Name</dt>
                <dd className="text-sm mt-0.5">{app.firstName} {app.lastName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Email</dt>
                <dd className="text-sm mt-0.5">{app.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Phone</dt>
                <dd className="text-sm mt-0.5">{app.phone}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Address</dt>
                <dd className="text-sm mt-0.5">{app.address}</dd>
              </div>
            </dl>
          </div>

          {/* Category-Specific Info */}
          {app.technicianProfile && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-semibold text-[#0f3b5e] mb-4">Technician Details</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Qualifications</dt>
                  <dd className="text-sm mt-0.5">{app.technicianProfile.qualifications}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Years of Experience</dt>
                  <dd className="text-sm mt-0.5">{app.technicianProfile.yearsOfExperience}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Expertise Areas</dt>
                  <dd className="text-sm mt-0.5">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {JSON.parse(app.technicianProfile.expertiseAreas || "[]").map((area: string) => (
                        <span key={area} className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs">
                          {area.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Refrigerant Certifications</dt>
                  <dd className="text-sm mt-0.5">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {JSON.parse(app.technicianProfile.refrigerantCertifications || "[]").map((cert: string) => (
                        <span key={cert} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {cert.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </span>
                      ))}
                      {JSON.parse(app.technicianProfile.refrigerantCertifications || "[]").length === 0 && (
                        <span className="text-gray-400">None listed</span>
                      )}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {app.studentProfile && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-semibold text-[#0f3b5e] mb-4">Student Details</h2>
              <dl className="grid sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Institution</dt>
                  <dd className="text-sm mt-0.5">{app.studentProfile.institution}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Programme</dt>
                  <dd className="text-sm mt-0.5">{app.studentProfile.programme}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Expected Graduation</dt>
                  <dd className="text-sm mt-0.5">{app.studentProfile.expectedGraduation.toLocaleDateString()}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Career Interest</dt>
                  <dd className="text-sm mt-0.5 capitalize">{app.studentProfile.careerInterest.replace(/_/g, " ").toLowerCase()}</dd>
                </div>
              </dl>
            </div>
          )}

          {app.nonTechnicalProfile && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-semibold text-[#0f3b5e] mb-4">Non-Technical Professional Details</h2>
              <dl className="grid sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Job Title</dt>
                  <dd className="text-sm mt-0.5">{app.nonTechnicalProfile.jobTitle}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Employer</dt>
                  <dd className="text-sm mt-0.5">{app.nonTechnicalProfile.employer}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Sector Focus</dt>
                  <dd className="text-sm mt-0.5 capitalize">{app.nonTechnicalProfile.sectorFocus.replace(/_/g, " ").toLowerCase()}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Primary Goal</dt>
                  <dd className="text-sm mt-0.5">{app.nonTechnicalProfile.joiningGoal}</dd>
                </div>
              </dl>
            </div>
          )}

          {app.corporateProfile && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-semibold text-[#0f3b5e] mb-4">Corporate/Company Details</h2>
              <dl className="grid sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Company Name</dt>
                  <dd className="text-sm mt-0.5">{app.corporateProfile.companyName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Core Business</dt>
                  <dd className="text-sm mt-0.5 capitalize">{app.corporateProfile.coreBusinessActivity.replace(/_/g, " ").toLowerCase()}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Total Employees</dt>
                  <dd className="text-sm mt-0.5">{app.corporateProfile.totalEmployees}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Active Field Technicians</dt>
                  <dd className="text-sm mt-0.5">{app.corporateProfile.activeFieldTechnicians}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-gray-500 uppercase">Regulatory Affiliations</dt>
                  <dd className="text-sm mt-0.5">{app.corporateProfile.regulatoryAffiliations || "None"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Representative Name</dt>
                  <dd className="text-sm mt-0.5">{app.corporateProfile.representativeName}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-gray-500 uppercase">Representative Email</dt>
                  <dd className="text-sm mt-0.5">{app.corporateProfile.representativeEmail}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Professional Alignment */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-[#0f3b5e] mb-4">Professional Alignment & Declaration</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Reasons for Joining</dt>
                <dd className="mt-1">
                  <div className="flex flex-wrap gap-2">
                    {joiningReasons.map((reason: string) => (
                      <span key={reason} className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs">
                        {reason.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Declaration Accepted</dt>
                <dd className="text-sm mt-0.5">{app.declaration ? "Yes" : "No"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase">Signature</dt>
                <dd className="text-sm mt-0.5">{app.signatureName}</dd>
              </div>
            </dl>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-[#0f3b5e] mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-teal-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium">Application Submitted</p>
                  <p className="text-xs text-gray-500">{app.applicationDate.toLocaleDateString()} at {app.applicationDate.toLocaleTimeString()}</p>
                </div>
              </div>
              {app.approvalDate && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">Approved</p>
                    <p className="text-xs text-gray-500">{app.approvalDate.toLocaleDateString()} at {app.approvalDate.toLocaleTimeString()}</p>
                  </div>
                </div>
              )}
              {app.rejectionDate && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <div>
                    <p className="text-sm font-medium">Rejected</p>
                    <p className="text-xs text-gray-500">{app.rejectionDate.toLocaleDateString()} at {app.rejectionDate.toLocaleTimeString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Admin Notes */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-[#0f3b5e] mb-4">Admin Notes</h2>
            <form action={async (formData: FormData) => {
              "use server";
              const content = formData.get("content") as string;
              if (content?.trim()) {
                await addAdminNote(id, content);
              }
            }}>
              <textarea
                name="content"
                rows={3}
                placeholder="Add a note..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent mb-2"
              />
              <button
                type="submit"
                className="w-full px-3 py-2 bg-[#0f3b5e] text-white rounded-lg hover:bg-[#1a5a8a] transition-colors text-sm"
              >
                Add Note
              </button>
            </form>
            <div className="mt-4 space-y-3">
              {app.adminNotes.map((note) => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {note.admin.name || note.admin.email} • {note.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
              {app.adminNotes.length === 0 && (
                <p className="text-sm text-gray-400">No notes yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
