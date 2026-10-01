# 📄 Development Rules

## SynergySphere – Project Guidelines for AI & Human Collaboration

This document defines the development rules, coding standards, and best practices for the SynergySphere application. These rules ensure consistency, maintainability, security, and quality. Both AI assistants and human contributors must follow these guidelines.

---

## 1. General Principles

These rules apply to the entire project.

- ✅ Follow the project documentation (PRD, ARCHITECTURE, DESIGN) before writing code
- ✅ Keep the code clean, readable and well-structured
- ✅ Prioritize simplicity and maintainability
- ✅ Do not duplicate logic. Reuse existing components, utilities or services
- ✅ Make small, focused changes instead of large, risky edits
- ✅ Do not modify unrelated files
- ✅ Write self-explanatory code with meaningful variable and function names
- ✅ If something is unclear, check `docs/` first, then ask — never guess silently

---

## 2. Technology & Coding Standards

Rules related to the tech stack and coding style.

| Area | Rule |
|---|---|
| Language | Use TypeScript. Avoid `any` unless absolutely necessary |
| Framework | Follow React 18 best practices (function components + hooks) |
| Routing | All routes are declared in `src/App.tsx` |
| Styling | Use Tailwind CSS and follow the design system in DESIGN.md |
| UI Components | Use existing `src/components/ui/*` primitives before creating new ones |
| State (server) | Use TanStack Query via hooks in `src/hooks/api/` |
| State (client) | Use React Context / local state — no global stores without discussion |
| API Calls | Always go through the Axios instance in `src/lib/api.ts` |
| Backend | Keep route handlers thin; business logic in the route module or helpers |
| Validation | Validate every request body/params with Zod on the server |
| Database | All schema changes go through Drizzle (`schema.ts` + migrations) |
| Linting | Follow ESLint 9 config (`eslint.config.js`) — no warnings in new code |
| Formatting | Use Prettier defaults — run `npm run format` before committing |
| Dependencies | Use stable, well-maintained packages. Justify any new dependency |
| File Naming | Components/pages `PascalCase.tsx`, hooks `useThing.ts`, utils `kebab-case.ts` |
| Imports | Use the `@/` alias for `src/` imports — no long relative paths |

---

## 3. Project Structure

Follow the defined folder structure in ARCHITECTURE.md.

- ✅ Place reusable UI components in `src/components/ui/`
- ✅ Feature components go in `src/components/<feature>/` (e.g. `dashboard/`, `empty-states/`)
- ✅ Page components go in `src/pages/` (dashboard pages in `src/pages/dashboard/`)
- ✅ Data-fetching logic goes in `src/hooks/api/` — never inside UI components
- ✅ Server code stays inside `src/server/` (routes, middleware, db)
- ✅ Shared types live in `src/lib/api.ts` (client) and `src/server/types/` (server)
- ✅ Do not create new top-level folders without a clear reason

---

## 4. Git & Version Control

- ✅ Write clear commit messages: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`
- ✅ One logical change per commit — do not mix unrelated changes
- ✅ Never commit `.env` files, secrets, or API keys
- ✅ Pull/rebase before starting new work to avoid conflicts
- ❌ Never force-push to `main`
- ❌ Never commit generated files (`dist/`, `node_modules/`)

---

## 5. Security Rules

- ✅ Hash passwords with bcrypt — never store plain text
- ✅ Sign and verify JWTs using `JWT_SECRET` from environment variables
- ✅ Protect every non-public route with the auth middleware
- ✅ Validate and sanitize all user input (Zod)
- ✅ Keep CORS restricted to known origins in production
- ✅ Never expose stack traces or internal errors to clients
- ❌ Never log tokens, passwords, or personal data

---

## 6. Testing Rules

- ✅ Add or update tests for new utilities, hooks, and API routes
- ✅ Use Vitest + Testing Library (`npm test`)
- ✅ Test behavior, not implementation details
- ✅ Keep tests fast and independent of the network
- ✅ Run `npm test` and `npm run build` before opening a PR

---

## 7. Documentation Rules

- ✅ Update `docs/TASKS.md` when starting or finishing a task
- ✅ Update `docs/MEMORY.md` at the end of every working session
- ✅ Document new API endpoints in ARCHITECTURE.md
- ✅ Document new UI patterns in DESIGN.md
- ✅ Keep documentation in sync with reality — stale docs are worse than none

---

## 8. AI Collaboration Rules

Rules specifically for AI assistants (and humans reviewing AI output).

- ✅ Read `docs/` (PRD, ARCHITECTURE, RULES, DESIGN) before making changes
- ✅ Make the smallest change that fully solves the request
- ✅ Reuse existing components, hooks, and utilities — check before creating
- ✅ Explain non-obvious decisions in the response, not in code comments
- ✅ Leave `docs/MEMORY.md` updated with what was done and what's next
- ❌ Do not refactor unrelated code
- ❌ Do not add dependencies without explicit approval
- ❌ Do not rename files or move folders without being asked
