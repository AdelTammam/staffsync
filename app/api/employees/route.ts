/*
 * route.ts — /api/employees
 * Date: June 2025
 * Description: REST API route handlers for the employee collection.
 *   Supports GET (list all) and POST (create new). Both endpoints
 *   require a valid NextAuth session. POST is restricted to admin users.
 * Inputs:  GET — no body. POST — JSON body with employee field values.
 *   Both — NextAuth session cookie for authentication.
 * Processing:
 *   GET:  Fetches all documents from the "employees" collection. Non-admin
 *         sessions receive a projection that excludes the salary field.
 *   POST: Validates required fields, builds the document, and inserts it
 *         into MongoDB. Returns the created document with _id as string.
 * Outputs: JSON response with employee data, or an error object with
 *   the appropriate HTTP status code.
 */

import { auth }              from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { type NextRequest }  from "next/server";

// ─── GET /api/employees ───────────────────────────────────────────────────────

export async function GET() {
  // Require a valid session for any employee data access
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { db }    = await connectToDatabase();
  const isAdmin   = session.user.role === "admin";

  // Admin users see all fields; regular users cannot see salary
  const projection = isAdmin ? {} : { salary: 0 };

  const employees = await db
    .collection("employees")
    .find({}, { projection })
    .sort({ lastName: 1 })    // alphabetical by last name
    .toArray();

  // MongoDB ObjectIds must be converted to strings for JSON serialisation
  const serialised = employees.map((emp) => ({
    ...emp,
    _id: emp._id.toString(),
  }));

  return Response.json(serialised);
}

// ─── POST /api/employees ──────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Only admin users may create employee records
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return Response.json({ error: "Forbidden — admin access required" }, { status: 403 });
  }

  const body = await request.json() as Record<string, unknown>;
  const { firstName, lastName, email, department, jobTitle, salary, startDate, status } = body;

  // Validate all required fields before touching the database
  if (!firstName || !lastName || !email || !department || !jobTitle || !salary || !startDate) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  const newEmployee = {
    firstName:  (firstName  as string).trim(),
    lastName:   (lastName   as string).trim(),
    email:      (email      as string).trim().toLowerCase(),
    department: department  as string,
    jobTitle:   (jobTitle   as string).trim(),
    salary:     Number(salary),
    startDate:  startDate   as string,
    status:     (status as string) ?? "Active",
    createdAt:  new Date(),
    updatedAt:  new Date(),
  };

  const result = await db.collection("employees").insertOne(newEmployee);

  return Response.json(
    { ...newEmployee, _id: result.insertedId.toString() },
    { status: 201 }
  );
}
