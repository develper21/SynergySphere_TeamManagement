# 🏛️ System Architecture

## SynergySphere – Advanced Team Collaboration & Project Management

This document describes the overall system architecture, technology stack, folder structure, data flow, and key design decisions for the SynergySphere application.

---

## 1. High-Level Architecture

SynergySphere follows a client-server architecture using React (Vite SPA) and an Express REST API backed by PostgreSQL.

```
┌──────────────┐   HTTPS/JSON   ┌──────────────────────┐   REST/JSON   ┌──────────────────────┐   Drizzle/SQL   ┌──────────────────┐
│              │ ─────────────► │                      │ ────────────► │                      │ ──────────────► │                  │
│     User     │                │   React SPA Client   │               │   Express API Server │                 │   PostgreSQL     │
│  (Browser)   │ ◄───────────── │   (React 18 + Vite)  │ ◄──────────── │   (Node + Express)   │ ◄────────────── │   (Drizzle ORM)  │
│              │                │                      │               │                      │                 │                  │
└──────────────┘                └──────────────────────┘               └──────────────────────┘                 └──────────────────┘
                                         │                                     │
                                         │ TanStack Query (server state)       │ JWT Auth · Zod Validation
                                         │ Context API (client state)          │ bcrypt · Multer · Cloudinary
                                         ▼                                     ▼
                                 ┌──────────────┐                      ┌──────────────┐
                                 │ localStorage │                      │  Cloudinary  │
                                 │ token + user │                      │   (avatars)  │
                                 └──────────────┘                      └──────────────┘
```

---

## 2. Technology Stack

Technologies used in the project and their purpose.

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React 18 | UI framework |
| Language | TypeScript 5 | Type safety and better developer experience |
| Build Tool | Vite 6 | Fast build tool and dev server |
| Routing | React Router 6 | Client-side SPA routing |
| Styling | Tailwind CSS 3 | Modern and responsive UI |
| UI Components | Radix UI + shadcn/ui | Accessible component primitives |
| Server State | TanStack Query 5 | Server state, caching, mutations |
| Animations | GSAP + Framer Motion | Landing animations & micro-interactions |
| Charts | Recharts | Dashboard analytics graphs |
| Backend | Express 4 | REST API and business logic |
| Database | PostgreSQL (pg) | Relational data storage |
| ORM | Drizzle ORM | Type-safe database queries & migrations |
| Authentication | JWT (jsonwebtoken) | User authentication and authorization |
| Password Hashing | bcrypt | Secure password storage |
| Validation | Zod | Request schema validation |
| File Uploads | Multer + Cloudinary | Avatar & media uploads |
| Testing | Vitest + Testing Library | Unit & component tests |
| Code Quality | ESLint 9 + Prettier | Linting and formatting |
| Deployment | Vercel | Hosting and serverless functions |

---

## 3. Folder Structure

The project follows a feature-friendly folder structure to keep the code organized and scalable.

```text
synergysphere/
├── api/                        # Vercel serverless entry
│   └── index.ts                #   wraps the Express app
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Routes & providers
│   ├── index.css               # Design tokens & claymorphic styles
│   ├── pages/                  # Route-level pages
│   │   ├── Landing.tsx         #   Marketing landing page
│   │   ├── SignUp.tsx          #   Registration
│   │   ├── SignIn.tsx          #   Login
│   │   ├── ForgotPassword.tsx  #   Password reset request
│   │   ├── ResetPassword.tsx   #   Password reset form
│   │   └── dashboard/          #   Authenticated app pages
│   │       ├── DashboardHome.tsx
│   │       ├── Projects.tsx
│   │       ├── Tasks.tsx
│   │       ├── Members.tsx
│   │       ├── Discussion.tsx
│   │       ├── Notifications.tsx
│   │       ├── AIPanel.tsx
│   │       ├── Templates.tsx
│   │       ├── Billing.tsx
│   │       ├── Settings.tsx
│   │       └── Profile.tsx
│   ├── layouts/
│   │   └── DashboardLayout.tsx # Protected dashboard shell (sidebar + topbar)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui primitives (Button, Dialog, …)
│   │   ├── dashboard/          # DashboardSidebar, DashboardTopbar
│   │   ├── empty-states/       # Reusable empty state components
│   │   ├── Logo.tsx            # Brand logo
│   │   └── NavLink.tsx         # Sidebar nav link
│   ├── hooks/
│   │   ├── api/                # useAuth, useProjects, useTasks, useMembers,
│   │   │                       # useDiscussions, useNotifications, useDashboard
│   │   └── use-mobile.tsx      # Responsive helper hook
│   ├── lib/
│   │   ├── api.ts              # Axios client, interceptors & shared types
│   │   └── utils.ts            # cn() and helpers
│   ├── server/                 # Backend (Node/Express)
│   │   ├── index.ts            # Dev server entry (tsx watch, port 3001)
│   │   ├── app.ts              # Express app factory & route mounting
│   │   ├── routes/             # auth, projects, tasks, members,
│   │   │                       # discussions, notifications, dashboard
│   │   ├── middleware/         # auth (JWT), error, upload (Multer)
│   │   ├── db/
│   │   │   ├── schema.ts       # Drizzle schema (users, projects, tasks, …)
│   │   │   ├── index.ts        # DB connection
│   │   │   ├── migrations/     # Generated SQL migrations
│   │   │   └── seed.ts         # Database seeding
│   │   └── types/index.ts      # Server-side types
│   └── test/                   # Vitest setup & tests
├── postman/                    # API collection for testing
├── docs/                       # This documentation suite
├── vite.config.ts              # Vite config (port 8080, /api proxy → 3001)
├── drizzle.config.ts           # Drizzle Kit config
├── vercel.json                 # Vercel deployment config
└── package.json                # Scripts & dependencies
```

