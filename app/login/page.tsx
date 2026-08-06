/*
 * page.tsx — /login
 * Date: June 2025
 * Description: Login page for the StaffSync portal. Submits credentials
 *   to the NextAuth Credentials provider via signIn("credentials").
 *   Redirects to /dashboard (admin) or /employees (user) on success.
 * Inputs:  Email and password entered by the user into the form fields.
 * Processing: On submit, calls signIn("credentials", { redirect: false })
 *   and handles the result. Displays an error banner for invalid credentials.
 *   Uses useState for controlled inputs and loading state.
 *   Uses useRouter to programmatically redirect after sign-in.
 * Outputs: A centred login card page with email/password form.
 */

"use client";

import { signIn }                            from "next-auth/react";
import { useState, type FormEvent }          from "react";
import Link                                  from "next/link";
import { useRouter }                         from "next/navigation";

// ─── Component ────────────────────────────────────────────────────────────────

const LoginPage = () => {
  const router = useRouter();
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ─── Submit handler: call NextAuth signIn ────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,   // handle redirect manually so we can check the role
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    // Refresh the router so the NavBar re-reads the session, then push
    router.refresh();
    router.push("/dashboard");   // middleware handles role-based redirect
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">SS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your StaffSync account</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium
                       hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
