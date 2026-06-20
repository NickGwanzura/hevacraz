import { getDashboardStats } from "@/actions/admin-actions";
import { CATEGORY_LABEL } from "@/lib/constants";
import { MembershipCategory, ApplicationStatus } from "@/lib/enums";
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
  return <span className={s.cls}>{s.label}</span>;
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ProgressItem({ label, count, max, color = "bg-teal-500" }: { label: string; count: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-gray-600 truncate">{label}</span>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-24 sm:w-36 bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-semibold text-gray-700 w-8 text-right tabular-nums">{count}</span>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: "Total Members", value: stats.totalMembers, color: "text-[#0f3b5e]", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "Pending", value: stats.pendingApplications, color: "text-yellow-600", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Approved", value: stats.approvedMembers, color: "text-green-600", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Rejected", value: stats.rejectedApplications, color: "text-red-600", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Corporate", value: stats.corporateMembers, color: "text-teal-600", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  ];

  const maxCount = Math.max(1, ...stats.membersByCategory.map((c) => c._count));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of the HEVACRAZ membership registry</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="section-title mb-5">Members by Category</h2>
          {stats.membersByCategory.length > 0 ? (
            <div className="space-y-4">
              {stats.membersByCategory.map((cat) => (
                <ProgressItem key={cat.category}
                  label={CATEGORY_LABEL[cat.category as MembershipCategory]}
                  count={cat._count} max={maxCount}
                  color="bg-teal-500" />
              ))}
            </div>
          ) : (
            <EmptyState message="No approved members yet" />
          )}
        </div>

        <div className="card p-6">
          <h2 className="section-title mb-5">Technician Expertise Areas</h2>
          {Object.keys(stats.expertiseCount).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(stats.expertiseCount)
                .sort(([, a], [, b]) => b - a)
                .map(([area, count]) => (
                  <ProgressItem key={area}
                    label={area.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                    count={count}
                    max={Math.max(1, ...Object.values(stats.expertiseCount))}
                    color="bg-blue-500" />
                ))}
            </div>
          ) : (
            <EmptyState message="No technician data yet" />
          )}
        </div>

        <div className="card p-6">
          <h2 className="section-title mb-5">Refrigerant Certifications</h2>
          {Object.keys(stats.refrigerantCount).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(stats.refrigerantCount)
                .sort(([, a], [, b]) => b - a)
                .map(([cert, count]) => (
                  <ProgressItem key={cert}
                    label={cert.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                    count={count}
                    max={Math.max(1, ...Object.values(stats.refrigerantCount))}
                    color="bg-purple-500" />
                ))}
            </div>
          ) : (
            <EmptyState message="No certification data yet" />
          )}
        </div>

        <div className="card p-6">
          <h2 className="section-title mb-5">Students by Institution</h2>
          {Object.keys(stats.institutionCount).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(stats.institutionCount)
                .sort(([, a], [, b]) => b - a)
                .map(([inst, count]) => (
                  <ProgressItem key={inst}
                    label={inst}
                    count={count}
                    max={Math.max(1, ...Object.values(stats.institutionCount))}
                    color="bg-amber-500" />
                ))}
            </div>
          ) : (
            <EmptyState message="No student data yet" />
          )}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="section-title">Recent Applications</h2>
          <Link href="/admin/applications" className="btn-ghost btn-sm">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table-wrap">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Membership #</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stats.recentApplications.map((app) => (
                <tr key={app.id}>
                  <td className="font-medium">{app.firstName} {app.lastName}</td>
                  <td className="text-gray-500">{CATEGORY_LABEL[app.category as MembershipCategory]}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td className="text-gray-500">{app.applicationDate.toLocaleDateString()}</td>
                  <td className="text-gray-400 font-mono text-xs">{app.membershipNumber || "—"}</td>
                  <td>
                    <Link href={`/admin/applications/${app.id}`} className="btn-ghost btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {stats.recentApplications.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400 py-8">No applications yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
      <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
}
