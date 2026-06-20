import { getApplications, exportMembersCSV } from "@/actions/admin-actions";
import { CATEGORY_LABEL } from "@/lib/constants";
import { MembershipCategory } from "@/lib/enums";
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

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "ALL";
  const page = parseInt(params.page || "1", 10);

  const result = await getApplications({ search, category, status: "APPROVED", page, limit: 20 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f3b5e]">Members</h1>
          <p className="text-gray-500 text-sm">Approved members list</p>
        </div>
        <Link
          href="/admin/members/export"
          className="px-4 py-2 bg-[#0f3b5e] text-white rounded-lg hover:bg-[#1a5a8a] transition-colors text-sm"
        >
          Export CSV
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <form className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Name, email, membership #..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
            <select
              name="category"
              defaultValue={category}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
            >
              <option value="ALL">All Categories</option>
              {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0f3b5e] text-white rounded-lg hover:bg-[#1a5a8a] transition-colors text-sm"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Membership #</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Category</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Approved</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-xs font-medium">{app.membershipNumber || "—"}</td>
                  <td className="px-6 py-3 font-medium">{app.firstName} {app.lastName}</td>
                  <td className="px-6 py-3 text-gray-500">{app.email}</td>
                  <td className="px-6 py-3">{CATEGORY_LABEL[app.category as MembershipCategory]}</td>
                  <td className="px-6 py-3 text-gray-500">
                    {app.approvalDate?.toLocaleDateString() || "—"}
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="text-teal-600 hover:text-teal-800 font-medium"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
              {result.applications.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No approved members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {result.page} of {result.totalPages} ({result.total} total)
            </p>
            <div className="flex gap-2">
              {result.page > 1 && (
                <Link
                  href={`/admin/members?page=${result.page - 1}&search=${search}&category=${category}`}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              {result.page < result.totalPages && (
                <Link
                  href={`/admin/members?page=${result.page + 1}&search=${search}&category=${category}`}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
