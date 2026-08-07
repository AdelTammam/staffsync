/*
 * Footer.tsx
 * Date: June 2025
 * Description: Static footer component for the StaffSync portal.
 *   Displays the copyright year (resolved server-side), project info,
 *   and placeholder external links.
 * Inputs:  None.
 * Processing: Calls new Date().getFullYear() for the current year.
 * Outputs: A <footer> element rendered at the bottom of every page.
 */

// ─── Component ────────────────────────────────────────────────────────────────

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-8 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          © {year} StaffSync — CPRG 306 · Web Development 2 · SAIT
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <a href="https://github.com/AdelTammam/staffsync" className="hover:text-gray-700 transition-colors">GitHub</a>
          <a href="mailto:admin@staffsync.com" className="hover:text-gray-700 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
