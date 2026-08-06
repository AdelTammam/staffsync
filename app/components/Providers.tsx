/*
 * Providers.tsx
 * Date: June 2025
 * Description: Client-side provider wrapper that supplies the NextAuth
 *   SessionProvider context to all client components in the application.
 *   Placed at the root of the component tree (in layout.tsx) so that
 *   useSession() is available anywhere in the app.
 * Inputs:  children — the nested React component tree.
 * Processing: Wraps children with SessionProvider from next-auth/react,
 *   which fetches the session from /api/auth/session and makes it
 *   available via the useSession() hook throughout the tree.
 * Outputs: The children rendered inside the NextAuth session context.
 */

"use client";

import { SessionProvider } from "next-auth/react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProvidersProps {
  children: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Providers = ({ children }: ProvidersProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;
