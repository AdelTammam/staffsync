/*
 * page.tsx — /register
 * Date: June 2025
 * Description: User registration page for the StaffSync portal. Submits
 *   name, email, and password to POST /api/users/register, then
 *   automatically signs the user in and redirects to /employees.
 * Inputs:  Name, email, and password entered by the user.
 * Processing: On submit, POSTs to /api/users/register. If successful,
 *   immediately calls signIn("credentials") to auto-authenticate.
 *   Uses useState for form fields, error, and loading state.
 * Outputs: A centred registration card page with a name/email/password form.
 */

"use client";

import { signIn }                            from "next-auth/react";
import { useState, type FormEvent }          from "react";
import Link                                  from "next/link";
import { useRouter }                         from "next/navigation";

// ─── Component ────────────────────────────────────────────────────────────────

const RegisterPage = () => {
  const router = useRouter();
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ─── Submit: POST to register API, then auto sign-in ────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Step 1: Create the account
    const res = await fetch("/api/users/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Registration failed. Please try again.");
      setIsLoading(false);
      return;
    }

    // Step 2: Auto sign-in with the new credentials
    const signInResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (signInResult?.error) {
      // Account was created but auto-login failed — send them to /login
      setError("Account created! Please sign in manually.");
      return;
    }

    router.refresh();
    router.push("/employees");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">SS</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-gray-500 text-sm mt-1">Join StaffSync today</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

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
              placeholder="Min. 8 characters"
              required
              minLength={8}
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
            {isLoading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
