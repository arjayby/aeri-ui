# Install alongside shadcn primitives

Aeri UI Registry Items will install into a distinct Aeri-owned path and must not overwrite an existing shadcn primitive such as `components/ui/button.tsx`. Items may declare official shadcn primitives as registry dependencies and compose them, while Blocks should reuse installed shadcn and Aeri Components instead of including private duplicates. This protects Builder customizations and makes installation safe in the existing Consumer Projects that Aeri UI targets.
