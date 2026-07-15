# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a monorepo with two independent projects that are **not yet wired together**:

- `frontend/` — the actual product. React 18 + TypeScript SPA, fully functional, all state in `localStorage`. This is where nearly all work happens today.
- `backend/` — a brand-new, mostly-empty Spring Boot 3.3 / Java 21 skeleton (`/api/health` endpoint, H2 in-memory DB, CORS locked to `http://localhost:8080`). Not yet consumed by the frontend. This is the start of the "Fase 2 — Backend Real" migration described in `DOCUMENTACAO.md`.

Always check which project a task belongs to before touching files — `cd frontend` or `cd backend` first, since there is no root-level build tooling tying them together.

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

Backend (from `backend/`):

```bash
./mvnw spring-boot:run   # run on port 8081
./mvnw test              # run tests
```

## Architecture (backend)

The backend follows a hexagonal (ports & adapters) layout under `backend/src/main/java/com/spanishai/backend/`:

- `domain/model` — domain entities (framework-free).
- `domain/exception` — domain-level exceptions.
- `domain/ports/in/<context>` — inbound ports (use case interfaces + command records), one subpackage per bounded context (e.g. `user`).
- `domain/ports/out/<context>` — outbound ports (repository interfaces), one subpackage per bounded context.
- `application/service/<context>` — use case implementations (`@Service`), one subpackage per bounded context.
- `adapter/in/rest/api` — all `@RestController` classes live here directly (not split by context).
- `adapter/in/rest/mapper/<context>` — REST-layer mappers (domain <-> response DTO), one subpackage per bounded context.
- `adapter/in/rest/request/<context>` / `adapter/in/rest/response/<context>` — request/response DTOs, one subpackage per bounded context.
- `adapter/out/persistence/<context>` — JPA repositories + persistence adapters implementing the outbound ports, one subpackage per bounded context.
- `adapter/out/persistence/mapper/<context>` — persistence-layer mappers (domain <-> JPA entity), one subpackage per bounded context.
- `adapter/out/persistence/entity` — JPA entities, shared/flat (not split by context) since they're framework plumbing, not domain boundaries.
- `infrastructure/config` — cross-cutting Spring config (CORS, security, OpenAPI, JPA auditing).
- Cross-cutting REST concerns that aren't controllers (e.g. `GlobalExceptionHandler`) stay directly under `adapter/in/rest`, not inside `api`.

**Rule for new backend work:** when adding a new bounded context (e.g. `course`, `game`), mirror the `user` context's package layout exactly — create the same `<context>` subpackage in each of `domain/ports/in`, `domain/ports/out`, `application/service`, `adapter/out/persistence`, `adapter/out/persistence/mapper`, and `adapter/in/rest/mapper` (plus `request`/`response` if it has its own DTOs). Controllers always go in the single shared `adapter/in/rest/api`, not a per-context subpackage.

## Architecture (frontend)

**No real backend yet.** Every feature — auth, course progress, game scores, streaks, preferences — persists to `localStorage` under versioned keys. `TanStack Query` is wired into `App.tsx` but does no remote fetching; it's scaffolding for the eventual Supabase/backend integration.

Provider nesting in `App.tsx`: `ErrorBoundary` → `ThemeProvider` (forced to `light` — dark mode intentionally disabled, see below) → `QueryClientProvider` → `TooltipProvider` → `LanguageProvider` → `BrowserRouter`.

Routing: public routes (`/`, `/login`, `/cadastro`) plus a `ProtectedRoute` layout wrapping `/dashboard/*`, `/jogos/*`, `/cursos/*`, `/aula/:id`, `/dele/:id`. `ProtectedRoute` (`src/components/ProtectedRoute.tsx`) just checks for `localStorage["spanish-ai-user"]` — swap this for a real session check once the backend lands.

### Core domains and their localStorage keys

- **Course content** — `src/data/courses.ts` defines the pedagogical hierarchy: `Course (level A1-B2) > Chapter > Topic > Block/Exercise/LexiconEntry`. Static data, no persistence.
- **Course progress** — `src/lib/course-progress.ts`, key `spanish-ai-course-v1`. Tracks topics read, exercises correct, quiz scores, exam scores, study streak. Chapter completion = `50% topics read + 30% exercises correct + 20% (quiz ≥ 70%)`. Chapters/levels unlock at `≥ 80%` completion of the previous one.
- **Game progress** — `src/lib/progress.ts`, key `spanish-ai-progress-v1`. Shape: `{ [catId]: { [levelId]: { [stage]: { stars, xp, completedAt } } } }`.
- **Dashboard aggregation** — `src/lib/dashboard-stats.ts` combines the two progress modules and adds daily missions, 8 achievement badges, total XP (`Math.floor(XP/100)+1` = user level), weekly activity, and a real per-day study-time heartbeat (`spanish-ai-study-time-v1`, updated via `registerStudyHeartbeat()` every 30s while the tab is visible — see `Capitulo.tsx`).
- **Games** — `src/lib/stage-builders.ts` procedurally builds stage content for the three implemented games (Memória, Lacunas/GapsGame, Caça-palavras/WordSearchGame); others are marked "em breve" in `src/data/games.ts`.
- **i18n** — `src/i18n/` supports `pt` and `en` only, detected from `navigator.language` or `localStorage["spanish-ai-locale"]`. Use `useT()` / `useLanguage()`. Bilingual course/city content uses helper `pickL(pt, en, locale)` / `pickLArr(...)`.

### Known traps (see `DOCUMENTACAO.md` for full bug log)

- `todayIso()` is duplicated in `dashboard-stats.ts` and `course-progress.ts`, and both use UTC (`toISOString().slice(0,10)`) instead of local time — day-rollover logic (streaks, daily missions) can be off by hours for non-UTC users. Fix in both places if touched, or centralize.
- The AI-powered writing correction in `src/pages/Aula.tsx` (`mockAnalyze`) is entirely mocked — it does not analyze the input text at all. This is flagged as the product's core promise still being fake; treat any related work as high-impact.
- `GoogleAuthButton.tsx` and the ranking leaderboard in `DashboardHome.tsx` are partially/fully mocked (real user XP is live, competitor list is not).
- Password change in `DashboardPerfilEditar.tsx` compares plaintext in `localStorage` — acceptable only because there's no backend yet; must become server-side hash+salt when auth moves to the backend, never client-side plaintext comparison again.

### Notable intentional decisions

- Dark mode is disabled on purpose (`forcedTheme="light"` in `App.tsx`) for landing-page visual consistency, not an oversight.
- Audio pronunciation uses the browser's native Web Speech API (`AudioButton.tsx`) as a placeholder until real recorded audio is available — expect inconsistent behavior across browsers (notably Firefox).