# Aeri UI

Aeri UI is an open-source catalog of installable interface source for React applications, initially focused on Next.js projects using shadcn and Tailwind CSS.

## Language

**Source Registry**:
The primary collection through which Aeri UI publishes source that consumers can install into and own within their projects.
_Avoid_: Runtime library, component package

**Curated Registry**:
A Source Registry in which contributions are welcome but publication remains an editorial decision governed by Aeri UI's quality contracts.
_Avoid_: Marketplace, public directory

**Catalog**:
The unified public browsing, preview, and documentation experience generated from the Curated Registry.
_Avoid_: Marketplace, separate docs site

**Item Page**:
The canonical Catalog page for one Registry Item, containing its Live Preview, documentation, source, and installation commands.
_Avoid_: Documentation page, product page

**Live Preview**:
A controlled live rendering of the same source distributed by a Registry Item, with relevant state and environment controls.
_Avoid_: Demo implementation, code playground

**Registry Item**:
An individually discoverable and installable unit of Aeri UI source, identified within the `@aeri-ui` registry.
_Avoid_: Package

**Installed Source**:
The Builder-owned copy of a Registry Item inside a Consumer Project. It changes only when the Builder edits or explicitly updates it.
_Avoid_: Dependency, managed component

**Builder**:
A developer or small product team using Aeri UI to add polished interaction to an existing application without having to specialize in motion design.
_Avoid_: End user, customer

**Consumer Project**:
An existing Next.js application using shadcn and Tailwind CSS into which a Builder installs Registry Items.
_Avoid_: Starter, template

**Consumer Theme**:
The semantic colors, typography, radius, and light or dark appearance already defined by a Consumer Project.
_Avoid_: Aeri theme, demo theme

**Component**:
A focused, reusable Registry Item with one primary interface or interaction responsibility.
_Avoid_: Block, widget

**Block**:
A composed Registry Item that combines multiple Components into a recognizable product interface. It may include demonstration state or mock data, but it does not require product-specific business logic or a backend integration.
_Avoid_: Component, application, starter

**Interaction-led Motion**:
Motion that communicates or acknowledges hover, focus, press, navigation, loading, or another state change while leaving surfaces still by default. A view may contain one restrained ambient accent, but motion must not compete for attention or delay interaction.
_Avoid_: Decorative motion, perpetual animation

**Performance Contract**:
The measurable responsiveness, rendering, idle-work, and reduced-motion requirements that every Registry Item must satisfy before publication.
_Avoid_: Performance goal, best effort

**Catalog Performance Contract**:
The loading, responsiveness, layout-stability, and asset-budget requirements that the public Catalog must satisfy in CI and production.
_Avoid_: Registry Item Performance Contract, Lighthouse goal

**Accessibility Contract**:
The applicable WCAG 2.2 Level AA requirements that the public catalog and every Registry Item must satisfy before publication.
_Avoid_: Accessibility goal, best effort

**Documentation Contract**:
The complete usage, API, dependency, accessibility, performance, customization, and compatibility information that every Item Page must provide before publication.
_Avoid_: Documentation goal, placeholder docs

**Launch Set**:
The quality-gated first public collection of eight Components and three Blocks.
_Avoid_: MVP, backlog, complete catalog

## Registry Lifecycle

**Draft**:
A Registry Item available only in source and pull-request preview deployments.

**Preview Item**:
A publicly installable Registry Item whose API may still change before it becomes Stable.
_Avoid_: Beta

**Stable Item**:
A published Registry Item covered by Aeri UI's compatibility and migration guarantees.
_Avoid_: Finished

**Deprecated Item**:
A published Registry Item that remains available but directs Builders to a replacement and migration guide.
_Avoid_: Removed, unsupported

**New Badge**:
A temporary recency marker independent of a Registry Item's lifecycle status.
_Avoid_: Status
