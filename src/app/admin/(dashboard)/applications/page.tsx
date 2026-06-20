import { getApplications } from "@/actions/admin-actions";
import { CATEGORY_LABEL } from "@/lib/constants";
import { MembershipCategory } from "@/lib/enums";
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

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "ALL";
  const status = params.status || "ALL";
  const page = parseInt(params.page || "1", 10);

  const result = await getApplications({ search, category, status, page, limit: 20 });

  const buildUrl = (overrides: Record<string, string>) => {
    const sp = new URLSearchParams();
    const merged = { search, category, status, page: page.toString(), ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v && v !== "ALL" && v !== "1") sp.set(k, v); });
    return `/admin/applications?${sp.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage membership applications</p>
        </div>
        <Link href="/apply" target="_blank" className="btn-accent btn-md self-start">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Public Form
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-5">
        <form className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="label">Search</label>
            <input type="text" name="search" defaultValue={search}
              placeholder="Name, email, membership #..." className="input" />
          </div>
          <div>
            <label className="label">Category</label>
            <select name="category" defaultValue={category} className="input bg-white">
              <option value="ALL">All Categories</option>
              {Object.entries(CATEGORY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select name="status" defaultValue={status} className="input bg-white">
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <button type="submit" className="btn-primary btn-md">Filter</button>
        </form>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-wrap">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.applications.map((app) => (
                <tr key={app.id}>
                  <td className="font-medium">{app.firstName} {app.lastName}</td>
                  <td className="text-gray-500">{app.email}</td>
                  <td className="text-gray-500">{CATEGORY_LABEL[app.category as MembershipCategory]}</td>
                  <td><StatusBadge status={app.status} /></td>
                  <td className="text-gray-500 text-sm">{app.applicationDate.toLocaleDateString()}</td>
                  <td>
                    <Link href={`/admin/applications/${app.id}`} className="btn-ghost btn-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {result.applications.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400 py-12">No applications found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {result.page} of {result.totalPages}
              <span className="text-gray-400 ml-1">({result.total} total)</span>
            </p>
            <div className="flex gap-2">
              {result.page > 1 && (
                <Link href={buildUrl({ page: (result.page - 1).toString() })} className="btn-outline btn-sm">
                  Previous
                </Link>
              )}
              {result.page < result.totalPages && (
                <Link href={buildUrl({ page: (result.page + 1).toString() })} className="btn-outline btn-sm">
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
