# ChampMaps — Agent Architecture Guide

> **For any AI coding agent working on this codebase.**
> Read this file fully before writing, editing, or deleting any code.

## Zero Hallucination Rule

- **Do not invent** file paths, exported names, types, or API shapes. Read the actual file first.
- **Do not assume** a function exists because it sounds reasonable. Verify with a file or symbol search.
- **If you are unsure**, say so and ask, or read the relevant source file before proceeding.
- **If a requested feature violates the architecture in this file, warn the user before writing any code.**

## Architecture: Feature-based + Hexagonal/Clean

The codebase is split into vertical feature slices under `src/features/`, each with four layers:

- **`domain/`** — pure types, interfaces (ports), and pure logic. No React, no I/O.
- **`application/`** — React hooks that orchestrate use cases using domain + `core/services`.
- **`infrastructure/`** — concrete adapters (HTTP, cache, parsers). Implements domain ports.
- **`ui/`** — React components. Read state from context, dispatch actions, import application hooks.

Cross-cutting concerns live outside features:

- **`core/`** — `ICache`, `IHttp`, `IFontLoader` ports and their adapters. `config.ts` for env vars. `services.ts` wires all adapters into named singletons consumed by application hooks.
- **`shared/`** — reusable geo math, utility functions, and UI atoms (icons, modals) used across features.
- **`data/`** — static JSON data files (themes, layouts).
- **`styles/`** — global CSS (8 files). Responsive breakpoints at `≤980px` and `≤760px`.

### Server-side API

The Contacts API lives in `server/` and is a standalone Bun HTTP server, completely independent of the Vite frontend. It has its own directory structure:

- **`server/store/`** — in-memory contact store and shared types.
- **`server/services/`** — server-side Nominatim geocoder.
- **`server/routes/`** — route handlers that return `Response` objects.
- **`server/index.ts`** — `Bun.serve()` entry point with routing and CORS.

**Do not import** from `src/` in `server/` files. The API server must not depend on React, Vite, or any browser API.

### Layer import rules

| Layer              | May import                                   | Must not import                        |
| ------------------ | -------------------------------------------- | -------------------------------------- |
| `domain/`          | nothing                                      | infrastructure, application, ui, React |
| `application/`     | domain, shared, core/config, core/services   | infrastructure directly                |
| `infrastructure/`  | domain, shared, core                         | application, ui, React                 |
| `ui/`              | domain, application, shared/ui, shared/utils | infrastructure directly                |
| `core/services.ts` | infrastructure adapters                      | any feature (no circular deps)         |
| `server/`          | only server-internal modules                 | anything in `src/`                     |

## State Management

- **Single source of truth**: `PosterContext` — React Context + `useReducer`.
- `posterReducer.ts` owns `PosterState`, `PosterForm`, and the `PosterAction` discriminated union.
- **No prop drilling** — components call `usePosterContext()` directly.
- Side-effect logic lives in application hooks: `useFormHandlers`, `usePosterGeneration`, `useExport`, `usePreviewRenderer`, `useContacts`.

## TypeScript Rules

- All new files must be `.ts` / `.tsx`. No `.js` in `src/`.
- `strict: false`, `allowJs: true` — gradual migration is acceptable.
- Use the `@/` alias (`src/` root) for all cross-feature imports. Never use `../../` across feature boundaries.
- Port interfaces go in `domain/ports.ts` or `core/*/ports.ts`. Adapters implement ports — never leak concrete types into domain or application code.

## Naming Conventions

- React components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilities / pure functions: `camelCase.ts`
- Port interfaces: `I` prefix — `ICache`, `IHttp`, `IGeocodePort`, `IContactsPort`
- CSS classes: `kebab-case`

## Environment Variables

All `VITE_*` env vars are accessed **only** through `src/core/config.ts`. Never read `import.meta.env.*` anywhere else.
See `.env.example` for the full list of supported variables.

The Contacts API server reads `CONTACTS_API_PORT` from `process.env` directly (not through Vite).

## Contribution and Documentation Rules

- External pull requests must be opened against `dev`, never `main`.
- AI-assisted coding is allowed only when the result is reviewed, refined, and aligned with the project architecture.
- Prefer standalone modules, components, hooks, constants, and utilities over hard-coded or tightly coupled implementations.
- In Markdown files, do not place a horizontal rule (`---`) immediately before a heading line such as `#`, `##`, or `###`.

## What NOT to Do

- ❌ Do not add logic to `App.tsx` — it must stay a thin shell.
- ❌ Do not import from `@/lib/`, `@/utils/`, `@/hooks/`, or `@/components/` — those directories no longer exist.
- ❌ Do not duplicate utility functions — check `shared/utils/` and `shared/geo/` first.
- ❌ Do not call `fetch()`, `localStorage`, or `new URL()` inside React components — use the port/adapter pattern via `core/services.ts`.
- ❌ Do not add CSS class names without a matching rule in `src/styles/`.
- ❌ Do not bypass `PosterContext` by prop-drilling state more than one level deep.
- ❌ Do not edit `bun.lock` or `package-lock.json` manually — run `bun install`.
- ❌ Do not import from `src/` inside `server/` — the API server is independent of the frontend.
