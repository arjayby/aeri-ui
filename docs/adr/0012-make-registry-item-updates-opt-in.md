# Make Registry Item updates opt-in

Installed Source belongs to the Consumer Project and will never update automatically. A canonical address such as `@aeri-ui/button` resolves to the latest stable item, while Builders inspect and apply compatible updates explicitly through the shadcn CLI diff workflow. Breaking API changes require a migration guide and a separately addressable major item rather than silently replacing the canonical contract; repository releases will be tagged and accompanied by a human-readable changelog.
