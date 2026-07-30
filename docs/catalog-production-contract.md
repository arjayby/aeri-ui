# Catalog production contract

The public Catalog is verified from the production build. Its browser seam covers the landing experience, Catalog browsing, documentation, local search, Item Pages, Live Previews, and Registry delivery.

## Automated checks

- Playwright runs representative journeys in Chromium, Firefox, and WebKit at desktop and 390 pixel narrow viewports.
- Axe runs with all default rules on the landing page, Catalog browse route, documentation, and an Item Page. The required result is zero violations.
- Lighthouse runs the production landing route using the local desktop Chromium profile. It requires at least 95 performance and 100 accessibility, with laboratory LCP at or below 2.5 seconds and CLS at or below 0.1. The Catalog browser seam separately covers browse, documentation, Item Page, Live Preview, narrow viewport, and local search response within 200 milliseconds.
- `docs/catalog-performance-budget.json` records the first optimized build baseline. Its limits are ratchets: shared initial JavaScript, total emitted JavaScript, and emitted CSS may decrease or remain unchanged, but may not grow without an explicit architectural decision.
- Registry payloads are served with `public, max-age=0, must-revalidate`. This keeps canonical item addresses cacheable while ensuring a Builder who explicitly asks the shadcn CLI to check for updates receives the current payload.
- The Next.js standalone output is created during every production build. The Catalog has no Vercel runtime API dependency, so the output and static Registry payloads can be self hosted.

## Manual release checks

Before a release, verify keyboard order and visible focus on the header, filters, search, installation controls, and each Live Preview. Check text contrast and target size at desktop and narrow widths, reduced motion on every motion capable preview, and relevant previews with `dir="rtl"`. Confirm that blocked telemetry does not affect browsing, search, previews, or Registry delivery.

## Baseline

The baseline was measured from the first optimized production build on 2026-07-29:

- 457,460 bytes of shared initial JavaScript
- 1,805,572 bytes of emitted JavaScript
- 170,739 bytes of emitted CSS

## Recorded exception

On 2026-07-30, the emitted JavaScript cap increased to 1,814,000 bytes to add the approved Vercel Web Analytics and Speed Insights clients. This is the limited telemetry decision recorded in ADR 0024. No other budget expansion is approved by this exception.
