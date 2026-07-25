# Distribute source through the `@aeri-ui` registry

Aeri UI will distribute installable source through the shadcn CLI under the stable `@aeri-ui/<item>` address instead of making a runtime component package its primary contract. This gives consumers ownership and customization of the installed code, avoids a library-wide runtime dependency, and leaves room for later framework support beyond Next.js. The public catalog will present equivalent commands for npm, pnpm, Yarn, and Bun.

The preferred public host is `aeriui.dev`. For the namespaced command to work without manual `components.json` configuration, the open-source registry must also be accepted into shadcn's public Registry Directory; until then, consumers will need explicit namespace configuration or a direct registry URL.
