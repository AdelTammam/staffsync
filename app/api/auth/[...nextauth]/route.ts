/*
 * route.ts — /api/auth/[...nextauth]
 * Date: June 2025
 * Description: NextAuth v5 catch-all route handler. Delegates all
 *   authentication HTTP requests (GET for session/CSRF, POST for
 *   sign-in/sign-out callbacks) to the handlers exported from auth.ts.
 * Inputs:  Any HTTP request to /api/auth/**.
 * Processing: The NextAuth handlers parse the URL, call the appropriate
 *   provider logic (Credentials.authorize), set/clear the session cookie,
 *   and return the correct HTTP response.
 * Outputs: GET and POST route handlers consumed by Next.js App Router.
 */

import { handlers } from "@/auth";

// Re-export the GET and POST handlers from the centralised auth config
export const { GET, POST } = handlers;
