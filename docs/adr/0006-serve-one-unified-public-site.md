# Serve one unified public site

Aeri UI will present its landing page, catalog, interactive documentation, search, contributor guidance, and registry endpoints as one public Next.js product on the `aeriui.dev` origin. The existing standalone documentation application will not remain a separate public experience; its useful content and infrastructure must be migrated before the package is removed. This gives each Registry Item one canonical URL and avoids duplicating navigation, theming, search, and deployment concerns across two sites.
