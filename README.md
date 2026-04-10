# Forge

Forge is the rebuild of the old Nexcn starter as a layered project generator.

Current implementation status:

- single-package repository
- `pnpm` package manager
- TypeScript CLI with interactive and flag-driven generation
- published package direction: `create-forge`
- direct executable names: `forge` and `create-forge`
- normalized generator config
- scaffold, overlay, feature, and verification interfaces
- current CLI defaults:
  - `next + base + ltr + pnpm + biome`

## Scripts

- `pnpm build`
- `pnpm test`
- `pnpm typecheck`
- `pnpm dev -- --help`

## CLI

- `forge`
  Starts interactive generation when required inputs are missing.
- `create-forge`
  Runs the same CLI entrypoint when installed as an initializer package.
- `forge generate --name my-app --framework next --base base --ltr --package-manager pnpm --code-quality biome`
  Runs generation directly when all required values are provided by flags.
- `forge plan`
  Prints the scaffold command, overlays, feature packs, and verification steps for the current config without writing files.

Verified initializer entrypoints:

- `npm create forge@latest`
- `pnpm create forge`
- `bun create forge`
- `yarn create forge`

Initializer package identity:

- users type `npm create forge`
- package managers resolve that to `create-forge`

## Current focus

Build the generator first, then generate fixtures from it later.
