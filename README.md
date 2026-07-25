# aeri-ui

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Self, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Biome** - Linting and formatting
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the fullstack application.

## Delivery baseline

From a fresh checkout, enable Corepack and install the locked workspace dependencies:

```bash
corepack enable
pnpm install --frozen-lockfile
```

The non-interactive quality commands are:

```bash
pnpm run format:check
pnpm run lint
pnpm run check-types
pnpm run build
```

The production Catalog smoke test uses Playwright. Install Chromium once on a development machine, then run the test:

```bash
pnpm exec playwright install chromium
pnpm run test:catalog
```

`pnpm run test:consumer` copies the supported Next.js Consumer Project fixture into a temporary directory, installs its locked public dependencies, type-checks it, builds it, and then discards it. It never reads from Aeri UI workspace packages.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@aeri-ui/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Deployment

### Vercel Services

- Target: web + server
- Config: `vercel.json`
- Link the project first: pnpm run deploy:setup
- Local Vercel dev: pnpm run dev:vercel
- Sync preview env: pnpm run env:preview
- Sync production env: pnpm run env:production
- Dry-run check (no upload): pnpm run deploy:check
- Preview deploy: pnpm run deploy
- Production deploy: pnpm run deploy:prod
  Vercel Services share project environment variables, but deploys do not upload local `.env` files automatically. Link the project with `vercel link`, then run the env sync command before your first deploy (otherwise the deployment starts with no env vars), or pass one-off envs with `vercel deploy -e KEY=value`.
  Pass Vercel CLI flags to the env sync command directly, for example: `pnpm run env:production --scope your-team`.

For more details, see the guide on [Deploying to Vercel](https://www.better-t-stack.dev/docs/guides/vercel).

## Git Hooks and Formatting

- Run checks: `pnpm run check`

## Project Structure

```
aeri-ui/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run check`: Run Biome formatting and linting
- `pnpm run deploy:setup`: Link this repo to a Vercel project (first-time setup)
- `pnpm run dev:vercel`: Run the Vercel Services dev environment locally
- `pnpm run env:preview`: Sync local env files to the Vercel preview environment
- `pnpm run env:production`: Sync local env files to the Vercel production environment
- `pnpm run deploy`: Create a Vercel preview deployment
- `pnpm run deploy:prod`: Deploy to Vercel production
- `pnpm run deploy:check`: Dry-run a deploy to preview framework detection and included files without uploading
