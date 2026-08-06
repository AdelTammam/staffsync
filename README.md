# StaffSync — Employee Management System

**CPRG 306 · Web Development 2 · SAIT · Phase 2**

A secure, full-stack employee management portal built with Next.js 16, MongoDB, Tailwind CSS v4, and NextAuth v5.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Auth | NextAuth v5 (Credentials + JWT) |
| Database | MongoDB (native driver v6) |
| Language | TypeScript (strict mode) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | Database name (default: `staffsync`) |
| `AUTH_SECRET` | Random 32+ char string — run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` for development |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Creating an Admin User

All accounts registered through `/register` start as **regular users**. To create an admin:

1. Register a new account at `/register`.
2. Open **MongoDB Atlas → Browse Collections → users**.
3. Find the document for your account and change `"role": "user"` to `"role": "admin"`.
4. Sign out and sign back in — you will now see the **Dashboard** link in the navbar.

---

## Project Structure

```
staffsync/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   ← NextAuth route handler
│   │   ├── employees/            ← GET all, POST new
│   │   ├── employees/[id]/       ← GET, PUT, DELETE one
│   │   └── users/register/       ← POST (create account)
│   ├── components/               ← Shared UI components
│   ├── dashboard/                ← Admin-only page + client
│   ├── employees/                ← Employee directory + client
│   ├── login/                    ← Login page
│   ├── register/                 ← Register page
│   └── data/employees.ts         ← TypeScript types & constants
├── auth.ts                       ← NextAuth v5 configuration
├── middleware.ts                 ← Route protection
├── lib/mongodb.ts                ← Database connection
└── types/next-auth.d.ts          ← Session type augmentation
```

---

## Access Levels

| Route | Regular User | Admin |
|---|---|---|
| `/` | ✅ Public | ✅ Public |
| `/login` | ✅ | ✅ |
| `/register` | ✅ | ✅ |
| `/employees` | ✅ (no salary) | ✅ (with salary) |
| `/dashboard` | ❌ Redirected | ✅ Full CRUD |

---

## REST API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/employees` | User | List all employees |
| POST | `/api/employees` | Admin | Create employee |
| GET | `/api/employees/[id]` | User | Get one employee |
| PUT | `/api/employees/[id]` | Admin | Update employee |
| DELETE | `/api/employees/[id]` | Admin | Delete employee |
| POST | `/api/users/register` | Public | Create account |
