# Forge

Forge is the rebuild of the old Nexcn starter as a layered project generator.

Current implementation status:

- single-package repository
- `pnpm` package manager
- TypeScript CLI skeleton
- normalized generator config
- scaffold, overlay, feature, and verification interfaces
- first locked happy path target:
  - `next + base + rtl`

## Scripts

- `pnpm build`
- `pnpm typecheck`
- `pnpm dev -- --help`

## Current focus

Build the generator first, then generate fixtures from it later.
