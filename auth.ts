/*
 * auth.ts
 * Date: June 2025
 * Description: NextAuth v5 configuration for the StaffSync employee portal.
 *   Implements Credentials-based authentication against a MongoDB users
 *   collection. Passwords are verified with bcrypt. The user role
 *   ("admin" | "user") is persisted in the JWT and exposed on the session.
 * Inputs:  Email and password credentials from the /login form.
 *   MONGODB_URI (env) for database connection.
 *   AUTH_SECRET (env) for signing JWT tokens.
 * Processing: On authorize, looks up the user by email, verifies the
 *   bcrypt hash, and returns a User object with id, email, name, and role.
 *   The jwt callback persists id and role in the token; the session
 *   callback copies them onto the Session.user object.
 * Outputs: Exports handlers (GET/POST route handler), auth (server-side
 *   session getter), signIn, and signOut for use across the application.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// ─── NextAuth configuration ───────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use stateless JWT sessions — no database adapter required for session storage
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },

      // authorize is called when the user submits the login form
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { db } = await connectToDatabase();

        // Find the user document by email (case-insensitive via stored lowercase)
        const user = await db.collection("users").findOne({
          email: credentials.email,
        });

        if (!user) return null;

        // Compare the submitted password against the stored bcrypt hash
        const passwordValid = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );

        if (!passwordValid) return null;

        // Return the shape expected by the JWT callback
        return {
          id:    user._id.toString(),
          email: user.email  as string,
          name:  user.name   as string,
          role:  user.role   as "admin" | "user",
        };
      },
    }),
  ],

  callbacks: {
    // ─── jwt: persist custom fields in the token ─────────────────────────────
    jwt({ token, user }) {
      if (user) {
        token.id   = user.id!;
        token.role = user.role;
      }
      return token;
    },

    // ─── session: expose custom fields to client-side useSession() ───────────
    session({ session, token }) {
      session.user.id   = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  // Redirect unauthenticated users to the custom login page
  pages: { signIn: "/login" },
});
