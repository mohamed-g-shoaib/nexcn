# Forge Context

Last updated: 2026-04-08

## Purpose

This file is the working memory for the Forge rebuild. It exists to keep the project grounded in current facts and reduce drift, stale assumptions, and legacy Nexcn carryover.

## Current Repository State

- The old project has been moved into [deprecated/](/D:/Developer/nexcn/deprecated).
- The active rebuild surface is now the repository root.
- No new production generator scaffold has been created yet in the active root.
- `nexcn` is now legacy repository naming only and should not appear in new public-facing product copy or specs.

## Product Identity

- Product name: `Forge`
- Legacy name: `Nexcn`
- Public-facing and spec-facing language should use `Forge`.

## Scope

Forge is a generator/starter product that will support:

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

Internal framework ids are:

- `next`
- `vite`
- `start`

User-facing label for `start` is `TanStack Start`.

## Architecture Direction

Forge should not be implemented as 6 or 12 complete template folders.

The preferred architecture is a layered generator:

1. scaffold adapter
2. framework overlay
3. feature packs

Preferred implementation direction:

- rely on current official framework tooling as much as possible
- rely on current shadcn tooling as much as possible
- let shadcn own framework/base/RTL scaffold complexity where it already does the job well
- let Forge own:
  - minimal starter experience
  - runtime provider and layout wiring
  - README and user-facing docs
  - opinionated structure
  - sound setup
  - user-facing polish

## shadcn Baseline

Default shadcn preset:

- family: `luma`
- preset code: `b1VlIwYS`

Preset characteristics:

- base color: `neutral`
- theme: `neutral`
- chart color: `neutral`
- heading/font: `geist`
- icon library: `lucide`
- radius: `default`
- menu: `default/solid`

Command shapes currently assumed by the generator contract:

- Base UI:
  - `pnpm dlx shadcn@latest init --preset b1VlIwYS --base base --template next --rtl`
- Radix UI:
  - `pnpm dlx shadcn@latest init --preset b1VlIwYS --template next --rtl`

## Starter UX Decisions

Generated starter apps must be intentionally minimal.

Users should be able to clean the starter in under 1 minute.

The starter page should include only:

- a small heading
- one short description explaining where to start editing
- theme switch control
- language switch control when RTL mode is enabled

The starter should avoid:

- large marketing copy
- feature grids
- heavy demo layouts
- unnecessary sections

## Runtime RTL and Layout Decisions

RTL is not only a scaffold-time flag.

Forge-generated apps must handle direction at runtime in the app shell:

- dynamic `lang`
- dynamic `dir`
- root-level provider composition
- correct portal direction behavior
- font switching where needed

This must be handled in framework-specific root shells:

- Next.js:
  - `layout.tsx` and the root document shell
- Vite:
  - document shell and root app entry
- TanStack Start:
  - root document/app shell equivalent

Provider composition must account for:

- theme provider
- tooltip provider
- direction provider where needed
- any other provider or component that affects `html`, `children`, or portal behavior

Direction should not rely only on inheritance when official docs indicate explicit direction handling is safer.

## Sound and Polish Decisions

Forge should use `soundcn`.

Install commands:

- `pnpm dlx shadcn@latest add @soundcn/use-sound @soundcn/click-soft`
- `pnpm dlx shadcn@latest add @soundcn/use-sound @soundcn/switch-off`
- `pnpm dlx shadcn@latest add @soundcn/use-sound @soundcn/switch-on`

Theme mapping:

- `switch-on` for light mode
- `switch-off` for dark mode

Sound implementation requirements:

- shared
- high performance
- easy to remove
- centralized instead of duplicated across components

Generated apps should also be:

- dark/light ready
- UI sound ready
- keyboard shortcut ready if needed
- pre-customized for scrollbar and text-selection styling in CSS

## Generated App Boundaries

Generated starter apps should not include:

- internal skill setup
- internal skill routing docs
- internal `spec/` files

Generated starter apps should include:

- a clear `README.md`
- only necessary user-facing docs or guides

Forge itself should use the local installed skills during development, but generated apps should stay clean and user-facing.

## Marketing Site Direction

There will be a separate marketing site.

Framework:

- Next.js

v1 scope:

- a single landing page
- hero section
- features
- template options/configurator
- copyable install command

Users should choose:

- framework
- base
- RTL yes/no

The marketing site should not become a multi-page docs-heavy site before the generator contract is stable.

## Research Handling

Research in [research.md](/D:/Developer/nexcn/spec/research.md) should be treated as current enough for the current planning pass unless a genuinely new ambiguity appears.

Do not re-browse by default just because a spec edit is being made.

## Delivery Priorities

- Build the generator first.
- Generate examples later as fixtures from the generator.
- Do not hand-maintain a farm of example starters.
- Do not manually scaffold the marketing site before the generator contract and first happy path are stable.

## Open Questions

- What repository structure best supports the first implementation without over-engineering the rebuild?
- What should the normalized config and adapter interfaces look like in code?
- What exact locale pair should the RTL starter ship with for the first language switch?
- What verification strategy should be used for generated fixtures across the supported matrix?
