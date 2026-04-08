# Forge Research Notes

Last updated: 2026-04-08

## Scope

This note captures the current official state of the tools Forge plans to build on:

- Next.js
- Vite
- TanStack Start
- shadcn/ui
- Base UI
- Radix UI
- pnpm workspaces
- Turborepo
- Changesets

It is intentionally focused on facts that affect generator architecture, scaffolding, RTL support, and long-term maintenance.

## Verified Current State

### Next.js

- The latest App Router docs currently show Next.js `16.2.2`.
- Current minimum Node.js version in the official installation docs is `20.9`.
- `create-next-app` now supports:
  - TypeScript
  - ESLint or Biome
  - React Compiler prompt
  - Tailwind CSS
  - App Router
  - import alias configuration
  - AGENTS.md inclusion
- Useful CLI flags for generator integration:
  - `--yes`
  - `--skip-install`
  - `--disable-git`
  - `--use-pnpm` / `--use-npm` / `--use-yarn` / `--use-bun`
  - `--empty`
- Turbopack is now the default bundler in the generated scripts.

### Vite

- Official docs currently require Node.js `20.19+` or `22.12+`.
- `create-vite` supports direct template selection and non-interactive usage.
- Relevant templates include:
  - `react-ts`
  - `react-swc-ts`
- Vite scaffolds are simple and flexible, but alias and Tailwind setup still matter when adding shadcn manually.
- Vite keeps `index.html` at the project root and treats it as source code, which affects RTL/document setup and overlay design.

### TanStack Start

- TanStack Start is still in `Release Candidate` stage, though docs describe it as feature-complete and API-stable.
- Official current docs describe it as a full-stack React framework powered by TanStack Router and Vite.
- Current official guidance for starting a project mentions:
  - `npm create @tanstack/start@latest`
  - `pnpm create @tanstack/start@latest`
  - `npx @tanstack/cli create`
- TanStack Start currently exposes features such as:
  - full-document SSR
  - streaming
  - server functions
  - middleware
  - SPA mode
  - static prerendering
  - ISR
- Important limitation:
  - TanStack Start does **not currently support React Server Components**
- The docs explicitly say TanStack Start is the recommended way to set up SSR with TanStack Router.

### shadcn/ui

- The current installation guidance recommends `shadcn/create` for new projects.
- The CLI supports `init` and `create` for scaffolding.
- Official CLI options now include:
  - `--template`
  - `--base`
  - `--preset`
  - `--monorepo`
  - `--rtl`
  - `--css-variables`
- Supported scaffold templates in the CLI docs are:
  - `next`
  - `vite`
  - `start`
  - `react-router`
  - `laravel`
  - `astro`
- `create` is documented as an alias for `init`.
- The current docs strongly position shadcn as framework-aware and base-aware rather than as a single-framework setup.

### shadcn/ui RTL

- shadcn now has first-class RTL support.
- When `rtl: true` is set in `components.json`, the CLI automatically transforms:
  - physical positioning utilities into logical ones
  - directional props
  - text alignment and spacing classes
  - supported icons with RTL flipping helpers
- Automatic RTL transformation is only available for projects created with the newer styles such as:
  - `base-nova`
  - `radix-nova`
- Current docs explicitly call out a known `tw-animate-css` issue:
  - some logical slide utilities do not behave correctly
  - portal elements may still need explicit `dir` props
- The framework RTL guides also recommend DirectionProvider plus language-specific font setup.

### shadcn/ui Skills

- shadcn now provides an installable project skill.
- Install command:
  - `pnpm dlx skills add shadcn/ui`
- The skill reads `components.json`, runs `shadcn info --json`, and injects project-aware context such as:
  - framework
  - Tailwind version
  - aliases
  - base library
  - installed components
- This is highly relevant to Forge because the generator should stay skill-friendly during development even though generated apps should remain clean and user-facing.

### Base UI

- Base UI is now in the `@base-ui/react` package namespace.
- The current Base UI releases page shows `v1.2.0` as latest.
- Base UI is unstyled, composable, and compatible with Tailwind or other styling systems.
- Base UI requires extra attention for portals:
  - the docs recommend adding `.root { isolation: isolate; }` around the app root for proper popup layering
- Base UI has a `DirectionProvider`, but it does **not** itself set HTML/CSS document direction; the app must also set `dir="rtl"` or equivalent.
- The `useDirection` hook is useful for portaled components rendered outside the subtree with `dir`.

### Radix UI

- Radix provides unstyled primitives and a global `Direction.Provider`.
- Current docs show the newer unified `radix-ui` package entrypoint.
- Radix release notes confirm:
  - React 19 compatibility
  - RSC compatibility updates
- Important RTL edge case from Radix releases:
  - Radix made a breaking change requiring `DirectionProvider` instead of relying on `dir` attribute inheritance alone for some RTL behavior.

### pnpm Workspaces

- pnpm `10.x` has built-in workspace support for multi-package repositories.
- A workspace must have a `pnpm-workspace.yaml` file at the root.
- The `workspace:` protocol forces resolution to local workspace packages and fails if the target package is not present locally.
- `sharedWorkspaceLockfile` defaults to `true`, which gives one root lockfile and faster monorepo installs.
- pnpm docs explicitly recommend Changesets or Rush for release workflows because pnpm itself does not provide built-in versioning for workspaces.
- pnpm catalogs are now an official workspace feature for centralizing dependency versions in `pnpm-workspace.yaml`.

### Turborepo

- Current Turborepo docs describe it as a build system designed for scaling monorepos while also helping single-package workspaces.
- Turborepo can be incrementally added to an existing repository.
- Turborepo is built on top of package-manager workspaces rather than replacing them.
- Turborepo docs still frame the main repository-structuring story around multi-package workspaces.

