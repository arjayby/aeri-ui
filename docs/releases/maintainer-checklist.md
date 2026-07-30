# Aeri UI 1.0 maintainer checklist

The release candidate may be reviewed and deployed before this checklist is complete. Do not publish a stable 1.0 release, change Registry Items to Stable, or create the final 1.0 tag until every external gate below is confirmed.

## Candidate verification

- [ ] Run `pnpm install --frozen-lockfile` from a clean checkout.
- [x] Run `pnpm run check`. Passed locally on 2026-07-30.
- [x] Run `pnpm run registry:verify`. Passed locally on 2026-07-30.
- [x] Run `pnpm run test:catalog`. Passed locally on 2026-07-30 with 95 browser tests and perfect Lighthouse performance and accessibility scores.
- [ ] Confirm the Consumer Project CI matrix passes for npm, pnpm, Yarn, Bun, Chromium, Firefox, and WebKit.
- [ ] Review [1.0-rc-audit.md](./1.0-rc-audit.md) against the generated public payloads.
- [ ] Review the public [release candidate page](https://aeriui.dev/docs/release-candidate).

## External gates

- [ ] Confirm legal and operational ownership of `aeriui.dev`.
- [ ] Confirm production DNS directs `aeriui.dev` to the intended deployment.
- [ ] Complete the production Catalog and registry deployment.
- [ ] Verify the public production Catalog, `/r/registry.json`, and all eleven item payloads over HTTPS.
- [x] Confirm GitHub private vulnerability reporting is enabled for `arjayby/aeri-ui`. Verified through the GitHub API on 2026-07-30.
- [ ] Test the private vulnerability reporting flow without publishing sensitive details.
- [ ] Submit the exact entry in [registry-directory-submission.md](./registry-directory-submission.md) to `shadcn-ui/ui`.
- [ ] Record the upstream pull request and any review evidence.
- [ ] Obtain `@aeri-ui` Registry Directory acceptance.
- [ ] Recheck all four package manager commands without an explicit `components.json` registry entry.

## Stable release

- [ ] Resolve every directory review change without weakening the installation, ownership, privacy, accessibility, performance, or migration contracts.
- [ ] Change the Launch Set lifecycle from Preview Item to Stable Item in the authoritative records.
- [ ] Rebuild and audit every public payload and Item Page.
- [ ] Confirm the release notes still match the shipped source and support boundary.
- [ ] Create and push the final signed 1.0 tag only after every preceding item is complete.
- [ ] Publish the stable release and link its validation evidence.
