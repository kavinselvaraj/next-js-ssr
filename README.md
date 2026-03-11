# My SSR App

A production-grade Next.js SSR application with clean architecture, mock API, and best practices.

## CI/CD Deployment (GitHub Actions + Vercel)

This repository includes `.github/workflows/deploy.yml`.

- On every push to `main`, it:
	- installs dependencies
	- builds the Next.js app
	- deploys production to Vercel

### Required GitHub repository secrets

Add these in **GitHub → Repository → Settings → Secrets and variables → Actions**:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### How to get Vercel IDs

After linking this project locally with Vercel CLI (`vercel link`), values are available in `.vercel/project.json`:

- `orgId` → `VERCEL_ORG_ID`
- `projectId` → `VERCEL_PROJECT_ID`

## Folder Structure

- `app/` - Routing, layouts, SSR pages, and API handlers
- `components/` - Pure UI, reusable, stateless
- `features/` - Business/domain logic, orchestrates services
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

- Place tests alongside modules, e.g., `features/products/productService.test.ts`.
- Use dependency injection for services to enable mocking.

## Architecture

- Layered, clean architecture
- SSR for all data-driven pages
- Mock API with realistic latency and errors
- Strong TypeScript typing
- Centralized error handling
- Loading and error boundaries
- SEO metadata per page
- Accessibility-friendly components

---
