# 🎨 Design System

## SynergySphere – Collaborate. Plan. Deliver.

This document defines the visual design system, UI components, and user experience patterns for SynergySphere. The goal is to create a modern, minimal, and friendly interface with a consistent **claymorphic** look and feel.

---

## 1. Design Principles

| | | |
|:---:|:---:|:---:|
| 👥 **User-Centered** | 🫧 **Soft & Claymorphic** | 🎯 **Consistent** |
| *Simple and intuitive for teams of every size.* | *Soft shadows, rounded shapes, and a tactile feel.* | *One unified design language across the app.* |

---

## 2. Color Palette

Primary colors used across the application (defined as HSL tokens in `src/index.css`).

| Color | Hex (approx) | Token (Light) | Usage |
|---|---|---|---|
| 🟦 Primary | `#3C57DD` | `hsl(230 70% 55%)` | Main brand color — buttons, links, active states |
| 🟪 Secondary | `#B870DB` | `hsl(280 60% 65%)` | Secondary actions — badges, highlights, gradients |
| 🟩 Success / Accent | `#2EB85C` | `hsl(160 60% 45%)` | Success messages, completed tasks, toasts |
| 🟨 Warning | `#F59F0A` | `hsl(38 92% 50%)` | Warnings, caution states, "In Progress" tasks |
| 🟥 Error / Destructive | `#DF3A3A` | `hsl(0 72% 55%)` | Error messages, validation, destructive actions |
| 🟦 Info | `#30ABE8` | `hsl(200 80% 55%)` | Info alerts, neutral highlights |
| ⬜ Background | `#F1F5F9` | `hsl(210 40% 96%)` | Page background |
| ⬜ Card | `#F8FAFC` | `hsl(210 40% 98%)` | Cards, sidebars, nav |
| ⬛ Foreground | `#0F1729` | `hsl(222 47% 11%)` | Primary text |
| ◻️ Muted | `#E4EBF1` | `hsl(210 30% 92%)` | Muted surfaces, insets |
| ◻️ Muted Foreground | `#4B5A6B` | `hsl(215 16% 47%)` | Secondary text |
| ◻️ Border / Input | `#DAE0E7` | `hsl(214 20% 88%)` | Borders and input outlines |

**Gradient text** uses `linear-gradient(135deg, primary → secondary)` via the `.gradient-text` utility.

---

## 3. Typography

We use **Nunito** for body text and **Quicksand** for headings — rounded, friendly, and highly readable.

| | |
|:---:|---|
| **Aa** | **Nunito** — Primary Font<br>Body text, UI labels, forms.<br>`400 · 500 · 600 · 700 · 800 · 900` |
| **Aa** | **Quicksand** — Display Font<br>All headings `h1`–`h6`, brand name.<br>`400 · 500 · 600 · 700` |

**Type scale:**

| Element | Class | Size |
|---|---|---|
| Display hero | `text-5xl md:text-7xl font-black` | 48–72px |
| Page title | `text-4xl font-black` | 36px |
| Section heading | `text-2xl font-bold` | 24px |
| Card title | `text-xl font-bold` | 20px |
| Body | default | 16px |
| Small / meta | `text-sm` | 14px |
| Badge / caption | `text-xs` | 12px |

---

## 4. UI Components

Standard components to be used throughout the app (shadcn/ui + Radix primitives in `src/components/ui/`).

### Buttons

| Variant | Style |
|---|---|
| Primary | `.clay-button bg-primary text-primary-foreground` |
| Secondary | `.clay-button bg-card text-foreground` |
| Destructive | `.clay-button bg-destructive text-destructive-foreground` |
| Ghost / Muted | `.clay-button bg-muted text-foreground` |

### Core Components

