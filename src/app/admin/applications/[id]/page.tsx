import { getApplicationById, addAdminNote } from "@/actions/admin-actions";
import { CATEGORY_LABEL } from "@/lib/constants";
import { MembershipCategory } from "@/lib/enums";
import { notFound } from "next/navigation";
import { AdminActions } from "./admin-actions";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    PENDING: { cls: "badge-pending", label: "Pending" },
    UNDER_REVIEW: { cls: "badge-review", label: "Under Review" },
    APPROVED: { cls: "badge-approved", label: "Approved" },
    REJECTED: { cls: "badge-rejected", label: "Rejected" },
    SUSPENDED: { cls: "badge-suspended", label: "Suspended" },
  };
  const s = map[status] || { cls: "badge", label: status };
  return <span className={`${s.cls} text-sm px-3 py-1`}>{s.label}</span>;
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 py-3 border-b border-gray-50 last:border-0">
      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 sm:mb-0">{label}</dt>
      <dd className="text-sm text-gray-900 sm:col-span-2">{value}</dd>
    </div>
  );
}

function Tag({ children, className = "bg-teal-50 text-teal-700" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${className}`}>{children}</span>;
}

function TimelineItem({ active, label, date, color }: { active: boolean; label: string; date?: string; color: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ring-4 ring-white ${color} ${active ? "" : "opacity-40"}`} />
      </div>
      <div className={active ? "" : "opacity-40"}>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {date && <p className="text-xs text-gray-500 mt-0.5">{date}</p>}
      </div>
    </div>
  );
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const app = await getApplicationById(id);

  if (!app) notFound();

  const cat = app.category as MembershipCategory;
  const joiningReasons: string[] = JSON.parse(app.joiningReasons || "[]");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/admin/applications" className="btn-ghost btn-sm mt-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-[#0f3b5e]">{app.firstName} {app.lastName}</h1>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {CATEGORY_LABEL[cat]}
              {app.membershipNumber && <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{app.membershipNumber}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Action Buttons */}
      <AdminActions application={JSON.parse(JSON.stringify(app))} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal & Contact */}
          <DetailSection title="Personal & Contact Information">
            <dl>
              <DetailRow label="Full Name" value={`${app.firstName} ${app.lastName}`} />
              <DetailRow label="Email" value={<a href={`mailto:${app.email}`} className="text-teal-600 hover:text-teal-800">{app.email}</a>} />
              <DetailRow label="Phone" value={<a href={`tel:${app.phone}`} className="text-teal-600 hover:text-teal-800">{app.phone}</a>} />
              <DetailRow label="Address" value={app.address} />
            </dl>
          </DetailSection>

          {/* Category-specific section */}
          {app.technicianProfile && (
            <DetailSection title="Technician Details">
              <dl>
                <DetailRow label="Qualifications" value={app.technicianProfile.qualifications} />
                <DetailRow label="Years of Experience" value={`${app.technicianProfile.yearsOfExperience} years`} />
                <DetailRow label="Expertise Areas" value={
                  <div className="flex flex-wrap gap-1.5">
                    {JSON.parse(app.technicianProfile.expertiseAreas || "[]").map((a: string) => (
                      <Tag key={a}>{a.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</Tag>
                    ))}
                  </div>
                } />
                <DetailRow label="Refrigerant Certs" value={
                  <div className="flex flex-wrap gap-1.5">
                    {JSON.parse(app.technicianProfile.refrigerantCertifications || "[]").length > 0
                      ? JSON.parse(app.technicianProfile.refrigerantCertifications || "[]").map((c: string) => (
                          <Tag key={c} className="bg-blue-50 text-blue-700">{c.replace(/_/g, " ").replace(/\b\w/g, (s: string) => s.toUpperCase())}</Tag>
                        ))
                      : <span className="text-gray-400 text-sm">None listed</span>
                    }
                  </div>
                } />
              </dl>
            </DetailSection>
          )}

          {app.studentProfile && (
            <DetailSection title="Student Details">
              <dl>
                <DetailRow label="Institution" value={app.studentProfile.institution} />
                <DetailRow label="Programme" value={app.studentProfile.programme} />
                <DetailRow label="Expected Graduation" value={app.studentProfile.expectedGraduation.toLocaleDateString()} />
                <DetailRow label="Career Interest" value={app.studentProfile.careerInterest.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} />
              </dl>
            </DetailSection>
          )}

          {app.nonTechnicalProfile && (
            <DetailSection title="Non-Technical Professional Details">
              <dl>
                <DetailRow label="Job Title" value={app.nonTechnicalProfile.jobTitle} />
                <DetailRow label="Employer" value={app.nonTechnicalProfile.employer} />
                <DetailRow label="Sector Focus" value={app.nonTechnicalProfile.sectorFocus.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} />
                <DetailRow label="Primary Goal" value={app.nonTechnicalProfile.joiningGoal} />
              </dl>
            </DetailSection>
          )}

          {app.corporateProfile && (
            <DetailSection title="Corporate / Company Details">
              <dl>
                <DetailRow label="Company Name" value={app.corporateProfile.companyName} />
                <DetailRow label="Core Business" value={app.corporateProfile.coreBusinessActivity.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} />
                <DetailRow label="Total Employees" value={app.corporateProfile.totalEmployees} />
                <DetailRow label="Active Field Technicians" value={app.corporateProfile.activeFieldTechnicians} />
                <DetailRow label="Regulatory Affiliations" value={app.corporateProfile.regulatoryAffiliations || <span className="text-gray-400">None</span>} />
                <DetailRow label="Representative" value={`${app.corporateProfile.representativeName} (${app.corporateProfile.representativeEmail})`} />
              </dl>
            </DetailSection>
          )}

          {/* Professional Alignment */}
          <DetailSection title="Professional Alignment & Declaration">
            <dl>
              <DetailRow label="Reasons for Joining" value={
                <div className="flex flex-wrap gap-1.5">
                  {joiningReasons.map((r: string) => (
                    <Tag key={r}>{r.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</Tag>
                  ))}
                </div>
              } />
              <DetailRow label="Declaration" value={app.declaration ? <Tag className="bg-green-50 text-green-700">Accepted</Tag> : <Tag className="bg-red-50 text-red-700">Not Accepted</Tag>} />
              <DetailRow label="Signature" value={app.signatureName} />
            </dl>
          </DetailSection>

          {/* Timeline */}
          <DetailSection title="Timeline">
            <div className="space-y-6">
              <TimelineItem active label="Application Submitted" date={`${app.applicationDate.toLocaleDateString()} at ${app.applicationDate.toLocaleTimeString()}`} color="bg-teal-500" />
              {app.approvalDate && <TimelineItem active label="Approved" date={`${app.approvalDate.toLocaleDateString()} at ${app.approvalDate.toLocaleTimeString()}`} color="bg-green-500" />}
              {app.rejectionDate && <TimelineItem active label="Rejected" date={`${app.rejectionDate.toLocaleDateString()} at ${app.rejectionDate.toLocaleTimeString()}`} color="bg-red-500" />}
              {!app.approvalDate && !app.rejectionDate && (
                <div className="flex items-center gap-2 text-sm text-gray-400 ml-[22px]">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Awaiting review decision
                </div>
              )}
            </div>
          </DetailSection>
        </div>

        {/* Sidebar: Admin Notes */}
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="section-title">Admin Notes</h2>
            </div>
            <div className="p-6">
              <form action={async (formData: FormData) => {
                "use server";
                const content = formData.get("content") as string;
                if (content?.trim()) await addAdminNote(id, content);
              }}>
                <textarea name="content" rows={3} placeholder="Add a note..." className="input mb-3" />
                <button type="submit" className="btn-primary btn-md w-full">Add Note</button>
              </form>
              <div className="mt-5 space-y-3">
                {app.adminNotes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {note.admin.name || note.admin.email}
                      <span className="mx-1">&middot;</span>
                      {note.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {app.adminNotes.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">No notes yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
