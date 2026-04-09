# Forge Context

Last updated: 2026-04-09

## Purpose

This file is the working memory for the Forge rebuild. It exists to keep the project grounded in current facts and reduce drift, stale assumptions, and legacy Nexcn carryover.

## Current Repository State

- The old project has been moved into [deprecated/](/D:/Developer/nexcn/deprecated).
- The active rebuild surface is now the repository root.
- A real single-package Forge generator now exists in the active root under `src/`.
- The first implemented and verified generation paths are:
  - `next + base + rtl`
  - `next + radix + rtl`
  - `next + base + non-rtl`
  - `next + radix + non-rtl`
  - `vite + base + rtl`
  - `vite + radix + rtl`
  - `vite + base + non-rtl`
  - `vite + radix + non-rtl`
  - `start + base + rtl`
  - `start + radix + rtl`
  - `start + base + non-rtl`
  - `start + radix + non-rtl`
- Forge can now scaffold through shadcn, apply the Next overlay, install the sound feature pack, and verify the generated app with typecheck and build steps.
- The Next overlay implementation has been split into smaller focused modules under `src/overlays/next/` so the overlay coordinator stays small and easier to extend.
- Forge can now generate retained fixtures into `fixtures/` via `forge generate --fixture`.
- Forge now retains verified regression fixtures for Next, Vite, and TanStack Start.
- Forge now supports three code-quality options in the active Next happy path:
  - `Biome`
  - `ESLint + Prettier`
  - `Oxlint + Oxfmt`
- Forge now normalizes generated projects back to the user-selected package manager after scaffold-time temp commands so internal shadcn execution does not leak the wrong lockfile or install layout into the final app.
- Generated starter READMEs now reflect the selected package manager instead of assuming `pnpm`.
- Forge package-manager verification is now code-proven for `pnpm`, `npm`, `bun`, and `yarn`.
- Forge dependency freshness is now an active generator concern rather than manual cleanup:
  - generated apps normalize direct dependencies and devDependencies to current npm `latest` dist-tags before final install
  - current latest verification has been exercised across Next, Vite, and TanStack Start
  - compatibility follow-through now includes TypeScript 6 CSS declarations, Vite 8 config cleanup, and TanStack Start tsconfig normalization
- Yarn behavior is now explicitly understood rather than treated as an anomaly:
  - Corepack resolves the nearest `package.json` with a `packageManager` field
  - modern Yarn should be treated as a Corepack-managed tool, not legacy global Yarn 1
  - Forge-generated Yarn apps should declare their own project boundary and prefer `nodeLinker: node-modules` for starter compatibility
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
  - code-quality tooling setup
  - user-facing polish

Repository structure decision:

- Forge itself starts as a single-package repo
- Forge does not use Turborepo in the first pass
- Forge stays monorepo-ready for a future `pnpm` workspace migration if it grows into multiple active apps/packages

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
  - `npx shadcn@latest init --preset b1VlIwYS --base base --template next --rtl`
  - `yarn dlx shadcn@latest init --preset b1VlIwYS --base base --template next --rtl`
  - `bunx --bun shadcn@latest init --preset b1VlIwYS --base base --template next --rtl`
- Radix UI:
  - `pnpm dlx shadcn@latest init --preset b1VlIwYS --template next --rtl`
  - `npx shadcn@latest init --preset b1VlIwYS --template next --rtl`
  - `yarn dlx shadcn@latest init --preset b1VlIwYS --template next --rtl`
  - `bunx --bun shadcn@latest init --preset b1VlIwYS --template next --rtl`

## Starter UX Decisions

Generated starter apps must be intentionally minimal.

Users should be able to clean the starter in under 1 minute.

The starter page should include only:

- a small heading
- one short description explaining exactly where to start editing, with explicit file references when helpful for low-knowledge users
- theme switch control
- language switch control when RTL mode is enabled

When RTL mode is disabled, generated starters should stay clearly single-language:

- no language switch control
- no dead locale helpers or route segments
- no hidden multilingual state that survives from the RTL path

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
- persisted locale/direction across refreshes
- root-level provider composition
- correct portal direction behavior
- font switching where needed

Preferred long-term direction:

- locale should be represented in the route for frameworks that support routing well
- persistence helpers such as cookies or storage may remember preference, but should not be the primary source of locale truth

