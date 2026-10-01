# 🧠 Project Memory

## SynergySphere – Context, Progress & Important Notes

This document keeps track of the current state of the project, important decisions, and things to remember. It helps maintain continuity across development sessions and for new contributors.

---

| 📅 Last Updated | 👤 Current Phase | 🟢 Project Health |
|:---:|:---:|:---:|
| **Oct 1, 2026** | **Phase 7** | On Track |
| 10:30 AM | Quality & Deployment | 30/33 tasks done |

---

## 🎯 Current Status

> ✅ Project setup completed (React, TypeScript, Vite, Tailwind)
> ✅ Git repository initialized and pushed to GitHub
> ✅ Database schema created (Drizzle + PostgreSQL, 7 tables)
> ✅ Authentication (signup, login, JWT, protected routes) completed
> ✅ Core features (dashboard, projects, tasks, members, discussions, notifications) completed
> ✅ AI panel, templates, profile & settings completed
> ✅ Deployed to Vercel (serverless API via `api/`)
> 🔄 Working on Billing / Stripe integration (UI in progress)

---

## ✅ Completed Tasks

| # | Task | Completed On |
|---|---|---|
| 1.1 | Initialize Vite + React + TypeScript project | Sep 6, 2025 |
| 1.2 | Configure Tailwind CSS | Sep 6, 2025 |
| 1.3 | Set up Git repository | Sep 6, 2025 |
| 2.1 | Define claymorphic design tokens | Sep 12, 2025 |
| 2.2 | Build core UI components | Sep 15, 2025 |
| 3.1 | Set up Express server | Oct 2, 2025 |
| 3.2 | Design database schema (Drizzle) | Oct 10, 2025 |
| 3.3 | Auth routes + JWT middleware | Oct 18, 2025 |
| 4.1 | Landing page | Nov 2, 2025 |
| 4.2 | Implement sign up page | Nov 5, 2025 |
| 4.3 | Implement sign in page | Nov 5, 2025 |
| 4.4 | Forgot / reset password pages | Nov 8, 2025 |
| 4.5 | Protect dashboard routes | Nov 10, 2025 |
| 5.1 | Dashboard home (stats, charts, activity) | Dec 15, 2025 |
| 5.2 | Projects CRUD + cards | Jan 10, 2026 |
| 5.3 | Tasks kanban board | Jan 20, 2026 |
| 5.4 | Members management + invites | Feb 2, 2026 |
| 5.5 | Project discussions | Feb 14, 2026 |
| 5.6 | Notifications center | Mar 3, 2026 |
| 6.1 | AI planning panel | Apr 12, 2026 |
| 6.2 | Templates gallery | Apr 20, 2026 |
| 6.4 | Profile & settings pages | May 5, 2026 |
| 7.1 | Unit & component tests | Jun 15, 2026 |
| 7.3 | Vercel deployment | Sep 16, 2026 |

## 🔄 In Progress

| # | Task | Started On |
|---|---|---|
| 6.3 | Billing page (Stripe integration) | Sep 20, 2026 |

## ⬜ Up Next

| # | Task | Notes |
|---|---|---|
| 7.2 | Real-time updates (WebSockets) | Live chat & notifications |
| 7.4 | E2E testing suite | Playwright candidate |

---

## 🗝️ Key Decisions

- **Claymorphism design** — soft shadows (`--clay-shadow-*`), rounded cards (1.5rem), Nunito + Quicksand fonts
- **Drizzle ORM over Prisma** — lighter runtime, type-safe SQL, easy migrations (`npm run db:push`)
- **JWT in localStorage** — stateless auth; axios interceptors attach the token and handle 401 redirects
- **TanStack Query** for all server state — no Redux; client state stays in Context/local state
- **Single Express app, two hosts** — `src/server/index.ts` for dev (port 3001), `api/index.ts` for Vercel serverless
- **UUID primary keys** everywhere; cascade deletes on ownership relations

## 📌 Important Notes

- **Ports:** frontend on `8080` (Vite), API on `3001`; Vite proxies `/api` → `localhost:3001`
- **Env files:** `.env.local` (dev), `.env.production` (prod) — copied from `.env.example`
- **Never commit** `.env*`, secrets or API keys; `JWT_SECRET` must stay private
- **DB commands:** `npm run db:push` (migrate), `npm run db:seed` (seed data)
- **API testing:** use the Postman collection in `postman/`
- **Response contract:** `{ success, data, message }` — see `src/lib/api.ts`
- **401 handling:** global interceptor clears storage and redirects to `/signin`

## ⚠️ Known Issues

- Billing page UI exists but Stripe is not wired up yet (6.3)
- Discussions/notifications are polling-based — WebSockets pending (7.2)
- A few pages still show placeholder content where backend endpoints are partial

## 🚀 Next Session Plan

1. Finish Stripe integration for the Billing page (6.3)
2. Add WebSocket layer for real-time discussions & notifications (7.2)
3. Re-run `npm test` + `npm run build` and update `docs/TASKS.md`
