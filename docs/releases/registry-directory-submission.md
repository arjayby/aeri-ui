# `@aeri-ui` Registry Directory submission

## Submission summary

Aeri UI requests the `@aeri-ui` namespace for its public, open source Curated Registry at `https://aeriui.dev/r/{name}.json`.

Aeri UI distributes readable interface source for existing Consumer Projects. It does not require a public Aeri UI runtime package. Publication remains an editorial decision governed by documented accessibility, performance, documentation, compatibility, and installation contracts.

## Proposed directory entry

Add this entry to `apps/v4/registry/directory.json` in `shadcn-ui/ui`:

```json
{
  "name": "@aeri-ui",
  "homepage": "https://aeriui.dev",
  "url": "https://aeriui.dev/r/{name}.json",
  "description": "A curated registry of polished React Components and Blocks for Next.js and shadcn projects.",
  "logo": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' fill='none'><path d='M5 11.5C9.2 7.2 14.5 6 21 8.1C24.1 9.1 26.1 8.7 28 7' stroke='var(--foreground)' stroke-linecap='round' stroke-width='2.25'/><path d='M4 17C9.2 13.6 15 13.3 21.3 16.1C24.2 17.4 26.4 17.2 28.5 15.8' stroke='var(--foreground)' stroke-linecap='round' stroke-width='2.25'/><path d='M6 22.8C10.2 20.6 14.6 20.5 19.3 22.8C22.1 24.2 24.6 24.4 27 23.3' stroke='var(--foreground)' stroke-linecap='round' stroke-width='2.25'/></svg>"
}
```

The proposed logo is the same mark used by the Catalog and uses the directory foreground variable for both appearances.

## Installation contract

Directory acceptance enables zero configuration commands such as:

```bash
npx shadcn@latest add @aeri-ui/button
pnpm dlx shadcn@latest add @aeri-ui/button
yarn dlx shadcn@latest add @aeri-ui/button
bunx --bun shadcn@latest add @aeri-ui/button
```

During review, Builders configure the `@aeri-ui` URL template in `components.json` or install `https://aeriui.dev/r/<item>.json` directly. Aeri UI does not represent the namespaced command as zero configuration before acceptance.

## Supported platform

The 1.0 support contract is Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn with Base UI, and current evergreen browsers. React only Components avoid Next.js APIs where practical. The first stable release does not guarantee Pages Router, React 18, Tailwind CSS 3, Radix UI, React Aria, JavaScript only projects, or legacy browsers.

## Governance and trust

The canonical source is the public `arjayby/aeri-ui` repository under the maintainer's personal GitHub account. The Curated Registry and its published Registry Items remain free and MIT licensed. External proposals are welcome, but automated checks do not create a right to publication.

Installed Source is copied into and owned by the Consumer Project. Updates occur only when a Builder asks for them. Installed Source contains no Aeri UI telemetry, licensing checks, update checks, remote assets, or required calls home. Vulnerabilities use GitHub private vulnerability reporting and coordinated Security Advisories.

## Directory requirements

The public registry is flat:

* `https://aeriui.dev/r/registry.json` is the catalog.
* `https://aeriui.dev/r/button.json` and the other item URLs are canonical payloads.
* The catalog `files` entries omit `content`.
* Each item payload conforms to the registry item schema and contains the source needed for installation.

These requirements are checked by `pnpm run registry:verify`.

The upstream submission procedure, checked on 2026-07-30, is to add the entry to `apps/v4/registry/directory.json`, run `pnpm validate:registries`, and open a pull request to `shadcn-ui/ui`. The authoritative instructions are the [shadcn Registry Directory documentation](https://ui.shadcn.com/docs/registry/registry-index).

## Validation evidence

The release candidate audit records all eleven canonical addresses, Item Pages, dependencies, lifecycle values, source links, and changelogs in [1.0-rc-audit.md](./1.0-rc-audit.md).

Repository CI validates the public registry schema and build, generated drift, production Catalog, browser and accessibility contracts, direct and configured namespace installation, clean Consumer Project builds, package manager compatibility, Consumer Theme behavior, RTL, reduced motion, and absence of remote calls.

Directory acceptance remains an external gate. The project will not claim a stable 1.0 release until the submitted namespace is accepted and every item installs without prior registry configuration.
