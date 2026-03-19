# Contributing to ChampMaps

Thanks for your interest in contributing. This guide explains the required workflow and the engineering standards used in this repository.

These requirements exist to keep the codebase coherent, extensible, and maintainable as the project grows. The goal is not extra process, but contributions that are easy to review, safe to build on, and consistent with the long-term architecture.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Champ-Deep/ChampMaps.git
cd ChampMaps
bun install
```

### 2. Optional: configure environment variables

```bash
cp .env.example .env
```

Environment variables are optional for local development. Check [`.env.example`](./.env.example) for the available entries.

### 3. Start the development server

```bash
bun run dev
```

The app will be available at `http://localhost:5173`.

### 4. Optional: start the Contacts API server

```bash
bun run api
```

The Contacts API will be available at `http://localhost:7201`. This is only needed when working on or testing the contact database integration.

## Project Structure

ChampMaps has two parts:

| Component | Location | Runtime | Purpose |
| --------- | -------- | ------- | ------- |
| Frontend | `src/` | Vite + React | Map poster UI, theme engine, export |
| Contacts API | `server/` | Bun.serve() | REST API for contact database integration |

The frontend is a static SPA built with Vite. The Contacts API is a standalone Bun HTTP server. In Docker, Nginx serves the frontend and proxies `/api/` requests to the API service.

## Environment Variables

Environment variables are documented in [`.env.example`](./.env.example).

- They are optional for most local work.
- For testing, they must not be set unless a specific test case explicitly requires them.
- Do not assume environment values are present for core functionality.
- Access frontend environment values only through `src/core/config.ts`.
- The Contacts API reads `CONTACTS_API_PORT` directly from `process.env`.

## Branch Strategy

The repository follows a linear promotion model:

```text
dev -> beta -> main
```

| Branch | Purpose                                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------------------- |
| `dev`  | Active development. All feature branches are created from here and all external PRs target this branch first. |
| `beta` | Staging or pre-release testing. Changes are promoted here from `dev` when they are ready for broader testing. |
| `main` | Production. Changes reach this branch only after they were verified in `beta`.                                |

Always branch from `dev` and always open your pull request against `dev`.

Pull requests must not target `main` directly. PRs opened against `main` will be redirected or closed.

## Contribution Flow

1. Pick an existing issue, or open a new issue first to discuss the bug or feature.
2. Create a branch from `dev` with a short descriptive name such as `fix/geocoding-error` or `feat/svg-export`.
3. Implement the change in a focused, minimal diff.
4. Run `bun install`.
5. Run `bun run build` and verify the build passes before opening a PR.
6. If your change touches the Contacts API, verify the server starts with `bun run api`.
7. Open a pull request against `dev` and fill out the pull request template completely.
8. Add screenshots for visible UI changes.
9. Wait for maintainer review. Do not merge your own PR.

## Pull Request Requirements

Before requesting review, make sure your PR satisfies all of the following:

- The PR targets `dev`, never `main`.
- The PR description clearly explains what changed, why it changed, and any known limitations.
- UI contributions include screenshots or a short demo of the final behavior.
- API changes include example `curl` commands or request/response samples.

Maintainers may close PRs that target the wrong branch, do not follow the agreed feature scope, or do not meet the engineering standards below.

## Commit Messages

Follow the emoji-style Conventional Commits format used in this repo. See [`.vscode/commit-instructions.md`](./.vscode/commit-instructions.md) for the full reference.

```text
<emoji> <type>(<scope>): <subject>
```

Common types:

| Emoji | Type       | When to use                              |
| ----- | ---------- | ---------------------------------------- |
| `✨`  | `feat`     | New feature                              |
| `🐛`  | `fix`      | Bug fix                                  |
| `♻️`  | `refactor` | Code restructure without behavior change |
| `🖌️`  | `ui`       | UI-only changes with no logic changes    |
| `📚`  | `docs`     | Documentation only                       |
| `🔧`  | `chore`    | Maintenance, tooling, or dependencies    |
| `🎨`  | `style`    | Formatting-only changes                  |
| `⚡`  | `perf`     | Performance improvements                 |
| `🗑️`  | `del`      | Remove files or code                     |

Rules:

- Subject must be lowercase, imperative, and must not end with a period.
- Subject max length is 50 characters; full line max length is 72 characters.
- One logical change per commit.

Examples:

```text
✨ feat(theme): add dark mode preset
🐛 fix(geocoding): handle null response from nominatim
♻️ refactor(poster): extract layer drawing into helper
📚 docs(readme): update setup instructions
✨ feat(contacts): add batch delete endpoint
```

## Code Quality

- Keep code clean, readable, and reusable.
- The implementation must match the requested behavior and UX, not only a partial interpretation.
- The diff should be intentionally engineered, not just reorganized to satisfy feedback superficially.
- Build features as standalone modules or components whenever practical, then import them into the consuming screens.
- If something is reused, extract it into a shared component, hook, constant, or utility.
- Reuse existing components and hooks when they already cover the use case.
- Prefer short, focused functions over long, complex ones.
- Compose behavior through clear abstractions and interfaces.
- Separate rendering, state or configuration, and data handling where possible.
- Avoid hard-coded values. Use named constants, configuration objects, or shared tokens instead.
- Prefer scalable and maintainable UI assets and controls over placeholders or one-off shortcuts.
- Follow the naming conventions in [`agent.md`](./agent.md).
- Add concise comments where intent is not immediately obvious.
- Do not bypass the port/adapter architecture. Read [`agent.md`](./agent.md) before adding new infrastructure code.

## Contacts API Guidelines

The Contacts API server lives in `server/` and runs on Bun outside the Vite frontend build.

- **Do not import** from `src/` in `server/` files. The API server has no dependency on React or Vite.
- API route handlers live in `server/routes/`. Keep each route handler as a pure function that returns a `Response`.
- The in-memory contact store in `server/store/` can be replaced with a database adapter in the future. Do not add database-specific code to route handlers.
- Respect Nominatim rate limits (1 request per second) in all geocoding code.

## AI-Assisted Contributions

AI-assisted coding is allowed. Vibe-coded submissions are not.

- Review, refine, and fully understand any generated code before opening a PR.
- Make sure generated code follows the project architecture, naming, and modularity standards.
- Do not submit generated output that still contains hard-coded assumptions, weak abstractions, or incomplete UX requirements.
- If a maintainer asks for a specific engineering direction, implement that direction intentionally instead of pasting agent output with minimal changes.

## Contributor License Agreement (CLA)

This project does not currently require a Contributor License Agreement (CLA). By submitting a pull request, you agree that your contribution is licensed under the same MIT License as the project. The project owner reserves the right to relicense or redistribute the project and its derivatives in the future, while preserving contributor attribution.
