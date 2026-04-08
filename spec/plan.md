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

The next logical planning step is to lock the implementation shape of the generator itself so coding can begin without reopening core architecture debates.

## Core Implementation Principles

- Build the generator first, then generate examples later as fixtures.
- Do not hand-maintain a template farm.
- Let shadcn own as much scaffold complexity as possible.
- Keep generated apps intentionally minimal.
- Keep generated apps free of internal Forge specs and skill-routing files.
- Treat the marketing site as a separate later deliverable.

## Next Planning Step

Define the repository and runtime shape for the first implementation.

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

## Proposed Build Order

1. Create the generator codebase skeleton and normalized config schema.
2. Implement the scaffold adapter around the preferred shadcn init flow.
3. Implement the Next.js overlay and root shell wiring.
4. Implement the `rtl-runtime`, `sounds`, `starter-surface`, `docs`, and `polish-css` feature packs for the first happy path.
5. Add verification commands for generated output.
6. Generate the first fixture from the generator and use it as a regression target.
7. Expand to `next + radix`.
8. Expand to `vite`.
9. Expand to `start`.
10. Build the marketing site after the generator contract and CLI are stable.

## Risk Areas To Track

- upstream CLI changes in shadcn
- differences in framework bootstrapping flows
- runtime RTL differences across Base UI and Radix UI
- portal direction edge cases
- generated-code drift between framework overlays
- fixture verification cost across the supported matrix

## Non-Goals For The First Pass

- supporting every framework shadcn can target
- preserving the legacy `create-nexcn` implementation
- shipping many optional features before the core generator works
- building the marketing site before the generator has a stable happy path
