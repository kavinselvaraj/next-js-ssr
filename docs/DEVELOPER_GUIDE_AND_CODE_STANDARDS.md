# Developer Guide & Code Standards

> Audience: Mid-to-senior engineers contributing to the SkyBridge monorepo.
> 
> Scope: `apps/ibe-app`, `apps/admin-app`, `packages/ui`, and monorepo-level workflows.

## Project Overview

### Purpose of the application

SkyBridge is a monorepo for airline-related web experiences:

- **`ibe-app`**: customer-facing booking experience (search, booking flows, contact, localization).
- **`admin-app`**: internal administration console.
- **`@repo/ui`**: shared UI package consumed by both apps.

Primary goals:

- Fast iteration with shared tooling.
- Consistent quality standards across apps.
- Predictable CI/CD for preview and production environments.

### Tech stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Monorepo**: Turborepo + pnpm workspaces
- **UI**: React 18 + Tailwind CSS (primarily in `ibe-app`)
- **Content/CMS**: Prismic
- **State management (client)**: React Redux + Redux Toolkit (`ibe-app`)
- **Lint/format/check**: Biome
- **Git hooks**: Husky + lint-staged
- **CI/CD**: GitHub Actions + Vercel

## Architecture

- **Monorepo architecture**
  - App-level boundaries in `apps/*`.
  - Shared design primitives in `packages/ui`.
- **Layered feature architecture (primarily `ibe-app`)**
  - Route layer (`app/**`)
  - Feature layer (`features/**`)
  - Service/data layer (`services/**`, `lib/**`)
  - Shared types (`types/**`)
- **Rendering model (App Router)**
  - Server Components by default.
  - Client Components where interactivity/state is needed.
  - Mixed rendering patterns for route-specific needs.

---

## Folder Structure

### Folder structure and responsibilities

```text
.
├─ apps/
│  ├─ ibe-app/
│  │  ├─ app/                 # Routes, layouts, route handlers
│  │  ├─ features/            # Feature modules (domain-specific logic)
│  │  ├─ components/          # Shared app-specific presentational UI
│  │  ├─ services/            # API/domain service wrappers
│  │  ├─ lib/                 # Utilities, i18n, CMS clients, helpers
│  │  ├─ providers/           # React providers (Redux, Query, Session, etc.)
│  │  ├─ store/               # Redux store and typed hooks
│  │  ├─ types/               # Shared TypeScript contracts
│  │  └─ styles/              # Global styles
│  └─ admin-app/
│     └─ app/                 # Admin routes and layout
├─ packages/
│  └─ ui/
│     └─ src/                 # Shared reusable UI components
├─ .github/workflows/         # CI/CD workflows
├─ .husky/                    # Git hooks
├─ turbo.json                 # Turborepo pipeline config
├─ biome.json                 # Lint/format/check config
└─ package.json               # Root scripts and workspace tooling
```

### Naming conventions

- **Files/folders**
  - React components: `PascalCase.tsx` (e.g., `FlightResults.tsx`)
  - Utilities/services/hooks/store helpers: `camelCase.ts` or `kebab-case.ts` by existing module style
  - Route segments: Next.js App Router convention (`[param]`, nested folders)
- **Barrel files**
  - Use `index.ts` for stable exports at feature/package boundaries.
- **Tests**
  - Prefer `*.test.ts` / `*.test.tsx` colocated with the unit under test.

---

## 3) Coding Standards

### General principles

- Prioritize **readability over cleverness**.
- Optimize for **maintainability** (clear boundaries, low coupling).
- Design for **scalability** (composable modules, explicit contracts).
- Keep functions focused and side effects explicit.
- Use strict typing; avoid `any` unless justified and documented.

### Naming conventions

- **Variables**: `camelCase`, descriptive (`flightSearchPayload`, not `data`).
- **Functions**: verb-first (`fetchFlights`, `resolveLocaleFromSegment`).
- **React components**: `PascalCase` (`HomepageSearchForm`).
- **Types/interfaces**: `PascalCase` (`FlightSearchState`).
- **Constants**: `UPPER_SNAKE_CASE` only for immutable global constants.

### File organization rules

- Keep top-level import blocks grouped:
  1) external packages
  2) internal aliases
  3) relative imports