### Changesets

- Changesets is still positioned as versioning and changelog tooling focused on monorepos and multi-package repositories.
- It coordinates version bumps, changelogs, and internal dependency updates across packages.
- It is best introduced once a repo actually has publishable or release-managed multiple packages.

## Generator Implications

### Strong Recommendation

Forge should not maintain a matrix of complete app templates for:

- 3 frameworks
- 2 base libraries
- 2 direction modes

That would create 12 full variants and drift quickly.

Instead, Forge should use a layered generator:

1. framework scaffold adapter
2. framework overlay
3. optional feature packs

### Best Fit For Each Layer

#### Scaffold Adapter

Use the official tool closest to the framework:

- Next.js:
  - likely `create-next-app` or shadcn `init/create -t next`
- Vite:
  - likely `create-vite` or shadcn `init/create -t vite`
- TanStack Start:
  - likely `@tanstack/cli create` or shadcn `init/create -t start`

#### Preferred Strategy

For the initial version, the cleanest path is to let shadcn do as much of the initial scaffold as possible because it already understands:

- framework template
- base library choice
- preset/style
- monorepo mode
- RTL mode

Then Forge applies:

- README and user-facing docs
- project conventions
- runtime shell and provider wiring
- sound and polish overlays
- feature overlays

## Key Edge Cases

### 1. Template Naming Drift

The shadcn CLI docs use `start` as the template name for TanStack Start.

Forge should standardize internally on `start` when invoking shadcn, even if user-facing copy says `TanStack Start`.

### 2. TanStack Start Is Not Yet 1.0

It is close, but still RC.

Implication:

- support it in v1, but mark it as more volatile than Next.js and Vite
- pin generated dependencies carefully
- expect overlay churn

### 3. Next.js Already Has AGENTS.md Support

`create-next-app` now offers AGENTS.md generation.

Implication:

- if Forge uses `create-next-app` directly, it must decide whether to:
  - keep the generated agent docs
  - replace them
  - merge them with Forge guidance

### 4. RTL Is Not "Done" Just Because `rtl: true` Exists

Even with shadcn RTL transforms:

- HTML `dir` and `lang` must still be set
- DirectionProvider still matters
- font setup still matters
- portal components may still need explicit `dir`
- animations can still have edge cases because of `tw-animate-css`

### 5. Base UI and Radix Have Different Runtime Expectations

Both are headless and composable, but they are not drop-in identical in all details.

Implication:

- Forge should not promise identical generated component code across both bases
- overlays should stay thin and let shadcn own most base-specific output

### 6. Vite Alias Setup Is More Manual Outside shadcn

If Forge ever falls back to plain `create-vite` without shadcn-driven setup, it must remember:

- `tsconfig.json`
- `tsconfig.app.json`
- `vite.config.ts`
- Tailwind integration

all need coordinated updates for `@/*`.

### 7. Portals Need Extra RTL Attention

This applies especially to:

- Base UI
- Radix
- shadcn components using portal-based popups

Implication:

- Forge should include a documented portal-direction rule in generated guidance
- overlays may need explicit `dir` plumbing in some shared wrappers

### 8. Monorepo Support Exists Upstream

shadcn already supports `--monorepo`.

Implication:

- Forge does not need to invent monorepo layout immediately
- but it should avoid architecture choices that block monorepo support later

### 9. pnpm Is A Better Future Foundation Than A Premature Monorepo Rewrite

pnpm already provides the foundational workspace features Forge would need later:

- root workspace definition
- `workspace:` protocol
- shared lockfile
- recursive and filtered task execution
- official catalog support for shared dependency versions

Implication:

- Forge can safely stay single-package now
- if Forge later becomes multi-package, `pnpm` workspaces should be the first move

### 10. Turborepo Is Best Added After Real Workspace Boundaries Exist

Turborepo is designed for monorepo task orchestration, caching, and CI acceleration, but it sits on top of workspaces.

Implication:

- Forge should not add Turborepo before it has multiple active apps/packages with real shared task orchestration needs
- Turborepo remains the preferred future orchestration layer if that threshold is crossed

### 11. Changesets Should Follow Publishing Reality, Not Precede It

Changesets is purpose-built for multi-package versioning and changelogs.

Implication:

- Forge should not add Changesets in the first single-package phase
- add it only if Forge later publishes multiple packages or needs coordinated workspace releases

## Final Recommendation

### Build Forge as:

- one CLI
- one marketing site
- one spec-driven product layer
- three framework adapters:
  - Next.js
  - Vite
  - TanStack Start
- two base options:
  - Base UI
  - Radix UI
- one RTL feature flag

### Do Not Build:

- 6 or 12 full template folders
- a repo-cloning installer
- framework-specific copies of everything

### Preferred Technical Direction

1. Use official framework-aware scaffolding, preferably via shadcn where possible.
2. Let shadcn own component-generation complexity for:
   - framework
   - base
   - preset
   - RTL transformation
3. Let Forge own:
   - project conventions
   - README and user-facing documentation
   - runtime shell wiring
   - optional overlays and future feature packs
4. Treat TanStack Start as supported-but-more-volatile until 1.0 lands.

### Repository Decision

- Start Forge as a single-package repo.
- Use `pnpm` for the Forge repository itself.
- Do not add Turborepo in the first implementation.
- If Forge later becomes a real multi-package workspace, use `pnpm` workspaces first and add Turborepo only when task orchestration becomes worthwhile.

## Suggested Next Implementation Step

Define the first implementation shape before writing code:

- CLI entrypoint and prompt flow
- config schema and normalized option model
- scaffold adapter interface
- overlay and feature-pack pipeline
- verification and fixture strategy
