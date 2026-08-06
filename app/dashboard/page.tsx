/*
 * page.tsx — /dashboard
 * Date: June 2025
 * Description: Admin-only dashboard Server Component. Verifies the
 *   NextAuth session on the server before rendering the page; non-admins
 *   and unauthenticated visitors are redirected immediately.
 *   The interactive content is handled by the DashboardClient component.
 * Inputs:  NextAuth session (read via auth() on the server).
 * Processing: Calls auth() and redirects to /login if no session exists,
 *   or to /employees if the user is not an admin. Otherwise renders
 *   DashboardClient, which owns all client-side state and data fetching.
 * Outputs: DashboardClient rendered inside the root layout, or a redirect.
 */

import { auth }            from "@/auth";
import { redirect }        from "next/navigation";
import DashboardClient     from "./DashboardClient";

// ─── Page (Server Component) ──────────────────────────────────────────────────

const DashboardPage = async () => {
  const session = await auth();

  // Unauthenticated users go to /login
  if (!session) redirect("/login");

  // Regular users go to the employee directory
  if (session.user.role !== "admin") redirect("/employees");

  return <DashboardClient />;
};

export default DashboardPage;