- One primary responsibility per file.
- Extract non-trivial local helpers into module-level named functions.
- Avoid circular dependencies between feature modules.

### Code formatting guidelines

Biome is the source of truth:

- 2-space indentation
- single quotes
- semicolons always
- trailing commas where allowed
- line width 100

Root commands:

- `pnpm lint` → Biome lint
- `pnpm format` → Biome write
- `pnpm check` → Biome full check

Pre-commit hook runs lint-staged with Biome on staged files.

---

## Git Workflow

### Branching strategy

Use a trunk-based GitHub flow:

- `main`: always releasable
- `feature/<short-topic>`: new features
- `fix/<short-topic>`: bug fixes
- `hotfix/<short-topic>`: urgent production fixes

Examples:

- `feature/ibe-flight-filters`
- `fix/contact-api-timeout`

### Commit message conventions

Adopt Conventional Commits:

- `feat: add localized flight detail metadata`
- `fix: handle missing prismic repository env`
- `refactor: split flight search service`
- `chore: update biome rules`
- `docs: add onboarding guide`

Recommended format:

```text
<type>(optional-scope): <summary>

<body - why, not what>

<footer - breaking change / refs>
```

### Pull request guidelines

Each PR should include:

- Problem statement and intent
- Scope of changes
- Screenshots/video for UI changes
- Test evidence (commands + outcomes)
- Risk notes and rollback considerations

PR checklist:

- [ ] Lint/check pass
- [ ] Build passes for affected apps
- [ ] New behavior covered by tests (or justified)
- [ ] No secrets or credentials committed
- [ ] Backward compatibility considered

---

## 5) Frontend Guidelines

### Component structure

Prefer this order:

1. imports
2. type declarations
3. constants/helpers
4. component
5. small private render/helper functions

Keep components:

- Presentational where possible
- Focused on one concern
- Typed via explicit prop interfaces

### State management approach

- **Global/shared client state**: Redux Toolkit in `apps/ibe-app/store`
- **Local UI state**: `useState` in component scope
- **Server state/data fetching**: Server Components, route handlers, or server actions based on route needs

Rules of thumb:

- If state is needed across multiple routes/components, evaluate Redux slice.
- If state is transient and local (dropdown open/close), keep local.

### Reusability principles

- Put app-agnostic UI primitives in `packages/ui`.
- Keep feature-specific logic inside `features/<feature-name>`.
- Favor composition over prop-drilling deeply nested trees.

### Styling conventions

- Use Tailwind utility classes consistently.
- Keep class lists readable; extract repeated patterns into shared components.
- Avoid inline styles unless dynamic values cannot be expressed cleanly.
- Ensure accessibility classes/states are considered (`focus-visible`, contrast, semantic elements).

---

## API Guidelines

> In this project, backend surface is primarily Next.js Route Handlers and server-side modules.

### API design standards

- Route handlers under `app/api/**/route.ts`.
- Use clear HTTP semantics (`GET`, `POST`, etc.).
- Return typed JSON payloads with stable shapes.
- Keep handlers thin; delegate business logic to `features/**` or `services/**`.

Example response contract:

```json
{ "data": {}, "error": null }
```

or on failure:

```json
{ "data": null, "error": { "code": "INTERNAL_ERROR", "message": "..." } }
```

### Error handling

- Use `try/catch` at boundaries (route handlers, server actions).
- Return correct status codes (`400`, `404`, `422`, `500`, etc.).
- Never leak internal stack traces to clients.
- Prefer domain-specific error messages for observability.

### Logging

- Log with context (request params, correlation IDs where available).
- Avoid logging secrets/PII.
- Use structured logs (object-based logging) rather than free-form strings where possible.

### Validation

- Validate all input from query params, body, and headers.
- Normalize before processing (e.g., uppercase airport codes).
- Reject invalid payloads early with `400/422` and clear error payloads.

---

## 7) Testing Guidelines

### Unit testing

- Test pure functions and feature services first.
- Keep tests deterministic (mock time/network/randomness).
- Prefer colocated tests: `featureX.test.ts` near source.

### Integration testing

- Cover route handlers and key user flows.
- Test contracts between route handlers and feature/service layers.
- Validate localization and rendering behavior on critical paths.

