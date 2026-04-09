# Forge Rebuild Plan

Last updated: 2026-04-08

## Goal

Design and build Forge as a modern generator that supports:

- frameworks:
  - Next.js
  - Vite
  - TanStack Start
- primitive bases:
  - Base UI
  - Radix UI
- direction modes:
  - RTL
  - non-RTL

without maintaining a large set of duplicated template folders.

## Planning Status

The current planning surface now covers:

- product context
- research
- local skill routing
- generator contract
- repository structure
- code-quality tooling choice

The initial implementation shape is now locked and active in code. The next planning concern is to keep the layering clean while expanding support beyond the first verified path.

## Core Implementation Principles

- Build the generator first, then generate examples later as fixtures.
- Do not hand-maintain a template farm.
- Let shadcn own as much scaffold complexity as possible.
- Keep generated apps intentionally minimal.
- Keep generated apps free of internal Forge specs and skill-routing files.
- Treat the marketing site as a separate later deliverable.

## Next Planning Step

Refine the implementation boundaries inside the locked single-package repository shape.

### Recommended first-pass repo structure

- `src/cli/`
  - CLI entrypoint
  - prompt flow
  - argument parsing
- `src/config/`
  - normalized config schema
  - option validation
  - framework label mapping
- `src/scaffold/`
  - scaffold adapter interface
  - shadcn-driven scaffold implementation
- `src/overlays/`
  - framework-specific overlays for `next`, `vite`, and `start`
- `src/features/`
  - `code-quality`
  - `rtl-runtime`
  - `sounds`
  - `starter-surface`
  - `docs`
  - `polish-css`
- `src/utils/`
  - filesystem helpers
  - command helpers
  - logging/error formatting
- `src/verify/`
  - install/typecheck/lint/build verification steps
- `fixtures/`
  - generator-produced fixtures later
- `spec/`
  - product and implementation specs only

This keeps the first implementation in one package instead of introducing a monorepo before the generator core exists.

Locked by [repository-structure.md](/D:/Developer/nexcn/spec/repository-structure.md).

## First Coding Milestone

Implement one end-to-end happy path:

- framework: `next`
- base: `base`
- RTL: `true`

Definition of done for that milestone:

- scaffold runs through the preferred shadcn path
- the generated app uses the default `luma` preset
- the starter page is minimal and easy to clean
- theme switching works
- RTL language switching works
- runtime `lang` and `dir` are wired at the root
- provider composition is correct for portal behavior
- sound wiring is centralized and removable
- `README.md` is present and user-facing
- verification passes

Current status:

- complete for:
  - `next + base + rtl`
  - `next + radix + rtl`
  - `vite + base + rtl`
  - `vite + radix + rtl`
  - `start + base + rtl`
  - `start + radix + rtl`
- scaffold execution works through shadcn
- Next overlay is applied
- Vite overlay is now applied for the first Base UI happy path
- the oversized Next overlay file has been refactored into smaller focused modules under `src/overlays/next/`
- sound feature installation is real, not placeholder-only
- code-quality normalization is implemented in the generator
- `Biome`, `ESLint + Prettier`, and `Oxlint + Oxfmt` all generate successfully for the active Next path
- the active Next path now uses route-based locale handling with `/en` and `/ar`
- retained fixtures can now be generated intentionally under `fixtures/`
- the active Vite path now uses React Router locale handling with `/en` and `/ar`
- the active TanStack Start path now uses route-based locale handling with `/en` and `/ar`
- generated app typecheck and build pass
- Start verification intentionally runs `build` before `typecheck` because TanStack generates the route tree during the build flow
- secondary code-quality verification now passes for the active Base happy paths across Next, Vite, and TanStack Start

## Proposed Build Order

1. Keep the retained Next, Vite, and TanStack Start fixtures healthy as regression targets.
2. Add non-RTL variants across Next, Vite, and TanStack Start now that the RTL matrix is code-proven.
3. Keep secondary code-quality verification healthy as the matrix expands.
4. Build the marketing site after the generator contract and CLI are stable.

## Risk Areas To Track

- upstream CLI changes in shadcn
- differences in framework bootstrapping flows
- runtime RTL differences across Base UI and Radix UI
- portal direction edge cases
- generated-code drift between framework overlays
- fixture verification cost across the supported matrix
- future package-splitting pressure if Forge grows beyond a single active app/package

## Non-Goals For The First Pass

- supporting every framework shadcn can target
- preserving the legacy `create-nexcn` implementation
- shipping many optional features before the core generator works
- building the marketing site before the generator has a stable happy path
