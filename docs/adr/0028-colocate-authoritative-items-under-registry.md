# Colocate authoritative items under `registry/`

A top-level `registry/` tree will own Components and Blocks, with each item colocating its installable source, metadata, Live Preview, examples, documentation, and tests. The root `registry.json` will compose explicit Component and Block registries. `packages/ui` remains a private workspace package for shared Catalog-shell primitives rather than becoming the public distribution contract, and Aeri UI will not create one workspace package per Registry Item.
