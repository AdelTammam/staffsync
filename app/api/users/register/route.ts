/*
 * route.ts — /api/users/register
 * Date: June 2025
 * Description: Public REST endpoint for creating new user accounts.
 *   Validates input, checks for duplicate emails, hashes the password
 *   with bcrypt, and inserts the new user into the MongoDB users collection.
 *   All new accounts receive the "user" role. Admin role must be assigned
 *   manually in MongoDB Atlas after account creation.
 * Inputs:  JSON body — { name: string, email: string, password: string }.
 * Processing: Validates required fields and minimum password length.
 *   Rejects duplicate emails with 409 Conflict.
 *   Hashes password with bcrypt (cost factor 12).
 *   Inserts user document with role "user" and createdAt timestamp.
 * Outputs: 201 Created with sanitised user data (no password), or an
 *   error object with the appropriate HTTP status code.
 */

import { connectToDatabase } from "@/lib/mongodb";
import { type NextRequest }  from "next/server";
import bcrypt                from "bcryptjs";

// ─── POST /api/users/register ─────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json() as Record<string, unknown>;
  const { name, email, password } = body;

  // ─── Validate required fields ─────────────────────────────────────────────
  if (!name || !email || !password) {
    return Response.json({ error: "All fields are required" }, { status: 400 });
  }

  if ((password as string).length < 8) {
    return Response.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const { db } = await connectToDatabase();

  // ─── Reject duplicate emails ──────────────────────────────────────────────
  const existing = await db
    .collection("users")
    .findOne({ email: (email as string).toLowerCase() });

  if (existing) {
    return Response.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  // ─── Hash the password before storing ────────────────────────────────────
  const hashedPassword = await bcrypt.hash(password as string, 12);

  const newUser = {
    name:      (name  as string).trim(),
    email:     (email as string).trim().toLowerCase(),
    password:  hashedPassword,
    role:      "user",         // all sign-ups start as regular users
    createdAt: new Date(),
  };

  const result = await db.collection("users").insertOne(newUser);

  // Return the created user without the hashed password
  return Response.json(
    {
      id:    result.insertedId.toString(),
      name:  newUser.name,
      email: newUser.email,
      role:  newUser.role,
    },
    { status: 201 }
  );
}
