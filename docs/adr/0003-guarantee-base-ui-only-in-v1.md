# Guarantee Base UI only in v1

Aeri UI v1 will guarantee compatibility with shadcn projects using Base UI, matching the repository's existing `base-lyra` foundation. Registry Items that only use React, native HTML, and Tailwind CSS may work with other shadcn bases, but Aeri UI will not maintain parallel Base UI, Radix, or React Aria variants in v1. Items should avoid unnecessary coupling so support for another primitive base can be added later without redesigning the registry itself.