Current Next.js implementation direction:

- use route-based locale handling
- use all-prefixed locale routes:
  - `/en`
  - `/ar`
- use `/` only as an entry path that redirects to the preferred locale
- when RTL mode is disabled:
  - generate a single-language LTR app shell
  - do not generate locale routes or language switching UI
  - keep `lang="en"` and `dir="ltr"` stable without locale-routing overhead

Current Vite implementation direction:

- use route-based locale handling with React Router declarative mode
- use all-prefixed locale routes:
  - `/en`
  - `/ar`
- use `/` only as an entry path that redirects to the default locale
- derive runtime `document.documentElement.lang` and `dir` from the active route locale
- when RTL mode is disabled:
  - generate a single-language LTR app shell
  - do not install or depend on React Router only for locale handling
  - keep `document.documentElement.lang="en"` and `dir="ltr"` stable through the root provider layer

Current TanStack Start implementation direction:

- use route-based locale handling
- use all-prefixed locale routes:
  - `/en`
  - `/ar`
- use `/` only as an entry path that redirects to the default locale
- derive `html lang` and `html dir` from the active route locale in the root document shell
- when RTL mode is disabled:
  - generate a single-language LTR app shell
  - do not generate locale-param routes or language switching UI
  - keep `html lang="en"` and `html dir="ltr"` stable from the root document shell

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

Theme-dependent UI in generated apps must not render server/client-varying labels or icon states before mount when the active theme cannot be known during SSR.
For SSR frameworks, locale switches must not cause a temporary theme flash. The document shell should preserve the active explicit theme across locale navigations instead of repainting the default theme first.
For Vite and TanStack Start starters, the document shell should apply the stored explicit theme before React mounts so a dark/light flash does not appear on initial load or refresh.

For Next.js starters, locale-driven `lang` and `dir` should be initialized from the route locale itself.
For TanStack Start starters, locale-driven `lang` and `dir` should be initialized from the route locale itself.

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
- the selected code-quality tooling setup when that option is enabled by the generator contract

Forge itself should use the local installed skills during development, but generated apps should stay clean and user-facing.

Forge implementation should treat the relevant local skills as the default source of engineering and design craft:

- `shadcn`
- `emil-design-eng`
- `make-interfaces-feel-better`
- `userinterface-wiki`
- `next-best-practices`
- `react-useeffect`
- `vercel-react-best-practices`
- `tanstack-start-best-practices`
- `vercel-composition-patterns`

Vite preparation should start from [vite-implementation.md](/D:/Developer/nexcn/spec/vite-implementation.md), not from a blank planning pass.
Dependency version freshness and deprecation handling should follow [dependency-freshness.md](/D:/Developer/nexcn/spec/dependency-freshness.md).
Forge should normalize generated app direct dependencies and devDependencies to current npm `latest` dist-tags before the final install so scaffold drift does not become product drift.
Freshness normalization must stay verification-backed: current generated apps should remain compatible with TypeScript 6, Next 16.2, Vite 8, and the latest TanStack Start-compatible dependency set after Forge applies its overlay patches.

## Research Handling

Research in [research.md](/D:/Developer/nexcn/spec/research.md) should be treated as current enough for the current planning pass unless a genuinely new ambiguity appears.

Do not re-browse by default just because a spec edit is being made.

## Delivery Priorities

- Build the generator first.
- Generate examples later as fixtures from the generator.
- Do not hand-maintain a farm of example starters.
- Keep code-quality tooling choice aligned with the generator roadmap rather than letting it become a separate product track.

## Locked Defaults

- RTL starter language pair: `en` + `ar`
- Forge repository package manager: `pnpm`
- Example apps are generated fixtures, not hand-maintained apps
- Generated apps will support a user-facing code-quality choice:
  - `Biome`
  - `ESLint + Prettier`
  - `Oxlint + Oxfmt`

## Next Implementation Tasks

- keep the retained Next fixtures healthy as regression targets
- keep the retained Vite fixtures healthy as regression targets
- keep the retained TanStack Start fixtures healthy as regression targets
- keep code-quality behavior aligned across all three frameworks, especially where framework tooling generates files during build
- keep the retained non-RTL fixtures healthy now that the full direction matrix is implemented
- keep dependency freshness normalization aligned with current npm `latest` dist-tags for direct generated-app dependencies
