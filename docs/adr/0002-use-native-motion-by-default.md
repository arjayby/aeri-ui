# Use native motion by default

Aeri UI registry items will use CSS transitions, CSS keyframes, and suitable browser APIs for ordinary interaction motion. An item may depend on `motion` only when its behavior genuinely requires capabilities such as spring physics, layout morphing, gestures, or dragging. This keeps simple items lightweight while preserving richer motion where the interaction justifies its runtime cost; Aeri UI will not require a global animation runtime or provider.
