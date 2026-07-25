# Keep Registry Items dependency-minimal

Components will add no feature dependency beyond React, Base UI, official shadcn Registry Items, and the established styling utilities; `motion` is the sole pre-approved exception for interactions that justify it. Blocks will prefer composed Registry Items and browser APIs over form, state-management, upload, or data-fetching libraries, while generic Components accept icons through their APIs instead of forcing an icon package. Any additional runtime dependency must be declared, measured, and explicitly approved during item review.
