import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#0f3b5e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center font-bold text-lg">
              H
            </div>
            <div>
              <h1 className="text-xl font-bold">HEVACRAZ</h1>
              <p className="text-xs text-teal-200">Membership Registry</p>
            </div>
          </div>
          <Link
            href="/admin/login"
            className="text-sm text-teal-200 hover:text-white transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#0f3b5e] to-[#1a5a8a] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Join HEVACRAZ Today
            </h2>
            <p className="text-lg sm:text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              The Heating, Ventilation, Air Conditioning and Refrigeration Association of Zambia
              — uniting professionals and companies in the HVAC-R industry.
            </p>
            <Link
              href="/apply"
              className="inline-flex items-center px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg text-lg transition-colors shadow-lg"
            >
              Apply for Membership
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center text-[#0f3b5e] mb-12">
              Membership Categories
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Student",
                  desc: "For individuals enrolled in HVAC-R related programs.",
                  icon: "🎓",
                },
                {
                  title: "Technician",
                  desc: "For qualified HVAC-R technicians with industry experience.",
                  icon: "🔧",
                },
                {
                  title: "Non-Technical Professional",
                  desc: "For professionals in distribution, supply, and consulting.",
                  icon: "💼",
                },
                {
                  title: "Corporate / Company",
                  desc: "For organizations in the HVAC-R industry.",
                  icon: "🏢",
                },
              ].map((cat) => (
                <div
                  key={cat.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-4">{cat.icon}</div>
                  <h4 className="font-semibold text-lg text-[#0f3b5e] mb-2">
                    {cat.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center text-[#0f3b5e] mb-12">
              Why Join HEVACRAZ?
            </h3>
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                "Technical Seminars & CPD opportunities",
                "Professional Networking & B2B Opportunities",
                "Access to Industry Regulation Updates & Standards",
                "Submit Data & Sector Market Insights",
              ].map((reason, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0f3b5e] text-teal-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} HEVACRAZ. All rights reserved.</p>
          <p className="mt-1">
            Heating, Ventilation, Air Conditioning and Refrigeration Association of Zambia
          </p>
        </div>
      </footer>
    </div>
  );
}
