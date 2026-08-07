/**
 * fix-colors.js — StaffSync font color fix
 * Run from inside the staffsync folder: node fix-colors.js
 * Adds explicit text-gray-900 + bg-white to every input/select,
 * and forces light color-scheme on the html element so OS dark
 * mode never bleeds into form controls. Does NOT touch globals.css.
 */

'use strict';
const fs = require('fs');

// ─── Helper: read → transform → write ────────────────────────────────────────
function patch(filePath, ...replacements) {
  if (!fs.existsSync(filePath)) {
    console.log('SKIP (not found):', filePath);
    return;
  }
  let src = fs.readFileSync(filePath, 'utf8');
  for (const [from, to] of replacements) {
    if (src.includes(from)) {
      src = src.split(from).join(to);
    }
  }
  fs.writeFileSync(filePath, src, 'utf8');
  console.log('FIXED:', filePath);
}

// ─── 1. layout.tsx — force light color-scheme so OS dark mode never applies ──
patch(
  'app/layout.tsx',
  [
    'className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}',
    'className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} style={{ colorScheme: \'light\' }}',
  ]
);

// ─── 2. AddEmployeeForm.tsx — fix the shared inputClass constant ──────────────
patch(
  'app/components/AddEmployeeForm.tsx',
  [
    '"w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm " +',
    '"w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white " +',
  ]
);

// ─── 3. EditEmployeeModal.tsx — same shared inputClass constant ───────────────
patch(
  'app/components/EditEmployeeModal.tsx',
  [
    '"w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm " +',
    '"w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white " +',
  ]
);

// ─── 4. login/page.tsx — inline className on each input ──────────────────────
patch(
  'app/login/page.tsx',
  [
    'className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm\n                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"',
    'className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white\n                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"',
  ]
);

// ─── 5. register/page.tsx — same inline pattern ───────────────────────────────
patch(
  'app/register/page.tsx',
  [
    'className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm\n                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"',
    'className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white\n                         focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"',
  ]
);

// ─── 6. EmployeesClient.tsx — search input + department select ────────────────
patch(
  'app/employees/EmployeesClient.tsx',
  [
    '"flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm\n                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"',
    '"flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white\n                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"',
  ],
  [
    '"border border-gray-300 rounded-lg px-4 py-2.5 text-sm\n                     focus:outline-none focus:border-blue-500 transition-all"',
    '"border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white\n                     focus:outline-none focus:border-blue-500 transition-all"',
  ]
);

console.log('\nAll done. Restart with: npm run dev');
