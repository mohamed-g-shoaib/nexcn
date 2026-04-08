# Forge Generator Contract

Last updated: 2026-04-08

## Purpose

This file defines the v1 contract for the Forge generator.

It is the source of truth for:

- supported options
- generated project guarantees
- scaffold pipeline
- runtime layout rules
- starter UI expectations
- provider wiring
- docs boundaries
- feature boundaries
- code-quality tooling choices

## Product Goal

Forge should generate a modern project that is:

- current
- minimal
- easy to clean in under 1 minute
- ready for RTL or non-RTL usage
- ready for either Base UI or Radix UI
- aligned with current framework and shadcn best practices

## Supported Matrix

### Frameworks

- `next`
- `vite`
- `start`

User-facing labels:

- `next` -> `Next.js`
- `vite` -> `Vite`
- `start` -> `TanStack Start`

### Primitive Bases

- `base`
- `radix`

### Direction Modes

- `rtl: true`
- `rtl: false`

### Default RTL Locales

- primary LTR locale: `en`
- primary RTL locale: `ar`

## Default shadcn Preset

Forge standardizes on the following default preset for v1:

- family: `luma`
- preset code: `b1VlIwYS`
- base color: `neutral`
- theme: `neutral`
- chart color: `neutral`
- heading/font: `geist`
- icon library: `lucide`
- radius: `default`
- menu: `default/solid`

Preferred scaffold command shape:

- Base UI:
  - `pnpm dlx shadcn@latest init --preset b1VlIwYS --base base --template <framework> [--rtl]`
- Radix UI:
  - `pnpm dlx shadcn@latest init --preset b1VlIwYS --template <framework> [--rtl]`

The generator may swap `pnpm` for the selected package manager, but the preset and template semantics should remain equivalent.

## Non-Goals

The generator does not aim in v1 to:

- support every framework shadcn supports
- provide heavy starter screens
- ship a demo-rich app
- maintain 6 or 12 fully duplicated template folders
- include internal project specs inside generated apps
- include internal skill-routing docs inside generated apps
- guarantee identical generated component code across Base UI and Radix UI

## Core Product Promise

Every generated Forge app should include:

- a current framework-aware scaffold, preferably through official tooling that shadcn already supports well
- the Forge default shadcn preset
- a minimal starter UI
- theme switching
- language switching when RTL mode is enabled
- a tiny editable landing surface
- a clear place to start editing immediately
- runtime `lang` and `dir` handling in the root shell
- root provider composition that is safe for portal-based UI
- centralized sound wiring using `soundcn`
- pre-customized scrollbar and text-selection styling
- an opinionated folder structure
- a clear `README.md`
- only necessary user-facing docs or guides
- one selected code-quality tooling setup
- support for the selected primitive base with explicit runtime provider composition where needed

Generated apps should not include:

- internal `spec/` files
- internal skill setup
- internal skill routing docs

## Code Quality Tooling Contract

Forge should support the following generated-app tooling choices in v1:

- `biome`
- `eslint-prettier`
- `oxlint-oxfmt`

This option is a valid part of starter generation, but should remain secondary to:

- framework
- base
- RTL

### User-facing labels

- `Biome`
- `ESLint + Prettier`
- `Oxlint + Oxfmt`

### Required guarantees

Every generated app should include:

- one selected lint/format stack
- a stable command surface:
  - `lint`
  - `lint:fix`
  - `format`
  - `format:check`
- lightweight README guidance describing the selected tooling

### v1 implementation rule

Do not let tooling choice delay the core generator architecture, runtime RTL contract, or framework happy paths.

## Starter UX Contract

The generated starter interface must stay intentionally minimal.

### Required traits

- users should understand the starter within seconds
- users should be able to remove or replace starter content in under 1 minute
- the page should not feel like a demo site that requires cleanup
- the page should still demonstrate:
  - theme switching
  - language switching when applicable
  - one simple editable content area

### Initial starter content

The starter page should include only:

- a small heading
- one short description explaining where to start editing, preferably naming the first file or folder a low-knowledge user should open
- theme switch control
- language switch control when RTL mode is enabled

### Starter content should avoid

- large marketing copy
- feature grids
- complex navigation
- heavy card layouts
- filler illustrations
- unnecessary sections

## Runtime Shell Contract

RTL support is not just a scaffold-time flag.

Forge must wire direction and language at runtime in the app shell.

### Required runtime responsibilities

