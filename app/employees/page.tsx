/*
 * page.tsx — /employees
 * Date: June 2025
 * Description: Employee directory Server Component. Accessible to all
 *   authenticated users (both admin and regular users). Verifies the
 *   session on the server and passes the isAdmin flag to the client
 *   component so it can conditionally show admin-only features.
 * Inputs:  NextAuth session (read via auth() on the server).
 * Processing: Calls auth() and redirects to /login if no session.
 *   Derives isAdmin from session.user.role and passes it as a prop
 *   to EmployeesClient.
 * Outputs: EmployeesClient rendered inside the root layout, or a redirect.
 */

import { auth }          from "@/auth";
import { redirect }      from "next/navigation";
import EmployeesClient   from "./EmployeesClient";

// ─── Page (Server Component) ──────────────────────────────────────────────────

const EmployeesPage = async () => {
  const session = await auth();

  // Unauthenticated users go to /login
  if (!session) redirect("/login");

  const isAdmin = session.user.role === "admin";

  return <EmployeesClient isAdmin={isAdmin} />;
};

export default EmployeesPage;
