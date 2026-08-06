/*
 * EmployeeCard.tsx
 * Date: June 2025
 * Description: Displays a single employee's details in a card layout.
 *   Shows name, job title, department, email, start date, and — for
 *   admin users only — the employee's salary. Admin users also see
 *   Edit and Delete action buttons.
 * Inputs:  employee — the Employee object to display.
 *   isAdmin — whether to show salary and admin action buttons.
 *   onEdit  — callback triggered when the Edit button is clicked.
 *   onDelete — callback triggered when the Delete button is clicked.
 * Processing: Maps the employee's status to a colour class pair.
 *   Formats the start date for human-readable display.
 *   Conditionally renders salary and action buttons based on isAdmin.
 * Outputs: A <article> element styled as a card.
 */

import type { Employee, EmployeeStatus } from "@/app/data/employees";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmployeeCardProps {
  employee:  Employee;
  isAdmin?:  boolean;
  onEdit?:   () => void;
  onDelete?: () => void;
}

// ─── Status badge colour map ──────────────────────────────────────────────────

const statusStyles: Record<EmployeeStatus, string> = {
  Active:   "bg-green-100 text-green-700",
  Inactive: "bg-gray-100  text-gray-600",
};

// ─── Component ────────────────────────────────────────────────────────────────

const EmployeeCard = ({
  employee,
  isAdmin  = false,
  onEdit,
  onDelete,
}: EmployeeCardProps) => {
  // Format the ISO start date for display (e.g. "Jun 1, 2023")
  const formattedDate = new Date(employee.startDate + "T00:00:00").toLocaleDateString(
    "en-CA",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">

      {/* ─── Header: full name + status badge ─────────────────────────── */}
      <div className="flex items-start justify-between mb-4 gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-blue-600 text-sm font-medium mt-0.5">{employee.jobTitle}</p>
        </div>
        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[employee.status]}`}
        >
          {employee.status}
        </span>
      </div>

      {/* ─── Detail rows ──────────────────────────────────────────────── */}
      <dl className="space-y-2 text-sm border-t border-gray-100 pt-4">
        <div className="flex justify-between">
          <dt className="text-gray-500">Department</dt>
          <dd className="text-gray-700 font-medium">{employee.department}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Email</dt>
          <dd className="text-gray-700 text-xs">{employee.email}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Start Date</dt>
          <dd className="text-gray-700">{formattedDate}</dd>
        </div>

        {/* Salary — visible to admins only */}
        {isAdmin && employee.salary !== undefined && (
          <div className="flex justify-between">
            <dt className="text-gray-500">Salary</dt>
            <dd className="text-gray-700 font-medium">
              ${employee.salary.toLocaleString("en-CA")} / yr
            </dd>
          </div>
        )}
      </dl>

      {/* ─── Admin action buttons ─────────────────────────────────────── */}
      {isAdmin && (onEdit || onDelete) && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 text-sm text-blue-600 border border-blue-200 rounded-lg
                         py-2 hover:bg-blue-50 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 text-sm text-red-600 border border-red-200 rounded-lg
                         py-2 hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default EmployeeCard;
