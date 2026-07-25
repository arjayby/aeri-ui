# Use unprefixed semantic exports

Registry namespace and install path will carry the Aeri UI identity, while Installed Source exports ordinary semantic names such as `Button` rather than branded names such as `AeriButton`. Builders can alias imports when an Aeri Component and its shadcn primitive appear together, and specialized exports will describe their role or behavior rather than carrying an `Aeri` prefix. This keeps source-owned code natural while preserving a stable, predictable API.
