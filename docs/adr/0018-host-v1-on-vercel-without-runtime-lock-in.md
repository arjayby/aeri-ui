# Host v1 on Vercel without runtime lock-in

Aeri UI v1 will deploy the unified Catalog, documentation, generated search index, and static registry payloads to Vercel at `aeriui.dev`, using preview deployments for pull requests and CDN caching for build artifacts. Registry Items and the Git-backed content model must not depend on Vercel-specific runtime APIs, preserving the ability to build and self-host the complete open-source product elsewhere.
