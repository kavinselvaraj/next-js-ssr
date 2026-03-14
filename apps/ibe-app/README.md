# SkyBridge Air

A production-grade Next.js airline POC using mixed rendering strategies (SSR, ISR, CSR) with clean architecture.

## CI/CD Deployment (GitHub Actions + Vercel)

This repository includes:

- `.github/workflows/deploy.yml` for production deploys
- `.github/workflows/preview.yml` for PR preview deploys

- On every push to `main`, it:
  - installs dependencies
  - builds the Next.js app
  - deploys production to Vercel

- On every pull request targeting `main`, it:
  - builds preview artifacts
  - deploys a Vercel preview environment

### Required GitHub Actions configuration

Add these as either **Secrets** or **Variables** in:
**GitHub → Repository → Settings → Secrets and variables → Actions**

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### How to get Vercel IDs

After linking this project locally with Vercel CLI (`vercel link`), values are available in `.vercel/project.json`:

- `orgId` → `VERCEL_ORG_ID`
- `projectId` → `VERCEL_PROJECT_ID`

## Folder Structure

- `pages/` - Primary routing (SSR/ISR/CSR) and API routes
- `components/` - Pure UI, reusable, stateless
- `features/flights/` - Airline business/domain logic
- `services/` - API communication, easily swappable
- `lib/` - Utilities, fetch wrappers, error handling
- `types/` - Shared TypeScript types
- `mocks/` - Mock data for APIs
- `styles/` - Global styles (Tailwind)

## Setup

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm start
```

## Testing

- Place tests alongside modules, e.g., `features/flights/flightService.test.ts`.
- Use dependency injection for services to enable mocking.

## Architecture

- Layered, clean architecture
- SSR for flight discovery pages
- ISR for flight detail pages
- CSR for support/contact pages
- Mock API with realistic latency and errors
- Strong TypeScript typing
- Centralized error handling
- Loading and error boundaries
- SEO metadata per page
- Accessibility-friendly components

---
