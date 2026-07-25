# Expose small semantic Component APIs

Aeri UI Components will preserve relevant native HTML and underlying shadcn or Base UI props, forward refs, and support controlled and uncontrolled state where appropriate. Their public APIs will expose semantic variants and slots rather than raw animation-library objects or numerous timing and spring controls; layout customization remains available through `className`, semantic tokens, and narrowly scoped CSS variables. Builders who need deeper changes can edit their Installed Source instead of depending on a permanently broad API.