- set `lang` dynamically at the document/root level
- set `dir` dynamically at the document/root level
- preserve active locale/direction across refreshes
- compose providers correctly around `children`
- ensure portal-based components receive correct direction behavior
- ensure fonts can switch appropriately for RTL locales where needed

### Framework-specific expectation

#### Next.js

Use the root layout/document shell pattern, such as `layout.tsx`, to manage:

- `html lang`
- `html dir`
- theme provider
- tooltip provider
- direction provider when required
- any other top-level provider that affects `html`, `children`, or portal behavior

Preferred long-term locale strategy for Next.js:

- use route-based locale handling for real multilingual starters
- let the route locale drive document `lang`, document `dir`, dictionaries, and layout decisions
- use `/` only as an entry path that redirects to a locale route

#### Vite

Use the document shell plus root app entry to manage:

- document language
- document direction
- provider composition
- portal direction handling

#### TanStack Start

Use the root document/app shell equivalent to manage:

- document language
- document direction
- provider composition
- portal direction handling

Preferred current locale strategy for TanStack Start:

- use route-based locale handling for real multilingual starters
- let the route locale drive document `lang`, document `dir`, and layout decisions
- use `/` only as an entry path that redirects to a locale route

## Provider Composition Rules

Every generated project must have a clear root provider composition strategy.

### Base provider responsibilities

- theme provider
- tooltip provider
- direction provider where needed by the selected primitive system
- any shared sound runtime entry point if one is used

### Current Next.js implementation preference

- keep the server root layout responsible for the stable document shell:
  - font setup
  - initial `html` attributes
  - body wrapper
- keep interactive/runtime providers in a dedicated client boundary such as `components/app-providers.tsx`
- synchronize runtime `lang` and `dir` from that provider boundary instead of pushing client-only provider logic into `layout.tsx`

### Direction rules

- `dir` must be driven from runtime locale or selected language state
- `lang` must be kept in sync with active language
- provider-level direction must not rely only on DOM inheritance where official docs indicate explicit direction handling is safer
- portal components must be treated as a special case

## Language Contract

When RTL mode is enabled, the generated app should include a language-aware root shell.

### Minimum requirement

- dynamic `lang`
- dynamic `dir`
- language switch UI
- persisted active locale between reloads
- font switching where needed

### Important note

Language switching and direction switching are related but not identical. Forge must keep them coordinated in the root shell.

### Preferred architecture

For frameworks with strong routing support, locale should eventually be URL-addressable rather than only client-stateful.

This means:

- refresh should preserve locale because the route preserves locale
- shareable URLs should preserve locale
- server rendering should know the locale without guessing from client state

### URL strategy note

The current preferred Next.js model is:

- all locales prefixed:
  - `/en`
  - `/ar`
- `/` redirects to one of those locale routes

Forge should prefer the URL as the source of truth.

## Theme Hydration Contract

Generated apps must avoid hydration mismatches caused by rendering theme-dependent UI before the client has mounted.

### Rules

- do not render text or icon state derived from `useTheme` during SSR when the active theme is unknown on the server
- render a stable fallback for theme controls until mount, or defer theme-dependent UI until after mount
- keep `next-themes` hydration requirements in mind when rendering controls based on `theme` or `resolvedTheme`

## Sound Contract

Generated projects should be sound-ready using `soundcn`.

### Required packages

- `@soundcn/use-sound`
- `@soundcn/click-soft`
- `@soundcn/switch-off`
- `@soundcn/switch-on`

### Theme mapping

- `switch-on` for light mode
- `switch-off` for dark mode

### Sound rules

- sound should be optional at runtime
- sound playback should be lightweight and unobtrusive
- sound should not autoplay on load
- sound hooks should be easy to remove
- sound wiring should be centralized so users can disable it quickly
- sound logic should not be duplicated across components

### Initial usage

- theme switching should use the shared `switch-on` / `switch-off` mapping
- a shared click sound helper should be available for intentional UI interactions

## Generator Architecture

Forge should be built as a layered generator.

### Layer 1: Scaffold Adapter

Responsible for invoking the scaffold path.

Preferred direction:

- let shadcn own as much of the framework/base/RTL setup as possible
- rely on current official framework tooling only when shadcn is not the better entry point

Inputs:

- framework
- package manager
- project name
- base
- rtl
- preset code

Output:

- a valid scaffolded project directory

### Retained Fixtures

Forge should support generating retained regression fixtures under a dedicated `fixtures/` root.

Current CLI expectation:

- `forge generate --fixture ...`

Retained fixtures are generated outputs and should not be treated as hand-maintained example apps.

