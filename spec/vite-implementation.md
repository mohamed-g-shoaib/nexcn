# Forge Vite Implementation Spec

Last updated: 2026-04-08

## Purpose

This file prepares the Vite implementation phase so Forge does not start from zero after the Next.js work.

It captures:

- what Forge has already learned from the Next path
- what the current shadcn Vite scaffold actually looks like
- what Vite-specific constraints matter for the generator
- the preferred first implementation shape for `vite + base + rtl`

## Status

This is now an active implementation record for the first Vite path.

Vite support is implemented for the first verified path:

- `vite + base + rtl`
- `vite + radix + rtl`

The current verified paths are:

- `next + base + rtl`
- `next + radix + rtl`
- `vite + base + rtl`
- `vite + radix + rtl`

## Carry-Forward Lessons From Next

These lessons should be reused instead of rediscovered:

- keep the document shell thin and explicit
- keep runtime providers in a dedicated client boundary
- keep theme-dependent UI hydration-safe where SSR exists
- keep direction explicit at both the document and provider layers
- keep portal-sensitive direction handling intentional rather than inherited-by-accident
- keep the starter minimal and easy to delete
- keep sounds centralized and removable
- keep code-quality tooling pluggable but secondary
- keep generated verification strict:
  - `lint`
  - `format:check`
  - `typecheck`
  - `build`

## Official Findings

### Vite

From the official Vite guide:

- Vite currently requires Node.js `20.19+` or `22.12+`
- Vite treats `index.html` as source code and part of the module graph
- the default application entry for build is `<root>/index.html`
- `create-vite` supports direct non-interactive template selection

Implication for Forge:

- Vite document-level `lang` and `dir` belong in `index.html`
- runtime provider composition belongs in `src/main.tsx` and client code
- Vite overlay work must treat `index.html` as a first-class file, not as a static afterthought

### shadcn Vite

From the official shadcn docs and a local probe scaffold:

- the current scaffold command shape is compatible with `shadcn init --template vite`
- shadcn Vite scaffolds currently include:
  - `index.html`
  - `src/main.tsx`
  - `src/App.tsx`
  - `src/index.css`
  - `vite.config.ts`
  - `components.json`
- the scaffold currently uses:
  - `@vitejs/plugin-react`
  - `@tailwindcss/vite`
  - the `@` alias to `./src`
- the RTL guide for Vite explicitly says:
  - set `lang` and `dir` on the `html` element in `index.html`
  - wrap the app with `DirectionProvider` in `src/main.tsx`
  - use a proper RTL-capable font such as `Noto Sans Arabic`

Implication for Forge:

- Forge should continue letting shadcn own most Vite scaffold setup
- Forge should overlay the Vite root shell rather than replacing the scaffold strategy
- Forge should keep font and direction setup aligned with the official RTL guidance

## Local Probe Findings

The current `vite + base + rtl` probe confirmed:

- `components.json` uses `style: "base-luma"` and `rtl: true`
- Vite scaffolded `src/main.tsx` already wraps the app in `ThemeProvider`
- `index.html` still starts as plain `lang="en"` with no Forge locale behavior
- the scaffold retains demo-oriented defaults such as:
  - `src/App.tsx`
  - `src/assets/react.svg`
  - Vite title/icon defaults in `index.html`

Implication for Forge:

- the Vite overlay should remove the demo starter surface, not layer on top of it
- Forge should replace the stock Vite title/icon defaults with minimal starter defaults
- Forge should remove demo-only assets that are not part of the Forge starter contract

## Preferred Vite v1 Architecture

### Scaffold

Use shadcn as the scaffold adapter:

- Base UI:
  - `pnpm dlx shadcn@latest init --preset b1VlIwYS --template vite --base base [--rtl]`
- Radix UI:
  - `pnpm dlx shadcn@latest init --preset b1VlIwYS --template vite [--rtl]`

### Overlay

