/*
 * middleware.ts
 * Date: June 2025
 * Description: Route protection middleware for the StaffSync portal.
 *   Runs on every non-static request and enforces authentication and
 *   role-based access control before the page renders.
 * Inputs:  Incoming HTTP request (URL, cookies containing the NextAuth JWT).
 * Processing:
 *   1. Authenticated users visiting /login or /register are redirected
 *      to their appropriate home page (/dashboard for admins, /employees
 *      for regular users).
 *   2. Unauthenticated users visiting /dashboard or /employees are
 *      redirected to /login.
 *   3. Non-admin users visiting /dashboard are redirected to /employees.
 * Outputs: NextResponse.redirect() or NextResponse.next() to allow the
 *   request to continue to the page component.
 */

import { auth } from "@/auth";
import { NextResponse } from "next/server";

// ─── Middleware function ───────────────────────────────────────────────────────

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;             // null when not authenticated

  const isLoggedIn    = !!session;
  const isLoginPage   = nextUrl.pathname.startsWith("/login");
  const isRegisterPage = nextUrl.pathname.startsWith("/register");
  const isDashboard   = nextUrl.pathname.startsWith("/dashboard");
  const isEmployees   = nextUrl.pathname.startsWith("/employees");

  // ─── Redirect authenticated users away from auth pages ───────────────────
  if (isLoggedIn && (isLoginPage || isRegisterPage)) {
    const dest = session?.user.role === "admin" ? "/dashboard" : "/employees";
    return NextResponse.redirect(new URL(dest, nextUrl));
  }

  // ─── Protect dashboard and employees from unauthenticated access ──────────
  if (!isLoggedIn && (isDashboard || isEmployees)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // ─── Non-admin users cannot access the admin dashboard ───────────────────
  if (isDashboard && session?.user.role !== "admin") {
    return NextResponse.redirect(new URL("/employees", nextUrl));
  }

  return NextResponse.next();
});

// Apply middleware to all routes except static files and API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