Retained fixtures should be left in a lean state after verification:

- keep source, config, and lock files
- remove install/build artifacts such as `node_modules`, framework output folders, and TS build caches

### Layer 2: Framework Overlay

Responsible for small framework-specific Forge additions.

Examples:

- root shell wiring
- provider composition
- document language/direction handling
- minimal starter page wiring
- framework-specific README sections
- folder structure normalization

### Layer 3: Feature Packs

Responsible for optional or cross-cutting additions owned by Forge.

Initial feature packs:

- `code-quality`
- `rtl-runtime`
- `sounds`
- `starter-surface`
- `docs`
- `polish-css`

Possible future feature packs:

- `i18n`
- `seo`
- `motion`
- `auth`

## Option Normalization Contract

User choices should be normalized into a single config object before generation begins.

Example shape:

```ts
type ForgeConfig = {
  projectName: string;
  framework: "next" | "vite" | "start";
  base: "base" | "radix";
  rtl: boolean;
  localePair: "en-ar";
  packageManager: "pnpm" | "npm" | "yarn" | "bun";
  presetCode: "b1VlIwYS";
  codeQuality: "biome" | "eslint-prettier" | "oxlint-oxfmt";
};
```

No generation step should parse raw prompt answers directly after normalization.

## Scaffold Strategy

### Preferred direction

Prefer current official tooling and let shadcn own as much of the framework/base/RTL setup as possible.

### Framework invocation model

- Next.js:
  - prefer the scaffold path compatible with shadcn `template=next`
- Vite:
  - prefer the scaffold path compatible with shadcn `template=vite`
- TanStack Start:
  - prefer the scaffold path compatible with shadcn `template=start`

### Internal naming

Use `start` internally for TanStack Start where upstream tools expect that value.

## File Guarantees

Every generated project should contain:

- the framework scaffold output
- a minimal starter page
- a root app shell with correct providers
- explicit runtime `lang` and `dir` handling
- a centralized sound module/hook surface
- a clear place to edit immediately
- a `README.md`
- only necessary user-facing docs
- one selected lint/format stack
- no internal `spec/` files
- no internal skill routing docs

## Repository Structure Contract

Forge itself should start as a single-package repository.

### v1 repository rules

- no monorepo workspace layout in the first implementation
- no Turborepo in the first implementation
- use `pnpm` for the Forge repository itself
- keep the codebase structured so it can migrate to `pnpm` workspaces later if needed

### Future migration rule

If Forge later becomes a real multi-package repository, prefer:

- `pnpm` workspaces as the foundation
- `turbo` only after multiple actively developed apps/packages justify task orchestration

## Failure and Rollback Contract

Generator execution must be resilient.

### Rules

- fail early on unsupported options
- detect scaffold failures clearly
- avoid partially mutating an existing user directory when generation fails
- do not delete user content silently
- surface actionable errors when upstream scaffolds change

### Preferred behavior

- generate into a fresh directory
- stop on first non-recoverable failure
- report which step failed:
  - scaffold
  - overlay
  - feature pack
  - install
  - verify

## Verification Contract

Generated projects should be validated before Forge considers generation successful.

### Minimum verification targets

- dependency installation completes
- typecheck passes when applicable
- lint passes when applicable
- build passes when practical for the framework

Framework note:

- TanStack Start verification may need `build` to run before `typecheck` because the framework generates its route tree during the build flow

### Fixture strategy

- example apps should be generated from Forge later as fixtures
- the first implementation should directly verify the initial `next + base + rtl` happy path
- each newly supported matrix combination should add one generated fixture as a regression target
- fixture verification should replace hand-maintained starter copies where possible

## Marketing Site Contract

The marketing site should be separate from the generator implementation.

### Framework

- use Next.js

### v1 responsibilities

- explain Forge simply
- let users choose:
  - framework
  - base
  - RTL
- generate a copyable install command
- show hero, features, and a template configurator
- do not make package manager a primary configurator control in v1

### v1 should avoid

- complicated dashboards
- large interactive demos
- too many pages before the generator contract is stable

## Implementation Order

1. Keep this contract aligned with implementation as the generator evolves.
2. Refine the Next layering so cross-cutting behavior lives in explicit feature packs where possible.
3. Retain one verified happy path:
   - `next + base + rtl`
4. Generate fixtures from the working generator.
5. Keep the implemented code-quality tooling choice aligned with the active happy path and fixture strategy.
6. Add `next + radix`.
7. Add `vite`.
8. Add `start`.
9. Build the marketing site after the CLI contract is stable.
