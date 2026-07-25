# Aeri UI Product Brief

## Product

Aeri UI is a permanently free, MIT-licensed Curated Registry of polished interface source for production applications. It initially serves Builders working in existing Next.js and shadcn projects who want restrained interaction quality without becoming motion specialists.

The primary contract is source installation through shadcn:

```bash
npx shadcn@latest add @aeri-ui/button
pnpm dlx shadcn@latest add @aeri-ui/button
yarn dlx shadcn@latest add @aeri-ui/button
bunx --bun shadcn@latest add @aeri-ui/button
```

Installed Source is owned by the Consumer Project, never updates automatically, never calls home, inherits the Consumer Theme, and installs alongside existing shadcn primitives without overwriting them.

## V1 audience

The primary Builder is a developer or small product team with an existing Next.js application using shadcn. Aeri UI is not initially an application starter, complete design-system platform, third-party marketplace, browser IDE, or backend service.

## Supported platform

V1 guarantees:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn with Base UI
- Current evergreen browsers

React-only Components avoid Next.js APIs where practical, preserving a future path to Vite and TanStack. V1 does not guarantee Pages Router, React 18, Tailwind CSS 3, Radix, React Aria, JavaScript-only projects, or legacy browsers.

## Product experience

One public product at `aeriui.dev` contains the landing page, Component and Block Catalog, Item Pages, documentation, search, contributor guidance, and static registry endpoints. Fumadocs Core and Fumadocs MDX provide the embedded content engine behind a custom Aeri UI shell.

The Catalog is Git-backed and build-time generated. It has no user accounts, database, CMS, saved favorites, or persistent code playground. Unified, locally generated search covers Registry Items and documentation.

Each Item Page contains a controlled Live Preview of the installable source, relevant state and environment controls, four package-manager commands, usage and API documentation, dependency and client-boundary cost, accessibility behavior, performance trade-offs, responsive and RTL behavior, Consumer Theme customization, and source and changelog links.

## Design direction

Aeri UI borrows interaction quality rather than visual identity from beUI. The Catalog is airy, quiet, editorial, and neutral, with one restrained cool accent and equal light and dark support.

Interaction-led Motion keeps surfaces still by default and uses motion to acknowledge interaction or communicate state. CSS and suitable browser APIs are the default; `motion` is permitted only for interactions that genuinely need springs, layout morphing, gestures, or dragging. There is no global animation runtime.

## Registry architecture

The authoritative source lives in a top-level `registry/` tree. Each Registry Item colocates installable source, metadata, dependencies, Live Preview fixtures, examples, documentation, and tests. A root `registry.json` composes Component and Block registries and generates the payloads served from `/r`.

`packages/ui` remains a private workspace package for the Catalog shell. Aeri UI does not publish a runtime component package or create one workspace package per item.

Registry Items:

- Install into an Aeri-owned path such as `components/aeri/button.tsx`.
- Use unprefixed semantic exports such as `Button`.
- Expose small semantic APIs and preserve relevant native and Base UI behavior.
- Use self-contained, item-scoped styles and `aeri-` names for custom CSS identifiers.
- Add no feature dependencies beyond the approved baseline; `motion` is the sole pre-approved exception.
- Accept icons through APIs rather than forcing an icon library in generic Components.
- Contain no analytics, remote assets, update checks, or other call-home behavior.

## Launch Set

The stable 1.0 Launch Set contains eight Components:

1. Button
2. Tabs
3. Accordion
4. Switch
5. Tooltip
6. Input
7. Number Ticker
8. Text Swap

It also contains three Blocks:

1. Command Palette
2. File Upload
3. Settings Form

The full item descriptions live in [launch-set.md](./launch-set.md).

## Quality contracts

Every Registry Item must satisfy:

- WCAG 2.2 Level AA criteria applicable to its fixture.
- The Registry Item Performance Contract.
- The complete Documentation Contract.
- Keyboard, reduced-motion, responsive, and RTL verification.
- Clean installation into a supported Consumer Project.

The Catalog must keep production p75 LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1. Key CI routes require at least 95 Lighthouse performance and 100 automated accessibility under the agreed profile.

Pull requests and releases are blocked by their applicable quality gates. A stable release additionally verifies the complete Launch Set across npm, pnpm, Yarn, Bun, Chromium, Firefox, and WebKit.

## Lifecycle and releases

Registry Items move through Draft, Preview Item, Stable Item, and Deprecated Item states. `New` is a separate recency badge. Stable addresses are permanent and are never reassigned.

Completed items may ship incrementally through `0.x` preview releases. Stable 1.0 requires:

- All eleven Launch Set items.
- The unified production Catalog.
- Complete release and browser matrices.
- The public `@aeri-ui` shadcn Registry Directory listing.

Installed Source never updates automatically. Builders inspect and apply compatible updates explicitly. Breaking changes require migration guidance and a separately addressable major item.

## Open-source governance

The canonical repository remains `github.com/arjayby/aeri-ui` under the maintainer's personal account. The `@aeri-ui` registry is permanently public, free, and MIT-licensed.

External contributors propose new Registry Items before implementation. The maintainer may add items without a GitHub proposal but records the same rationale in the colocated item record. Publication remains an editorial decision governed by the project contracts.

Vulnerabilities use GitHub private vulnerability reporting and coordinated Security Advisories.

## Hosting and telemetry

V1 is hosted on Vercel at `aeriui.dev` while remaining self-hostable. Registry payloads are static and CDN-cacheable. Pull requests use Vercel preview deployments.

Production uses sampled Vercel Speed Insights and basic aggregate Vercel Web Analytics with a public privacy notice. There is no session replay, advertising, user profiling, cross-site tracking, or custom behavioral event collection at launch. Telemetry is never required for functionality.

## Explicit non-goals for v1

- Runtime component package
- Radix or React Aria variants
- Vite or TanStack guarantees
- Open component marketplace
- Paid Registry Items
- User accounts or database
- Headless CMS
- Embedded code IDE
- Saved favorites or playgrounds
- Catalog translations
- Global Aeri theme or stylesheet package
- Automatic Installed Source updates