### Naming and structure

- Test names should describe behavior:
  - `returns flights filtered by origin and destination`
  - `falls back to default locale when locale is invalid`

Recommended structure:

```text
<module>.test.ts(x)
  describe('<module>')
    describe('<method or scenario>')
      it('<behavior expectation>')
```

### Minimum expectations per PR

- New logic should include unit tests.
- Bug fixes should include regression coverage.
- If tests are intentionally skipped, document why in PR.

---

## 8) Performance & Optimization

### Best practices

- Choose rendering mode intentionally (SSG/ISR/SSR/CSR).
- Keep client bundles lean:
  - minimize `use client` scope
  - avoid unnecessary large dependencies in client components
- Cache server fetches where freshness permits (`revalidate`, cache policies).
- Use dynamic rendering only where truly required.
- Optimize images and avoid layout shifts.

### Common pitfalls

- Marking too many components/routes as client components.
- Excessive `no-store` fetches causing avoidable SSR overhead.
- Duplicated fetches in both layout and page without memoization strategy.
- Over-broad global state causing unnecessary rerenders.

---

## Security

### Authentication & authorization

- Enforce auth checks at server boundaries, not only in UI.
- Apply least-privilege principles for admin functionality.
- Validate role/permission before sensitive operations.

### Data validation

- Treat all external input as untrusted.
- Use schema validation for body/query where possible.
- Encode/sanitize outputs shown in UI where needed.

### Secrets management

- Never commit real secrets.
- Use `.env.example` for required keys; real values come from environment/CI secrets.
- For Vercel + GitHub Actions, use encrypted secrets/variables (`VERCEL_TOKEN`, project/org IDs).

---

## Deployment

### Environments

- **Development**: local machine (`pnpm dev` / filtered app scripts)
- **Preview**: PR-triggered Vercel previews via `.github/workflows/preview.yml`
- **Production**: `main` branch deploy via `.github/workflows/deploy.yml`

### Environment variables handling

- Keep app-specific env examples under app folders (e.g., `apps/ibe-app/.env.example`).
- Required keys should be documented and validated at startup where possible.
- Prefix browser-exposed vars with `NEXT_PUBLIC_` only when intentional.

### CI/CD overview

Current pipeline behavior:

- On push to `main`:
  - install dependencies (`pnpm install --frozen-lockfile`)
  - build validation (`pnpm build`)
  - deploy `ibe-app` and `admin-app` to Vercel (production)
- On PR to `main`:
  - deploy preview for each app
  - comment preview URLs back to PR

---

## Do’s and Don’ts

### Do’s

- ✅ Keep feature logic in `features/*`; keep route handlers thin.
- ✅ Prefer explicit types for API payloads and state slices.
- ✅ Use Biome before commit (`pnpm check` / `pnpm format`).
- ✅ Keep PRs focused and reviewable.
- ✅ Document important architectural decisions in PR descriptions.

### Don’ts

- ❌ Don’t put business logic directly in route components when it belongs in services/features.
- ❌ Don’t introduce new global state without proving cross-component need.
- ❌ Don’t bypass validation just because data “comes from internal UI”.
- ❌ Don’t log secrets, tokens, or sensitive user data.
- ❌ Don’t merge code that passes locally but fails CI checks.

### Practical examples

**Good (separation of concerns):**

- Route handler parses request → calls feature service → returns typed response.

**Bad (tight coupling):**

- Route handler contains parsing, validation, business rules, DB/CMS access, and response mapping in one file.

**Good (state scope):**

- Redux for cross-route booking state; local `useState` for dropdown visibility.

**Bad (over-globalized state):**

- Storing temporary input focus/hover states in Redux.

---

## Onboarding Quick Start

1. Install Node and pnpm.
2. Run `pnpm install` at repo root.
3. Create local env from `apps/ibe-app/.env.example`.
4. Start apps:
   - `pnpm dev:ibe`
   - `pnpm dev:admin`
5. Before opening PR:
   - `pnpm check`
   - `pnpm build`

---

## Ownership and Evolution

This guide is a living standard.

When introducing a new pattern (state, API contract, rendering strategy, testing approach), update this document in the same PR so standards and implementation stay aligned.
