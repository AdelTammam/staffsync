/*
 * AddEmployeeForm.tsx
 * Date: June 2025
 * Description: Controlled form for adding a new employee record.
 *   Submits validated data to POST /api/employees and calls onSuccess
 *   after a successful insert. Uses useState for controlled inputs and
 *   async/await for the fetch call.
 * Inputs:  onSuccess — callback invoked after a successful API response.
 *   User-entered values in firstName, lastName, email, department,
 *   jobTitle, salary, startDate, and status fields.
 * Processing: On submit, sends a POST request with the form data.
 *   Displays an inline error banner if the API returns an error.
 *   Resets the form to empty defaults after a successful submission.
 * Outputs: Renders a form card. Calls onSuccess() on completion.
 */

"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { DEPARTMENTS, STATUS_OPTIONS, EMPTY_FORM, type EmployeeFormData } from "@/app/data/employees";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddEmployeeFormProps {
  onSuccess: () => void;
}

// ─── Shared input className helper ────────────────────────────────────────────

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white " +
  "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";

// ─── Component ────────────────────────────────────────────────────────────────

const AddEmployeeForm = ({ onSuccess }: AddEmployeeFormProps) => {
  const [formData,  setFormData]  = useState<EmployeeFormData>(EMPTY_FORM);
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ─── Sync individual field changes to state ──────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ─── POST to the employees API on form submit ────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await fetch("/api/employees", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(formData),
    });

    setIsLoading(false);

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Failed to add employee. Please try again.");
      return;
    }

    setFormData(EMPTY_FORM);
    onSuccess();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Add New Employee</h2>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm text-gray-900 bg-white">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" noValidate>

        {/* First name */}
        <div>
          <label htmlFor="add-firstName" className="block text-sm text-gray-900 bg-white font-medium text-gray-700 mb-1.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <input id="add-firstName" name="firstName" type="text" required
            value={formData.firstName} onChange={handleChange} placeholder="Jane"
            className={inputClass} />
        </div>

        {/* Last name */}
        <div>
          <label htmlFor="add-lastName" className="block text-sm text-gray-900 bg-white font-medium text-gray-700 mb-1.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input id="add-lastName" name="lastName" type="text" required
            value={formData.lastName} onChange={handleChange} placeholder="Smith"
            className={inputClass} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="add-email" className="block text-sm text-gray-900 bg-white font-medium text-gray-700 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input id="add-email" name="email" type="email" required
            value={formData.email} onChange={handleChange} placeholder="jane@company.com"
            className={inputClass} />
        </div>

        {/* Department */}
        <div>
          <label htmlFor="add-department" className="block text-sm text-gray-900 bg-white font-medium text-gray-700 mb-1.5">
            Department <span className="text-red-500">*</span>
          </label>
          <select id="add-department" name="department" required
            value={formData.department} onChange={handleChange}
            className={inputClass}>
            <option value="">— Select department —</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Job title */}
        <div>
          <label htmlFor="add-jobTitle" className="block text-sm text-gray-900 bg-white font-medium text-gray-700 mb-1.5">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input id="add-jobTitle" name="jobTitle" type="text" required
            value={formData.jobTitle} onChange={handleChange} placeholder="Software Engineer"
            className={inputClass} />
        </div>

        {/* Salary */}
        <div>
          <label htmlFor="add-salary" className="block text-sm text-gray-900 bg-white font-medium text-gray-700 mb-1.5">
            Salary (CAD/yr) <span className="text-red-500">*</span>
          </label>
          <input id="add-salary" name="salary" type="number" min="0" required
            value={formData.salary} onChange={handleChange} placeholder="75000"
            className={inputClass} />
        </div>

        {/* Start date */}
        <div>
          <label htmlFor="add-startDate" className="block text-sm text-gray-900 bg-white font-medium text-gray-700 mb-1.5">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input id="add-startDate" name="startDate" type="date" required
            value={formData.startDate} onChange={handleChange}
            className={inputClass} />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="add-status" className="block text-sm text-gray-900 bg-white font-medium text-gray-700 mb-1.5">
            Status
          </label>
          <select id="add-status" name="status"
            value={formData.status} onChange={handleChange}
            className={inputClass}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <div className="sm:col-span-2 flex items-center justify-between">
          <p className="text-xs text-gray-400">* Required fields</p>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium
                       hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Adding…" : "Add Employee"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddEmployeeForm;
