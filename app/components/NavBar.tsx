/*
 * NavBar.tsx
 * Date: June 2025
 * Description: Sticky navigation bar for the StaffSync portal.
 *   Reads the NextAuth session via useSession() and conditionally
 *   renders links for authenticated users (Dashboard/Employees/Sign Out)
 *   or unauthenticated users (Log In/Sign Up). Dashboard link is only
 *   shown to admin users.
 * Inputs:  NextAuth session from useSession() hook.
 * Processing: Checks session.status to show loading, authenticated,
 *   or unauthenticated UI state. Calls signOut() from next-auth/react
 *   on the Sign Out button click.
 * Outputs: A <nav> element rendered at the top of every page.
 */

"use client";

import { useSession, signOut } from "next-auth/react";
import Link                    from "next/link";

// ─── Component ────────────────────────────────────────────────────────────────

const NavBar = () => {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* ─── Logo / brand ────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SS</span>
          </div>
          <Link href="/" className="text-gray-900 font-bold text-lg hover:text-blue-600 transition-colors">
            StaffSync
          </Link>
        </div>

        {/* ─── Navigation links ─────────────────────────────────────────── */}
        <div className="flex items-center gap-4 text-sm font-medium text-gray-600">

          {/* Loading state — avoids flash of wrong links */}
          {status === "loading" && (
            <span className="text-gray-400 text-xs">Loading…</span>
          )}

          {/* Authenticated state */}
          {status === "authenticated" && (
            <>
              {/* Dashboard link — admin only */}
              {isAdmin && (
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              )}

              <Link href="/employees" className="hover:text-blue-600 transition-colors">
                Employees
              </Link>

              {/* Show the logged-in email (truncated on small screens) */}
              <span className="text-gray-400 text-xs hidden sm:inline truncate max-w-[160px]">
                {session.user.email}
              </span>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-red-600 border border-red-200 px-3 py-1.5 rounded-lg
                           hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </>
          )}

          {/* Unauthenticated state */}
          {status === "unauthenticated" && (
            <>
              <Link href="/login" className="hover:text-blue-600 transition-colors">
                Log In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg
                           hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default NavBar;