Forge should own:

- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- shared provider composition file(s)
- locale hook/runtime file(s)
- starter shell files
- README
- CSS polish
- sound integration

### Feature Packs

The same feature-pack concepts used by Next should be reused:

- `code-quality`
- `rtl-runtime`
- `sounds`
- `starter-surface`
- `docs`
- `polish-css`

## Preferred Vite v1 Locale Strategy

This is now the active implementation direction.

Current implementation:

- use React Router declarative mode
- keep the router on `BrowserRouter`
- use locale-prefixed routes:
  - `/en`
  - `/ar`
- use `/` as an entry path that redirects to the default locale
- treat the active locale route as the source of truth for `lang` and `dir`
- keep `index.html` on the default shell values so the SPA can boot predictably before routing

Why this is the active direction:

- it matches the common React + Vite ecosystem path
- it gives Vite shareable and refresh-safe locale URLs
- it avoids inventing a custom pathname layer
- it keeps the routing layer smaller than moving Vite into a framework-style contract

## Provider Strategy

Vite should mirror the successful Next boundary shape as closely as possible:

- keep `index.html` responsible for initial document attributes
- keep `src/main.tsx` thin
- keep interactive providers in a dedicated client component such as `src/components/app-providers.tsx`

Base-aware expectation:

- Base UI and Radix should not share a blindly identical provider import surface
- direction and tooltip composition should stay explicit and base-aware

## Starter Surface Expectations

Vite starters should match the same Forge contract as Next:

- small heading
- one short description with exact file references
- theme switch
- language switch when RTL mode is enabled
- no demo grids
- no marketing sections
- no stock Vite artwork

## Files The Vite Overlay Should Touch First

Priority order for the first Vite happy path:

1. `index.html`
2. `src/main.tsx`
3. `src/App.tsx`
4. `src/index.css`
5. `src/components/app-providers.tsx`
6. `src/components/theme-toggle.tsx`
7. `src/components/language-toggle.tsx`
8. `src/components/starter-shell.tsx`
9. `src/hooks/use-locale.tsx`
10. `src/hooks/use-ui-sound.ts`
11. `README.md`

## First Vite Milestone

Implement one verified path first:

- framework: `vite`
- base: `base`
- rtl: `true`
- code quality: `biome`

Definition of done:

- shadcn scaffold works through Forge
- stock Vite demo surface is removed
- runtime `lang` and `dir` sync correctly
- theme switching works
- language switching works
- sound wiring works
- README is clear
- `lint`, `format:check`, `typecheck`, and `build` all pass

Current status:

- complete for `vite + base + rtl`
- complete for `vite + radix + rtl`
- verified through Forge generation
- verified with:
  - `lint`
  - `format:check`
  - `typecheck`
  - `build`
  - React Doctor `100/100` for the Base fixture
- retained fixture:
  - `fixtures/forge-vite-base-rtl-fixture`
  - `fixtures/forge-vite-radix-rtl-fixture`

## Follow-Up After First Vite Path

After the current Vite RTL matrix:

1. add non-RTL Vite variants
2. keep the route-based locale contract stable while the broader matrix expands
3. carry the same implementation lessons into future matrix work

## Sources

Official sources used for this spec:

- [Vite Guide](https://vite.dev/guide/)
- [Vite Env and Mode Guide](https://vite.dev/guide/env-and-mode)
- [React Router Declarative Mode Installation](https://reactrouter.com/start/declarative/installation)
- [React Router BrowserRouter API](https://reactrouter.com/api/declarative-routers/BrowserRouter)
- [shadcn Vite Installation](https://ui.shadcn.com/docs/installation/vite)
- [shadcn Vite RTL Guide](https://ui.shadcn.com/docs/rtl/vite)
- [shadcn RTL Guide](https://ui.shadcn.com/docs/rtl)
- [shadcn Direction Component](https://ui.shadcn.com/docs/components/base/direction)
