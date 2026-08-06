/*
 * next-auth.d.ts
 * Date: June 2025
 * Description: TypeScript module augmentation for NextAuth v5.
 *   Extends the default Session and JWT interfaces to include the
 *   user's role ("admin" | "user") and numeric id, so that
 *   session.user.role is typed throughout the application.
 * Inputs:  N/A — declaration file only.
 * Processing: Merges custom fields into the NextAuth Session, User,
 *   and JWT interfaces via TypeScript declaration merging.
 * Outputs: Typed session.user.id and session.user.role available
 *   in all server components, API routes, and client hooks.
 */

import "next-auth";
import "next-auth/jwt";

// ─── Session augmentation ─────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "admin" | "user";
    };
  }

  // Extend the User returned from the authorize callback
  interface User {
    role: "admin" | "user";
  }
}

// ─── JWT augmentation ─────────────────────────────────────────────────────────

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "user";
  }
}
