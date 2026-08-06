/*
 * route.ts — /api/employees/[id]
 * Date: June 2025
 * Description: REST API route handlers for a single employee document.
 *   Supports GET (fetch one), PUT (full update), and DELETE (remove).
 *   GET requires authentication; PUT and DELETE are admin-only.
 * Inputs:  URL param id — MongoDB ObjectId string.
 *   PUT — JSON body with updated employee field values.
 *   All — NextAuth session cookie for authentication.
 * Processing:
 *   GET:  Validates the ObjectId, fetches the document (salary hidden for
 *         non-admin), returns 404 if not found.
 *   PUT:  Validates ObjectId and required fields, applies $set update,
 *         returns the updated document.
 *   DELETE: Validates ObjectId, deletes the document, returns a success message.
 * Outputs: JSON response with employee data or error, and HTTP status codes.
 */

import { auth }              from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId }          from "mongodb";
import { type NextRequest }  from "next/server";

// ─── Route param type ─────────────────────────────────────────────────────────

type RouteContext = { params: Promise<{ id: string }> };

// ─── GET /api/employees/[id] ──────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid employee ID" }, { status: 400 });
  }

  const { db }     = await connectToDatabase();
  const isAdmin    = session.user.role === "admin";
  const projection = isAdmin ? {} : { salary: 0 };

  const employee = await db
    .collection("employees")
    .findOne({ _id: new ObjectId(id) }, { projection });

  if (!employee) {
    return Response.json({ error: "Employee not found" }, { status: 404 });
  }

  return Response.json({ ...employee, _id: employee._id.toString() });
}

// ─── PUT /api/employees/[id] ──────────────────────────────────────────────────

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return Response.json({ error: "Forbidden — admin access required" }, { status: 403 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid employee ID" }, { status: 400 });
  }

  const body = await request.json() as Record<string, unknown>;
  const { firstName, lastName, email, department, jobTitle, salary, startDate, status } = body;

  if (!firstName || !lastName || !email || !department || !jobTitle || !salary || !startDate) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  const updateData = {
    firstName:  (firstName  as string).trim(),
    lastName:   (lastName   as string).trim(),
    email:      (email      as string).trim().toLowerCase(),
    department: department  as string,
    jobTitle:   (jobTitle   as string).trim(),
    salary:     Number(salary),
    startDate:  startDate   as string,
    status:     status      as string,
    updatedAt:  new Date(),
  };

  const result = await db.collection("employees").findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result) {
    return Response.json({ error: "Employee not found" }, { status: 404 });
  }

  return Response.json({ ...result, _id: result._id.toString() });
}

// ─── DELETE /api/employees/[id] ───────────────────────────────────────────────

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  const session = await auth();
  if (!session || session.user.role !== "admin") {
    return Response.json({ error: "Forbidden — admin access required" }, { status: 403 });
  }

  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return Response.json({ error: "Invalid employee ID" }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  const result = await db
    .collection("employees")
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return Response.json({ error: "Employee not found" }, { status: 404 });
  }

  return Response.json({ message: "Employee deleted successfully" });
}
