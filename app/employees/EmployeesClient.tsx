/*
 * EmployeesClient.tsx
 * Date: June 2025
 * Description: Client-side employee directory component. Fetches the
 *   employee list from GET /api/employees and provides real-time
 *   search (by full name) and department filtering on the client side.
 *   Salary is hidden server-side for non-admin users via API projection.
 * Inputs:  isAdmin — passed from the server page component. Controls
 *   whether EmployeeCard shows the salary row and action buttons.
 * Processing:
 *   - useCallback memoises fetchEmployees for use in useEffect.
 *   - useEffect triggers the initial fetch on component mount.
 *   - Search and department filter are applied with Array.filter()
 *     client-side on the fetched list.
 *   - Department options are derived dynamically from the fetched data
 *     using Set to deduplicate.
 * Outputs: A search/filter toolbar and a responsive card grid of employees.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { Employee }   from "@/app/data/employees";
import EmployeeCard        from "@/app/components/EmployeeCard";

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmployeesClientProps {
  isAdmin: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const EmployeesClient = ({ isAdmin }: EmployeesClientProps) => {
  const [employees,   setEmployees]   = useState<Employee[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [searchTerm,  setSearchTerm]  = useState("");
  const [filterDept,  setFilterDept]  = useState("");

  // ─── Fetch employees from the REST API ───────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/employees");
    if (res.ok) {
      setEmployees(await res.json() as Employee[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // ─── Client-side filtering ────────────────────────────────────────────────
  const filtered = employees.filter((emp) => {
    const fullName  = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const nameMatch = fullName.includes(searchTerm.toLowerCase());
    const deptMatch = filterDept === "" || emp.department === filterDept;
    return nameMatch && deptMatch;
  });

  // Build the list of unique departments for the filter dropdown
  const departments = [...new Set(employees.map((e) => e.department))].sort();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      {/* ─── Header ───────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
        <p className="text-gray-500 mt-1 text-sm">
          {isLoading ? "Loading…" : `${filtered.length} of ${employees.length} employees`}
        </p>
      </div>

      {/* ─── Search + department filter ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        />
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white
                     focus:outline-none focus:border-blue-500 transition-all"
        >
          <option value="">All departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* ─── Employee grid ────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-500">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          {searchTerm || filterDept
            ? "No employees match your search."
            : "No employees on record yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((employee) => (
            <EmployeeCard
              key={employee._id}
              employee={employee}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default EmployeesClient;
