# Maintain one source of truth per Registry Item

Each Registry Item will keep its installable source, registry metadata and dependencies, Live Preview fixtures, usage examples, documentation metadata, and acceptance tests together as one authoritative item record. The catalog will render the same source that the registry build distributes rather than maintaining separate demo and download implementations. This prevents documentation drift and ensures that the code Builders evaluate is the code they install.
