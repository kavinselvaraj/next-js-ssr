# SkyBridge Monorepo

This repository is now a **Turborepo + pnpm workspace** with multiple apps.

## Apps

- `apps/ibe-app` — existing IBE customer-facing app (migrated from previous root app)
- `apps/admin-app` — new admin app

## Workspace commands

From repository root:

- `pnpm dev` — run all app dev servers in parallel
- `pnpm dev:ibe` — run only `ibe-app`
- `pnpm dev:admin` — run only `admin-app`
- `pnpm lint` — run lint in all apps via turbo
- `pnpm build` — build all apps via turbo

## Notes

- `admin-app` runs on port `3001` by default.
- Legacy single-app root structure has been migrated into `apps/ibe-app`.
