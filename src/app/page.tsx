import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Header ── */}
      <header className="bg-[#0f3b5e] text-white sticky top-0 z-50 shadow-lg shadow-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <Image src="/logo.jpg" alt="HEVACRAZ" width={40} height={40}
                className="rounded-xl transition-transform group-hover:scale-105" />
              <div>
                <h1 className="text-xl font-bold leading-tight">HEVACRAZ</h1>
                <p className="text-[11px] text-teal-300 leading-tight">Membership Registry</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/apply"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Apply Now
              </Link>
              <Link
                href="/admin/login"
                className="text-sm text-teal-200 hover:text-white transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3b5e] via-[#0f3b5e] to-[#1a5a8a] text-white">
          {/* Decorative shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02]" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-medium mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Now accepting applications for 2026
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Join HEVACRAZ Today
            </h2>
            <p className="text-lg sm:text-xl text-teal-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
	              The Heating, Ventilation, Air Conditioning and Refrigeration Association of Zimbabwe
	              uniting professionals and companies across the HVACR industry.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/apply"
                className="inline-flex items-center px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl text-lg transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Apply for Membership
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all backdrop-blur-sm"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* ── Categories ── */}
        <section id="categories" className="py-20 sm:py-24 bg-gray-50/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h3 className="text-3xl sm:text-4xl font-bold text-[#0f3b5e] tracking-tight">
                Membership Categories
              </h3>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                Choose the membership type that best fits your role in the HVACR industry
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Student",
                  desc: "For individuals enrolled in HVACR related programs at recognized institutions.",
                  icon: "🎓",
                  color: "from-violet-500 to-purple-600",
                  bg: "bg-violet-50",
                },
                {
                  title: "Technician",
                  desc: "For qualified HVACR technicians with verifiable industry experience.",
                  icon: "🔧",
                  color: "from-blue-500 to-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  title: "Non Technical",
                  desc: "For professionals in distribution, supply, and consulting roles.",
                  icon: "💼",
                  color: "from-amber-500 to-orange-600",
                  bg: "bg-amber-50",
                },
                {
                  title: "Corporate",
                  desc: "For registered organizations in the HVACR industry.",
                  icon: "🏢",
                  color: "from-teal-500 to-emerald-600",
                  bg: "bg-teal-50",
                },
              ].map((cat) => (
                <div
                  key={cat.title}
                  className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  <h4 className="font-semibold text-lg text-[#0f3b5e] mb-2">
                    {cat.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Join ── */}
        <section className="py-20 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h3 className="text-3xl sm:text-4xl font-bold text-[#0f3b5e] tracking-tight">
                Why Join HEVACRAZ?
              </h3>
              <p className="mt-3 text-gray-500 max-w-xl mx-auto">
                Benefits designed to advance your career and business
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                {
                  title: "Technical Seminars & CPD",
                  desc: "Access exclusive training, workshops, and continuing professional development opportunities.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  ),
                },
                {
                  title: "Networking & B2B",
                  desc: "Connect with industry leaders, potential partners, and fellow professionals.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
                {
                  title: "Industry Updates",
                  desc: "Stay current with regulation changes, standards, and best practices.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
                {
                  title: "Market Insights",
                  desc: "Submit and access valuable industry data and sector market intelligence.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <div key={i} className="group flex items-start gap-4 p-5 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0f3b5e] mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-gradient-to-r from-[#0f3b5e] to-[#1a5a8a] text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Ready to Join?
            </h3>
            <p className="text-teal-100/90 text-lg mb-8 max-w-lg mx-auto">
              Take the first step toward becoming a member of Zimbabwe&apos;s leading HVACR association.
            </p>
            <Link
              href="/apply"
              className="inline-flex items-center px-8 py-4 bg-white text-[#0f3b5e] font-semibold rounded-xl text-lg hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Your Application
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#0a2a42] text-teal-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo.jpg" alt="HEVACRAZ" width={32} height={32}
                className="rounded-lg" />
              <span className="font-bold text-white text-lg">HEVACRAZ</span>
              </div>
              <p className="text-sm text-teal-300/70 leading-relaxed">
                Heating, Ventilation, Air Conditioning and Refrigeration Association of Zimbabwe
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm mb-3">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/apply" className="hover:text-white transition-colors">Apply for Membership</Link></li>
                <li><Link href="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm mb-3">Membership</h5>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-white transition-colors">Student</li>
                <li className="hover:text-white transition-colors">Technician</li>
                <li className="hover:text-white transition-colors">Non Technical Professional</li>
                <li className="hover:text-white transition-colors">Corporate Company</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-teal-300/50">
            <p>&copy; {new Date().getFullYear()} HEVACRAZ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