---

## 4. Database Schema

PostgreSQL schema managed with Drizzle ORM (`src/server/db/schema.ts`).

| Table | Purpose | Key Columns |
|---|---|---|
| `users` | Registered users | id, email, password_hash, name, avatar_url, role |
| `projects` | Team projects | id, name, description, priority, status, due_date, created_by |
| `project_members` | Many-to-many membership | project_id, user_id, role, joined_at |
| `tasks` | Project tasks | project_id, title, status, priority, assignee_id, created_by |
| `discussions` | Project chat messages | project_id, user_id, content |
| `notifications` | User notifications | user_id, type, title, description, read, actionable |
| `activities` | Activity log feed | user_id, project_id, action, entity_type, entity_id |

**Enums:** `user_role` (admin/manager/member), `project_priority` (low/medium/high), `project_status` (active/completed/archived), `task_status` (todo/in-progress/done), `task_priority` (low/medium/high), `notification_type` (invite/task/message/update)

All primary keys are UUIDs; foreign keys use `ON DELETE CASCADE` (or `SET NULL` for task assignees).

---

## 5. API Design

Express routes mounted under `/api` (dev proxy `:8080/api` → `:3001/api`).

| Router | Base Path | Responsibilities |
|---|---|---|
| authRoutes | `/api/auth` | register, login, me, profile, avatar, forgot/reset password |
| projectRoutes | `/api/projects` | CRUD projects, add/remove members |
| taskRoutes | `/api/tasks` | CRUD tasks, status updates, assignment |
| memberRoutes | `/api/members` | Member listing, invites, role updates |
| discussionRoutes | `/api/discussions` | List & post project messages |
| notificationRoutes | `/api/notifications` | List, mark read, accept/reject invites |
| dashboardRoutes | `/api/dashboard` | Aggregated stats, charts, activity feed |

**Standard response shape:**

```json
{ "success": true, "data": { }, "message": "optional message" }
```

**Health check:** `GET /health` or `GET /api/health`

---

## 6. Authentication & Authorization Flow

1. Client posts credentials to `/api/auth/login` or `/api/auth/register`
2. Server validates with Zod, checks bcrypt hash, signs a JWT (30d expiry)
3. Client stores `{ token, user }` in `localStorage`
4. Axios request interceptor attaches `Authorization: Bearer <token>`
5. `src/server/middleware/auth.ts` verifies JWT on protected routes
6. On `401`, the response interceptor clears storage and redirects to `/signin`
7. `DashboardLayout` guards all `/dashboard/*` routes client-side

---

## 7. Data Flow

1. **User action** → React component / mutation hook
2. **API call** → Axios instance (`src/lib/api.ts`)
3. **Validation** → Zod schemas on the server
4. **Business logic** → Route handlers in `src/server/routes/`
5. **Persistence** → Drizzle ORM → PostgreSQL
6. **Response** → `{ success, data }` JSON
7. **Cache update** → TanStack Query invalidates affected queries
8. **UI re-render** → Components refresh with fresh data

---

## 8. Deployment Architecture

- **Frontend:** Vercel (static build `dist/spa` via `vite build`)
- **API:** Vercel serverless function (`api/index.ts` wraps the Express app)
- **Database:** Managed PostgreSQL (connection via `DATABASE_URL`)
- **Migrations:** `npm run db:push` (Drizzle Kit)
- **Environments:** `.env.local` (dev), `.env.production` (prod), `.env.example` (template)

**Key environment variables:** `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `VITE_API_URL`, `SMTP_*`, `CLOUDINARY_*`, `FRONTEND_URL`

---

## 9. Key Design Decisions

| # | Decision | Rationale |
|---|---|---|
| 1 | Vite + Express in one repo | Shared TypeScript types between client & server |
| 2 | Drizzle ORM over raw SQL / Prisma | Type-safe queries with lightweight runtime |
| 3 | JWT in `localStorage` | Simple stateless auth for the SPA |
| 4 | TanStack Query for server state | Caching, retries and invalidation for free |
| 5 | UUID primary keys | Safe IDs for URLs and distributed generation |
| 6 | Axios interceptors for auth | Single place to attach tokens & handle 401 |
| 7 | Serverless-ready API entry | Same Express app runs locally & on Vercel |
| 8 | Feature-based page + hook split | Pages stay thin; logic lives in `hooks/api` |
