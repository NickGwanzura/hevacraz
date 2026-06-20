import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-[#0f3b5e] text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center font-bold text-sm">
                  H
                </div>
                <span className="font-semibold">HEVACRAZ Admin</span>
              </Link>
              <nav className="hidden sm:flex items-center gap-4 text-sm">
                <Link href="/admin" className="text-teal-200 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/applications" className="text-teal-200 hover:text-white transition-colors">
                  Applications
                </Link>
                <Link href="/admin/members" className="text-teal-200 hover:text-white transition-colors">
                  Members
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-teal-200">{session.user.name || session.user.email}</span>
              <Link
                href="/"
                className="text-teal-200 hover:text-white transition-colors"
                target="_blank"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>
    </div>
  );
}
