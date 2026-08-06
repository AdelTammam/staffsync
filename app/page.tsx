/*
 * page.tsx — / (home page)
 * Date: June 2025
 * Description: Public landing page for the StaffSync portal. Visible to
 *   all visitors without authentication. Introduces the application and
 *   links to the login and registration pages.
 * Inputs:  None.
 * Processing: Statically rendered Server Component — no data fetching.
 *   Maps over the features array to render the feature cards section.
 * Outputs: A hero section and feature grid describing StaffSync.
 */

import Link from "next/link";

// ─── Feature card data ────────────────────────────────────────────────────────

const features = [
  {
    icon:        "👥",
    title:       "Employee Directory",
    description: "Browse all employees with departments, roles, and contact information in one place.",
  },
  {
    icon:        "🔒",
    title:       "Secure Access",
    description: "Role-based access control ensures sensitive data is only visible to administrators.",
  },
  {
    icon:        "✏️",
    title:       "Easy Management",
    description: "Admins can add, edit, and remove employee records instantly with full CRUD operations.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="text-center py-12">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">SS</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">StaffSync</h1>
        <p className="text-xl text-blue-600 font-medium mb-4">Employee Management System</p>
        <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
          A secure, centralised portal for HR administrators to manage employee records,
          track departments, and maintain up-to-date staff information.
        </p>

        {/* Call-to-action buttons */}
        <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl
                       hover:bg-blue-700 transition-colors font-medium"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl
                       hover:border-blue-600 hover:text-blue-600 transition-colors font-medium"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* ─── Features grid ────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          What StaffSync Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
