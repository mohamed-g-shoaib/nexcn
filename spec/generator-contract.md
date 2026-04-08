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

Generated apps should not include:

- internal `spec/` files
- internal skill setup
- internal skill routing docs

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
- one short description explaining where to start editing
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

## Provider Composition Rules

Every generated project must have a clear root provider composition strategy.

### Base provider responsibilities

- theme provider
- tooltip provider
- direction provider where needed by the selected primitive system
- any shared sound runtime entry point if one is used

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
- font switching where needed

### Important note

Language switching and direction switching are related but not identical. Forge must keep them coordinated in the root shell.

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
  packageManager: "pnpm" | "npm" | "yarn" | "bun";
  presetCode: "b1VlIwYS";
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
- no internal `spec/` files
- no internal skill routing docs

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

### Fixture strategy

- example apps should be generated from Forge later as fixtures
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

### v1 should avoid

- complicated dashboards
- large interactive demos
- too many pages before the generator contract is stable

## Implementation Order

1. Finalize this contract and the supporting spec surface.
2. Define the repo structure plus config schema and adapter interfaces.
3. Implement one happy path:
   - `next + base + rtl`
4. Validate runtime direction, providers, minimal starter UX, and sound wiring.
5. Generate fixtures from the working generator.
6. Add `next + radix`.
7. Add `vite`.
8. Add `start`.
9. Build the marketing site after the CLI contract is stable.

## Open Items

- exact first locale pair for RTL-enabled starters
- exact repository/package layout for implementation
- exact verification matrix and fixture automation strategy
