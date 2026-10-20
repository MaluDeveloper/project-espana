# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

- `frontend/` — the product. React 18 + TypeScript SPA, fully functional, all state in `localStorage`. All work in this repo happens here. Full picture: [frontend/docs/OVERVIEW.md](frontend/docs/OVERVIEW.md) · pending work: [frontend/docs/ROADMAP.md](frontend/docs/ROADMAP.md).

The backend (Spring Boot 3.3 / Java 21) is **not in this repo** — it was split out, history preserved, into its own repository at the sibling folder `../project-espana-backend` (see its own `CLAUDE.md` and `docs/OVERVIEW.md` / `docs/ROADMAP.md`). The frontend does not consume it yet: no `fetch`/`axios` call in `frontend/src` targets it, and login/cadastro/`ProtectedRoute` are still 100% `localStorage` mocks.

## Commands

All frontend commands run from `frontend/`. The project uses **Bun** (bun.lock/bun.lockb present) but npm works too.

```bash
bun install       # install deps
bun dev           # dev server at http://localhost:8080 (fixed port, see vite.config.ts)
bun build         # production build -> dist/
bun build:dev     # build in development mode
bun preview       # serve the production build locally
bun lint          # ESLint
bun test          # Vitest, run once
bun test:watch    # Vitest, watch mode
```

Run a single test file: `bun test src/test/example.test.ts` (Vitest picks up anything matching `src/**/*.{test,spec}.{ts,tsx}`, jsdom environment, setup file at `src/test/setup.ts`).

## Architecture (frontend)

**No real backend yet.** Every feature — auth, course progress, game scores, streaks, preferences — persists to `localStorage` under versioned keys, organized by technical layer (`pages/`, `components/`, `lib/`, `data/`), not by feature module. `TanStack Query` is wired into `App.tsx` but does no remote fetching; it's scaffolding for the eventual Supabase/backend integration.

Full architecture (provider nesting, routing table, localStorage keys per domain, business rules, intentional decisions like the disabled dark mode and Web Speech API placeholder): see [frontend/docs/OVERVIEW.md](frontend/docs/OVERVIEW.md). Known bugs and pending work: [frontend/docs/ROADMAP.md](frontend/docs/ROADMAP.md).