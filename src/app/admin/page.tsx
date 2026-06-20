import { getDashboardStats } from "@/actions/admin-actions";
import { CATEGORY_LABEL } from "@/lib/constants";
import { MembershipCategory, ApplicationStatus } from "@/lib/enums";
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100"}`}>
      {labels[status] || status}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f3b5e]">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome to the HEVACRAZ membership management dashboard.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Members</p>
          <p className="text-3xl font-bold text-[#0f3b5e]">{stats.totalMembers}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingApplications}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-3xl font-bold text-green-600">{stats.approvedMembers}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{stats.rejectedApplications}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Corporate</p>
          <p className="text-3xl font-bold text-teal-600">{stats.corporateMembers}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Members by Category */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-[#0f3b5e] mb-4">Members by Category</h2>
          {stats.membersByCategory.length > 0 ? (
            <div className="space-y-3">
              {stats.membersByCategory.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{CATEGORY_LABEL[cat.category as MembershipCategory]}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 sm:w-48 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-teal-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (cat._count / Math.max(...stats.membersByCategory.map((c) => c._count))) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-8 text-right">{cat._count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No approved members yet</p>
          )}
        </div>

        {/* Expertise Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-[#0f3b5e] mb-4">Technician Expertise Areas</h2>
          {Object.keys(stats.expertiseCount).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.expertiseCount)
                .sort(([, a], [, b]) => b - a)
                .map(([area, count]) => (
                  <div key={area} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">
                      {area.replace(/_/g, " ").toLowerCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{count}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No technician data yet</p>
          )}
        </div>

        {/* Refrigerant Certifications */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-[#0f3b5e] mb-4">Refrigerant Certifications</h2>
          {Object.keys(stats.refrigerantCount).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.refrigerantCount)
                .sort(([, a], [, b]) => b - a)
                .map(([cert, count]) => (
                  <div key={cert} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">
                      {cert.replace(/_/g, " ").toLowerCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{count}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No certification data yet</p>
          )}
        </div>

        {/* Student Institutions */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-[#0f3b5e] mb-4">Students by Institution</h2>
          {Object.keys(stats.institutionCount).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.institutionCount)
                .sort(([, a], [, b]) => b - a)
                .map(([inst, count]) => (
                  <div key={inst} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{inst}</span>
                    <span className="text-sm font-medium text-gray-700">{count}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No student data yet</p>
          )}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#0f3b5e]">Recent Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Membership #</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recentApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{app.firstName} {app.lastName}</td>
                  <td className="px-6 py-3">{CATEGORY_LABEL[app.category as MembershipCategory]}</td>
                  <td className="px-6 py-3"><StatusBadge status={app.status} /></td>
                  <td className="px-6 py-3">{app.applicationDate.toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-gray-500">{app.membershipNumber || "—"}</td>
                  <td className="px-6 py-3">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="text-teal-600 hover:text-teal-800 font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {stats.recentApplications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No applications yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
