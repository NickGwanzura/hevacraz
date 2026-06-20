import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "./sign-out";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/admin/applications", label: "Applications", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { href: "/admin/members", label: "Members", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-[#0f3b5e] text-white shadow-lg shadow-black/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105">
                  H
                </div>
                <span className="font-semibold text-sm hidden sm:block">HEVACRAZ Admin</span>
              </Link>
              <nav className="hidden sm:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = false; // We'll handle this with a client component later
                  return (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-teal-200 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-teal-300 hidden sm:block truncate max-w-[150px]">
                {session.user.name || session.user.email}
              </span>
              <Link href="/" target="_blank"
                className="text-xs text-teal-300 hover:text-white transition-colors hidden sm:block">
                View Site
              </Link>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="sm:hidden bg-white border-b border-gray-100">
        <div className="flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex-1 flex flex-col items-center py-2 text-xs text-gray-500 hover:text-[#0f3b5e] transition-colors">
              <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
