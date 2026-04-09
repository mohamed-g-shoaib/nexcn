# Forge Repository Structure

Last updated: 2026-04-08

## Purpose

This file locks the repository-structure decision for Forge itself.

It answers:

- whether Forge should start as a monorepo
- which tooling should be used if Forge grows into a monorepo later
- how the current repo should stay migration-friendly without paying monorepo complexity up front

## Locked Decision

Forge should **not** start as a monorepo.

The first implementation should use:

- one root package
- one root `package.json`
- one root lockfile
- one root source tree under `src/`
- one root `spec/` surface for product and implementation planning

Forge should remain **monorepo-ready**, but should not add Turborepo, `apps/*`, or `packages/*` in the first implementation.

## Why This Is Locked

The current product does not yet have enough active packages to justify monorepo overhead.

The first delivery phase is:

- one generator CLI
- one implementation codebase
- generated fixtures later

Adding monorepo orchestration before those become separate actively developed units would increase setup and maintenance complexity earlier than necessary.

## Tooling Decision

### Current repository mode

- repository shape: single package
- workspace manager: none yet
- task runner: package scripts only
- build orchestration: no Turborepo in the first pass

### Current package manager for Forge itself

- use `pnpm`

This keeps the repo aligned with the preferred future migration path if Forge later becomes multi-package.

### Future monorepo foundation

If Forge grows into a real multi-package repository later, the foundation should be:

- `pnpm` workspaces
- `pnpm-workspace.yaml`
- `workspace:` protocol for internal package dependencies
- a shared workspace lockfile

### Future build orchestration

If Forge later has multiple actively developed apps/packages with non-trivial shared tasks, add:

- `turbo`

Do not adopt Nx by default.

## Migration Trigger

Revisit the single-package decision only when at least two of these are true at the same time:

- the Forge CLI is a real maintained package
- shared internal packages emerge and are used by multiple apps/tools
- generated fixture verification becomes large enough to benefit from workspace task orchestration

Before that point, stay single-package.

## First-Pass Directory Shape

The first implementation should use:

- `src/cli/`
- `src/config/`
- `src/scaffold/`
- `src/overlays/`
- `src/features/`
- `src/utils/`
- `src/verify/`
- `fixtures/`
- `spec/`

This structure is intentionally easy to promote later into:

- `apps/`
- `packages/`

without changing the product contract first.

## Future Monorepo Shape

If migration becomes justified later, the target shape should be:

- `apps/forge-site`
- `packages/forge-cli`
- `packages/forge-core`
- `packages/forge-shared`
- `packages/config-*` only if shared config reuse becomes real
- `fixtures/` or `apps/fixtures/*` depending on verification needs

This is a future direction, not a current requirement.

## Workspace Rules For A Future Migration

If Forge becomes multi-package later:

- internal packages must use the `workspace:` protocol
- package boundaries should be explicit and imported by package name, not by cross-package relative paths
- workspace cycles should be treated as errors
- shared dependency versions should be centralized with pnpm catalogs when duplication becomes real
- Turborepo should be added only after workspace boundaries are already clear
- Changesets should be added only if Forge begins publishing multiple packages or needs coordinated package releases

## Explicit Non-Goals For v1

- no Turborepo in the first implementation
- no `apps/*` and `packages/*` layout yet
- no shared internal package splitting before the generator core exists
- no Changesets setup yet
- no CI design optimized for a multi-package workspace yet
