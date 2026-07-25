# Contributing to Aeri UI

Thank you for helping improve Aeri UI. The canonical project repository is [github.com/arjayby/aeri-ui](https://github.com/arjayby/aeri-ui), maintained as a public, MIT licensed Curated Registry.

## Before you begin

Please use GitHub Issues for bugs, documentation improvements, and general discussion. Do not use a public issue to report a security vulnerability. Follow the [security policy](./SECURITY.md) instead.

For a new Registry Item, submit the [Registry Item proposal](https://github.com/arjayby/aeri-ui/issues/new?template=registry-item-proposal.yml) and wait for maintainer approval before implementation. This keeps the Curated Registry focused on real Builder needs and prevents duplicate or overlapping source.

## Registry Item proposals

A proposal explains the Builder need, intended interaction, public API, relationship to existing shadcn and Aeri UI source, dependencies, accessibility risks, motion approach, and performance cost. Use the form so that editorial review can assess the item before implementation.

Maintainer authored Registry Items do not need a public proposal. They still record the same rationale in the colocated item record and must pass every publication contract.

## Pull requests

Keep each pull request focused and explain the behavior it changes. New Registry Items must satisfy the applicable API, accessibility, motion, performance, documentation, compatibility, and installation contracts before publication. Publication is an editorial maintainer decision, including for accepted external proposals.

By contributing, you agree that your contribution is provided under the repository's [MIT License](./LICENSE).

## Local checks

Install the locked workspace dependencies, then run the standard checks before opening a pull request:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run check
pnpm run test
```
