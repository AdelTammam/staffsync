/*
 * EditEmployeeModal.tsx
 * Date: June 2025
 * Description: Modal dialog for editing an existing employee record.
 *   Pre-populates all fields from the passed employee object and sends
 *   a PUT request to /api/employees/[id] on submit. Closes on Escape
 *   key or backdrop click.
 * Inputs:  employee — the Employee to edit (pre-fills the form).
 *   onClose   — callback to close the modal without saving.
 *   onSuccess — callback invoked after a successful save.
 * Processing: Uses useEffect to register an Escape key listener.
 *   On submit, sends PUT with the updated form data and calls onSuccess.
 *   Displays an inline error banner on failure.
 * Outputs: A fixed-position modal overlay with an edit form.
 */

"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { DEPARTMENTS, STATUS_OPTIONS, type Employee, type EmployeeFormData } from "@/app/data/employees";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditEmployeeModalProps {
  employee:  Employee;
  onClose:   () => void;
  onSuccess: () => void;
}

// ─── Shared input className helper ────────────────────────────────────────────

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm " +
  "focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all";

// ─── Component ────────────────────────────────────────────────────────────────

const EditEmployeeModal = ({ employee, onClose, onSuccess }: EditEmployeeModalProps) => {
  // Pre-fill all form fields from the existing employee record
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName:  employee.firstName,
    lastName:   employee.lastName,
    email:      employee.email,
    department: employee.department,
    jobTitle:   employee.jobTitle,
    salary:     String(employee.salary),
    startDate:  employee.startDate,
    status:     employee.status,
  });
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ─── Escape key closes the modal ──────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // ─── Sync field changes to state ──────────────────────────────────────────
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ─── PUT updated employee to the API ──────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await fetch(`/api/employees/${employee._id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(formData),
    });

    setIsLoading(false);

    if (!res.ok) {
      const data = await res.json() as { error?: string };
      setError(data.error ?? "Update failed. Please try again.");
      return;
    }

    onSuccess();
  };

  return (
    // Backdrop — clicking it closes the modal
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      {/* Modal card — clicking inside does NOT close */}
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">
            Edit — {employee.firstName} {employee.lastName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors text-xl"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" noValidate>

          <div>
            <label htmlFor="edit-firstName" className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
            <input id="edit-firstName" name="firstName" type="text" required
              value={formData.firstName} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="edit-lastName" className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
            <input id="edit-lastName" name="lastName" type="text" required
              value={formData.lastName} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input id="edit-email" name="email" type="email" required
              value={formData.email} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="edit-department" className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
            <select id="edit-department" name="department" required
              value={formData.department} onChange={handleChange} className={inputClass}>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="edit-jobTitle" className="block text-sm font-medium text-gray-700 mb-1.5">Job Title</label>
            <input id="edit-jobTitle" name="jobTitle" type="text" required
              value={formData.jobTitle} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="edit-salary" className="block text-sm font-medium text-gray-700 mb-1.5">Salary (CAD/yr)</label>
            <input id="edit-salary" name="salary" type="number" min="0" required
              value={formData.salary} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="edit-startDate" className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
            <input id="edit-startDate" name="startDate" type="date" required
              value={formData.startDate} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select id="edit-status" name="status"
              value={formData.status} onChange={handleChange} className={inputClass}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm rounded-lg font-medium
                         hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Saving…" : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
