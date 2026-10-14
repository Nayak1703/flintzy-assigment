# Cadence — Social Media Post Scheduler

A frontend-only social media post scheduler built with **Next.js 15 (App Router) + TypeScript**. Compose posts for Facebook, Instagram, X and TikTok, schedule them, and manage everything from one dashboard. Includes a marketing landing page, a password-gated demo, and light/dark themes.

> **Live demo:** _https://flintzy-assigment.vercel.app/_
>
> **Demo password:** `cadence2026` (also shown on the landing page and right above the login field)

---

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (also type-checks and lints)
npm start          # serve the production build
npm run lint
```

### Routes

| Route | Description |
| --- | --- |
| `/` | Marketing landing page |
| `/login` | Password gate (password displayed above the field, with "Use it" autofill) |
| `/dashboard` | Post queue, grouped by day, with filters, search and retry |
| `/dashboard/compose` | Post composer with live per-platform previews |

### Demo controls

The flask icon in the sidebar footer opens **Demo controls**:

- **Simulate API error:** loads `/dashboard?simulate=error` to show the error state ("Try again" recovers).
- **Simulate empty account:** loads `/dashboard?simulate=empty` to show the empty state.
- **Reset demo data:** clears local changes and restores the seed.

Keyboard shortcuts: `N` opens the composer, `/` focuses search, `Ctrl/⌘ + Enter` schedules from the composer.

---

## How each requirement is covered

| # | Requirement | Implementation |
| --- | --- | --- |
| — | Mock data, at least 30 posts | `src/data/posts.json` has **35 posts** with `id`, `content`, `platforms`, `mediaUrl?`, `scheduledAt` (UTC ISO), `status`, `errorMessage` (failed only). They are served by a mock API in `src/lib/mock-api.ts`. |
| 1 | Queue grouped by day | `groupPostsByDay` (`src/lib/date.ts`) groups by the **local** calendar day: **Today, Tomorrow, then dates**, followed by an **Earlier** section (Yesterday, then older days, newest first). Each card shows a content preview, platform icons, scheduled time and a status badge. |
| 2 | Filters and search, persisted | Platform (multi), status (multi) and a content search (debounced 250 ms) are stored in URL query params, for example `?platform=x,tiktok&status=failed&q=jacket`. They survive refreshes, the back button and shared links (`src/lib/use-post-filters.ts`). |
| 3 | Composer | Text, multi-platform selection, optional image URL with live validation and preview, and a date + time picker (shadcn Calendar + time input + quick slots). |
| 4 | Live character counters | A ring counter per selected platform: X 280, Instagram 2,200, TikTok 2,200, Facebook 5,000. Overflow is highlighted in the preview, and the **Schedule** button is disabled (with the reason shown) while any platform is over its limit. The mock API validates again. |
| 5 | Future time, UTC storage | Past dates are disabled in the calendar. Any time `<= now` is rejected, and the check re-runs every 30 s while composing. The value is saved with `toISOString()` (UTC) and always displayed in the user's local time zone, which is named in the UI. |
| 6 | Optimistic retry | Clicking **Retry now** marks the post as published immediately. A mock call then runs with a **1 s delay** and a **20 % failure rate**; on failure the post is **rolled back** to its exact previous state and a toast explains why (`src/lib/posts-store.tsx`). |
| 7 | States and responsive layout | Skeleton loading, an error state with retry, an empty account state, and a "no results" state for filters. The layout is fully responsive: a sidebar on desktop, and on mobile a top bar, a sheet menu, a floating compose button and horizontally scrollable filter chips. |

---

## Key decisions

- **Next.js App Router + TypeScript (strict).** Pages are thin server components, and interactive parts are client components.
- **Mock backend in the browser.** `mock-api.ts` imports the JSON seed, adds latency and persists to `localStorage`, so created posts, retries and deletes survive a refresh. No network server is needed for data.
- **Seed rebasing.** Seed timestamps are UTC values relative to an `anchor` date. On the first load of each day they are shifted so the anchor maps to local midnight, so "Today" and "Tomorrow" stay meaningful whenever the demo is opened. Posts you create are kept across re-seeds.
- **Simulated publishing worker.** When data loads, any `scheduled` post whose time has passed becomes `published`, so the queue never shows "scheduled in the past".
- **State management.** A small `useReducer` + Context store instead of a library. The retry flow (optimistic update → API → commit or rollback) is explicit and easy to follow. Posts that are mid-retry stay visible even if the active filter would hide them, so the user always sees the outcome.
- **Character counting.** Counts grapheme clusters via `Intl.Segmenter`, so an emoji counts as one character. (X's real weighting, such as URLs counting as 23, is out of scope.)
- **Password gate.** A Next.js route handler checks the demo password and sets an httpOnly cookie; `middleware.ts` protects `/dashboard/*`. The password is public by design, so **this is a demo gate, not real authentication**.
- **UI stack.** Tailwind CSS v4, **shadcn/ui** (Radix) for accessible primitives, **Aceternity UI** patterns (Spotlight, Text Generate, Flip Words, Bento Grid, Container Scroll, Moving Border, Lamp, Background Beams, Card Spotlight, Infinite Moving Cards), and **Motion** for animation. Animations respect `prefers-reduced-motion`.
- **Theming.** `next-themes` with dark as the default. The theme toggle uses a circular reveal via the View Transitions API, and falls back to an instant switch where it isn't supported.

## Assumptions

- **Retry** re-attempts publishing now. On success the post becomes `published` and keeps its original scheduled time.
- A post matches a platform filter if it targets **any** of the selected platforms. Multiple statuses are OR-ed, and the different filter types are AND-ed.
- Search is a case-insensitive substring match on post content.
- Image URLs only need to be valid `http(s)` URLs. An image that fails to load shows a warning but doesn't block scheduling.
- "Halcyon Outdoor" and its accounts are fictional demo data, and nothing is ever published.

## Project structure

```
src/
  app/                    # routes: landing, login, dashboard, compose, auth API
  components/
    aceternity/           # Aceternity UI components (adapted)
    ui/                   # shadcn/ui components
    landing/              # marketing sections
    dashboard/            # shell, sidebar, queue, filters, post card, states
    composer/             # composer, counters, date-time picker, previews
    auth/ brand/ theme/
  data/posts.json         # 35 seed posts
  lib/                    # types, mock API, store, filters, dates, auth
  middleware.ts           # protects /dashboard
```
