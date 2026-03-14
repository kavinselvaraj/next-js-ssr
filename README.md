# SkyBridge Monorepo

This repository is now a **Turborepo + pnpm workspace** with multiple apps.

## Apps

- `apps/ibe-app` — IBE customer-facing app
- `apps/admin-app` — admin app

## Workspace commands

From repository root:

- `pnpm dev` — run all app dev servers in parallel
- `pnpm dev:ibe` — run only `ibe-app`
- `pnpm dev:admin` — run only `admin-app`
- `pnpm lint` — run lint in all apps via turbo
- `pnpm build` — build all apps via turbo

## Useful commands

From repository root:

- `pnpm --filter ibe-app build` — build only `ibe-app`
- `pnpm turbo build --filter=ibe-app` — turbo-filtered build for only `ibe-app`
- `pnpm --filter admin-app build` — build only `admin-app`
- `pnpm --filter ibe-app start` — start built `ibe-app`
- `pnpm --filter admin-app start` — start built `admin-app` (port `3001`)

## Code formatting policy

To avoid merge conflicts caused by inconsistent formatting, this repo enforces formatting with Prettier.

- Pre-commit hook runs `pnpm lint-staged` and formats staged files automatically.
- Run `pnpm format` to format the whole repository.
- Run `pnpm format:check` in CI or locally to verify formatting.

Recommended onboarding step after cloning:

- `pnpm install` (this triggers `prepare` and sets up Husky hooks)

## IBE-only release / deploy

Typical flow from repository root:

1. Install dependencies
   - `pnpm install`
2. Run IBE checks
   - `pnpm --filter ibe-app lint`
3. Build only IBE
   - `pnpm --filter ibe-app build`
4. Smoke test production build locally
   - `pnpm --filter ibe-app start`

If your CI/CD supports workspace filters, deploy `apps/ibe-app` only for IBE releases.

## Notes

- `admin-app` runs on port `3001` by default.
- Legacy single-app root structure has been migrated into `apps/ibe-app`.
