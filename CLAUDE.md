# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a monorepo with two independent projects that are **not yet wired together**:

- `frontend/` — the actual product. React 18 + TypeScript SPA, fully functional, all state in `localStorage`. This is where nearly all work happens today. Full picture: [frontend/docs/OVERVIEW.md](frontend/docs/OVERVIEW.md) · pending work: [frontend/docs/ROADMAP.md](frontend/docs/ROADMAP.md).
- `backend/` — Spring Boot 3.3 / Java 21, hexagonal architecture (see below), with a real `user` bounded context (Profile + UserPreferences) and real Supabase JWT auth enforced end-to-end. **Still not consumed by the frontend at all** — no `fetch`/`axios` call in `frontend/src` targets it yet; the frontend's login/cadastro/`ProtectedRoute` are still 100% `localStorage` mocks. Full picture: [backend/docs/OVERVIEW.md](backend/docs/OVERVIEW.md) · pending work: [backend/docs/ROADMAP.md](backend/docs/ROADMAP.md) (the authoritative status doc — check it before assuming a backend feature doesn't exist).

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

**No real backend yet.** Every feature — auth, course progress, game scores, streaks, preferences — persists to `localStorage` under versioned keys, organized by technical layer (`pages/`, `components/`, `lib/`, `data/`), not by feature module. `TanStack Query` is wired into `App.tsx` but does no remote fetching; it's scaffolding for the eventual Supabase/backend integration.

Full architecture (provider nesting, routing table, localStorage keys per domain, business rules, intentional decisions like the disabled dark mode and Web Speech API placeholder): see [frontend/docs/OVERVIEW.md](frontend/docs/OVERVIEW.md). Known bugs and pending work: [frontend/docs/ROADMAP.md](frontend/docs/ROADMAP.md).