# Keep Registry Item styles self-contained

Aeri UI will not require a global theme or stylesheet package. Registry Items will primarily use Tailwind utilities, shadcn semantic tokens, data attributes, and CSS variables with local fallbacks; rare custom CSS and keyframes will be declared by the item that needs them and namespaced with `aeri-`. Shared styling infrastructure will be extracted only after real duplication justifies another registry dependency, and installation must not reset or broadly rewrite Consumer Project global styles.