| Component | Class / File | Notes |
|---|---|---|
| Card | `.clay-card` | Rounded 1.5rem, soft clay shadow, hover lift |
| Inset surface | `.clay-card-inset` | Pressed-in look for nested content |
| Input | `.clay-input` | Inset shadow, focus ring in primary |
| Nav bar | `.clay-nav` | Floating, blurred glass pill (landing) |
| Sidebar | `.clay-sidebar` | Card surface with clay shadow |
| Badge | `.clay-badge` | Rounded 0.75rem, semibold |
| Dialog / Sheet | `ui/dialog.tsx`, `ui/sheet.tsx` | Radix-based modals |
| Toasts | `sonner` + `ui/toaster` | Success, error, info feedback |
| Tabs | `ui/tabs.tsx` | Project / task view switching |
| Table | `ui/table.tsx` | Members, tasks lists |
| Avatar | `ui/avatar.tsx` | User identity (Cloudinary images) |
| Progress | `ui/progress.tsx` | Project & task completion |
| Skeleton | `ui/skeleton.tsx` | Loading placeholders |

---

## 5. Claymorphism & Shadows

The signature look — soft extruded surfaces. Shadow tokens in `src/index.css`:

| Token | Value | Usage |
|---|---|---|
| `--clay-shadow-light` | `8px 8px 16px …` | Cards, sidebars |
| `--clay-shadow-sm` | `4px 4px 8px …` | Buttons, badges, nav |
| `--clay-shadow-inset` | `inset 4px 4px 8px …` | Inputs, inset surfaces |
| `--clay-shadow-hover` | `6px 6px 12px …` | Hover states |

**Radii:** `--radius: 1rem` globally; `.clay-card` uses `1.5rem`; badges `0.75rem`. The `.clay-blob` utility creates the organic `30% 70% 70% 30%` decorative blobs on the landing page.

---

## 6. Spacing & Layout

- **Container:** centered, max-width `1400px` (2xl), `2rem` side padding
- **Grid:** `gap-6` between cards; dashboard grid `md:grid-cols-2 lg:grid-cols-3`
- **Card padding:** `p-6` standard, `p-8` for hero/feature cards
- **Section spacing:** `py-16` – `py-20` between landing sections
- **Sidebar:** fixed width, icons + labels; collapses to mobile drawer (Sheet)
- **Topbar:** sticky, blurred card surface, search + notifications + avatar

---

## 7. Iconography

- Use **lucide-react** icons only — consistent 24px stroke icons
- Default size `w-5 h-5`; feature icons `w-7 h-7` inside `.clay-card-inset` tiles
- Icon color matches semantic token (primary, success, warning, destructive)
- No mixed icon libraries

---

## 8. Animation & Motion

- **Landing page:** GSAP + ScrollTrigger — staggered hero, stats, feature and pricing card reveals (`.hero-*`, `.stat-item`, `.feature-card`, `.pricing-card`)
- **UI feedback:** Framer Motion for small enter/exit animations
- **Micro-interactions:** Tailwind transitions (`transition-transform`, hover scale on icon tiles)
- **Accordion:** `tailwindcss-animate` keyframes (`accordion-down/up`)
- Keep animations under 500ms; respect `prefers-reduced-motion`

---

## 9. Dark Mode

- Toggled via the `.dark` class (`darkMode: ["class"]` in Tailwind config)
- All tokens flip through CSS variables — components never hardcode colors
- Dark palette: background `hsl(222 47% 8%)`, card `hsl(222 47% 12%)`, primary `hsl(230 70% 60%)`
- Clay shadows are re-tuned in dark mode for depth on dark surfaces
- Every new component must look correct in both themes

---

## 10. Responsive & Accessibility

**Breakpoints (Tailwind defaults):** `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1400`

- Mobile-first: single column, Sheet-based sidebar, stacked stat cards
- `use-mobile.tsx` hook detects touch layouts
- Keyboard navigable via Radix primitives (focus traps, ARIA roles)
- Visible focus rings (`--ring`) on all interactive elements
- Color is never the only signal — pair with icons and labels
