/*
 * DashboardClient.tsx
 * Date: June 2025
 * Description: Client-side admin dashboard for StaffSync. Fetches all
 *   employee records from GET /api/employees and renders them in a
 *   responsive card grid. Provides controls to add a new employee, edit
 *   an existing record, and delete employees with confirmation.
 * Inputs:  None (fetches data internally on mount).
 * Processing:
 *   - useCallback memoises fetchEmployees to avoid unnecessary re-renders.
 *   - useEffect triggers the initial fetch on component mount.
 *   - useState tracks the employee list, loading/error state, the employee
 *     currently being edited, and whether the add form is visible.
 *   - handleDelete calls DELETE /api/employees/[id] and removes the entry
 *     from local state immediately for optimistic UI.
 * Outputs: Admin header, optional AddEmployeeForm, a card grid of employees,
 *   and the EditEmployeeModal when an employee is selected for editing.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { Employee }   from "@/app/data/employees";
import EmployeeCard        from "@/app/components/EmployeeCard";
import AddEmployeeForm     from "@/app/components/AddEmployeeForm";
import EditEmployeeModal   from "@/app/components/EditEmployeeModal";

// ─── Component ────────────────────────────────────────────────────────────────

const DashboardClient = () => {
  const [employees,       setEmployees]       = useState<Employee[]>([]);
  const [isLoading,       setIsLoading]       = useState(true);
  const [error,           setError]           = useState("");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showAddForm,     setShowAddForm]     = useState(false);

  // ─── Fetch all employees from the REST API ────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const res = await fetch("/api/employees");

    if (res.ok) {
      const data = await res.json() as Employee[];
      setEmployees(data);
    } else {
      setError("Failed to load employees. Please refresh the page.");
    }

    setIsLoading(false);
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ─── Delete employee by ID ────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this employee? This action cannot be undone.")) return;

    const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });

    if (res.ok) {
      // Remove from local state immediately for optimistic UI update
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } else {
      alert("Delete failed — please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      {/* ─── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {employees.length} {employees.length === 1 ? "employee" : "employees"} on record
          </p>
        </div>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl
                     hover:bg-blue-700 transition-colors font-medium"
        >
          {showAddForm ? "✕ Cancel" : "+ Add Employee"}
        </button>
      </div>

      {/* ─── Add Employee Form (toggleable) ──────────────────────────── */}
      {showAddForm && (
        <AddEmployeeForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchEmployees();   // refresh the list after adding
          }}
        />
      )}

      {/* ─── Employee grid ────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-500">
          Loading employees…
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
          {error}
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">👥</p>
          <p className="font-medium">No employees yet.</p>
          <p className="text-sm mt-1">Add the first one using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              isAdmin
              onEdit={() => setEditingEmployee(employee)}
              onDelete={() => handleDelete(employee._id)}
            />
          ))}
        </div>
      )}

      {/* ─── Edit Modal (shown when an employee is selected) ─────────── */}
      {editingEmployee && (
        <EditEmployeeModal
          employee={editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSuccess={() => {
            setEditingEmployee(null);
            fetchEmployees();   // refresh after saving
          }}
        />
      )}

    </div>
  );
};

export default DashboardClient;
