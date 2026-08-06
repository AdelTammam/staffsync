/*
 * employees.ts
 * Date: June 2025
 * Description: TypeScript type definitions and constants for the StaffSync
 *   employee management system. Defines the Employee entity and related
 *   types used across components, API routes, and data operations.
 * Inputs:  N/A — type definition module only.
 * Processing: Exports interfaces, type aliases, and constant arrays
 *   consumed by components and API handlers throughout the application.
 * Outputs: Exported types and constants available via @/app/data/employees.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type EmployeeStatus = "Active" | "Inactive";

/** Full employee record as stored in and returned from MongoDB. */
export interface Employee {
  _id:        string;
  firstName:  string;
  lastName:   string;
  email:      string;
  department: string;
  jobTitle:   string;
  salary:     number;
  startDate:  string;   // ISO date string — YYYY-MM-DD
  status:     EmployeeStatus;
}

/** Form field values used by AddEmployeeForm and EditEmployeeModal.
 *  salary is a string here so it can be bound to an <input type="number">
 *  and converted to a number only when submitted to the API. */
export interface EmployeeFormData {
  firstName:  string;
  lastName:   string;
  email:      string;
  department: string;
  jobTitle:   string;
  salary:     string;
  startDate:  string;
  status:     EmployeeStatus;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Available department options for the department dropdown. */
export const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Human Resources",
  "Finance",
  "Operations",
  "Sales",
  "Customer Support",
] as const;

/** Employment status options for the status dropdown. */
export const STATUS_OPTIONS: EmployeeStatus[] = ["Active", "Inactive"];

/** Default empty form state — used to initialise and reset the add/edit forms. */
export const EMPTY_FORM: EmployeeFormData = {
  firstName:  "",
  lastName:   "",
  email:      "",
  department: "",
  jobTitle:   "",
  salary:     "",
  startDate:  "",
  status:     "Active",
};
