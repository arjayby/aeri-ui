# Aeri UI Implementation Plan

Implementation proceeds as vertical slices. A phase is complete only when its relevant quality gates pass.

## Phase 1: Repository and project foundation

- Add the MIT `LICENSE`.
- Add `SECURITY.md`, contribution guidance, issue templates, and the external Registry Item proposal template.
- Add package-level check, test, and build tasks and register them with Turborepo.
- Add CI for formatting, linting, type checking, production builds, tests, and registry validation.
- Establish the supported Next.js fixture used for clean-install tests.
- Record the initial Catalog JavaScript and CSS budgets after the first optimized build.

## Phase 2: Unify the public application

- Move the useful Fumadocs Core and Fumadocs MDX configuration, content, search, and route behavior into `apps/web`.
- Build the custom Aeri UI documentation and Catalog shell in `apps/web`.
- Verify content, search, generated text routes, and production builds from the unified app.
- Remove the standalone `apps/fumadocs` package only after migration verification.
- Update workspace, Turborepo, Vercel, and dependency configuration to reference the single public app.

## Phase 3: Registry foundation

- Add root `registry.json` and explicit Component and Block registry includes.
- Add the top-level `registry/` directory and an authoritative item record structure.
- Configure registry build output under the unified public app's static `/r` path.
- Add registry schema validation, source-to-output drift checks, and Catalog data generation.
- Add namespace configuration for preview installs and direct-URL installation documentation.
- Add disposable clean-project installation tests.

## Phase 4: First complete vertical slice

Implement Button first because it exercises the canonical `@aeri-ui/button` contract.

- Build its semantic API and non-destructive install path.
- Use native motion unless a specific behavior justifies `motion`.
- Add Consumer Theme, light, dark, reduced-motion, responsive, and RTL fixtures.
- Add unit, interaction, accessibility, and performance tests.
- Add its Live Preview and complete Item Page.
- Build and validate the registry payload.
- Install it into a clean Next.js fixture and verify copied source.

This phase establishes the reusable item template and publication workflow.

## Phase 5: Catalog foundation

- Add Component and Block indexes grouped by product function.
- Add static listing representations and lazy Live Preview loading.
- Add unified, locally generated search.
- Add lifecycle, dependency, client-boundary, and recency filters.
- Add package-manager command tabs and copy behavior.
- Add source and changelog links.
- Add the design-principles, governance, privacy, and contributor documentation.

## Phase 6: Complete the Components

Implement and publish preview-quality vertical slices for:

1. Tabs
2. Accordion
3. Switch
4. Tooltip
5. Input
6. Number Ticker
7. Text Swap

Each item independently passes its publication contracts before entering the preview registry.

## Phase 7: Complete the Blocks

Implement:

1. Command Palette
2. File Upload
3. Settings Form

Blocks compose public shadcn and Aeri Registry Items, expose application behavior through callbacks, avoid backend and form-library coupling, and include localized-copy and RTL fixtures.

## Phase 8: Production hardening

- Complete the four-package-manager installation matrix.
- Complete Chromium, Firefox, and WebKit smoke suites.
- Run full keyboard, screen-reader, reduced-motion, responsive, RTL, accessibility, and performance checks.
- Enable sampled Vercel Speed Insights and aggregate Web Analytics.
- Publish the privacy notice and coordinated-disclosure documentation.
- Configure immutable caching for versioned assets and appropriate revalidation for canonical registry payloads.
- Verify self-hosted production builds without Vercel runtime APIs.

## Phase 9: Domain, directory, and stable release

- Acquire and configure `aeriui.dev`.
- Deploy the unified production Catalog and registry.
- Validate the public registry catalog and every Launch Set payload with the shadcn CLI.
- Submit `@aeri-ui` to the shadcn Registry Directory.
- Resolve directory review feedback without weakening the installation contract.
- Publish 1.0 only after directory acceptance and every release gate passes.

## External prerequisites

- Ownership and DNS control of `aeriui.dev`.
- A linked Vercel project with preview and production configuration.
- GitHub private vulnerability reporting enabled for the canonical repository.
- Acceptance of `@aeri-ui` into shadcn's public Registry Directory for 1.0.
