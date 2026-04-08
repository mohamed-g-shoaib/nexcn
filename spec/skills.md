# Skills Guide

Last updated: 2026-04-08

## Purpose

This file is the routing guide for the locally installed skills in `.agents/skills/`.

Use it to decide:

- which skill to load
- when to load it
- which skills naturally pair together
- which skill should be the primary driver for a task

This file is intentionally a summary, not a replacement for the underlying skill files.

## Loading Rules

- If a task is primarily about one framework, load the framework-specific skill first.
- If a task is primarily about component APIs or shadcn conventions, load `shadcn` first.
- If a task is primarily about UI feel, motion, sound, polish, or visual refinement, load one design/UI skill first, then add framework skills only if needed.
- Avoid loading many overlapping skills unless the task clearly spans multiple concerns.
- Prefer one primary skill plus one or two complementary skills.

## Installed Skills

### `shadcn`

- Purpose: Source of truth for shadcn workflows, CLI usage, component selection, composition, styling, forms, icons, presets, and Base UI vs Radix differences.
- Use when:
  - scaffolding or updating shadcn projects
  - adding or replacing UI components
  - deciding between Base UI and Radix behavior
  - working with `components.json`
  - using presets, templates, registries, or `shadcn add/init/apply`
- Best paired with:
  - `next-best-practices`
  - `react-vite-best-practices`
  - `tanstack-start-best-practices`
  - `vercel-composition-patterns`
- Priority for Forge: Very high

### `next-best-practices`

- Purpose: Next.js-specific architecture and correctness guide covering file conventions, RSC boundaries, async APIs, metadata, route handlers, scripts, hydration, images, fonts, and bundling.
- Use when:
  - building or reviewing a Next.js app
  - creating `layout.tsx`, route handlers, metadata, or error boundaries
  - deciding client vs server boundaries
  - handling async `params`, `searchParams`, `cookies`, or `headers`
- Best paired with:
  - `shadcn`
  - `vercel-react-best-practices`
  - `vercel-composition-patterns`
- Priority for Forge: Very high for the marketing site and any Next-based starter

### `react-vite-best-practices`

- Purpose: React + Vite optimization guide for build configuration, code splitting, asset handling, HMR, env vars, and bundle analysis.
- Use when:
  - building or reviewing the Vite starter
  - configuring aliasing, code splitting, and build output
  - making Vite-specific performance decisions
  - deciding how to handle SVGs, fonts, or env vars in Vite
- Best paired with:
  - `shadcn`
  - `vercel-react-best-practices`
  - `vercel-composition-patterns`
- Priority for Forge: Very high for the Vite starter

### `tanstack-start-best-practices`

- Purpose: TanStack Start full-stack guidance for server functions, middleware, SSR, auth, deployment, hydration safety, and file organization.
- Use when:
  - building or reviewing the TanStack Start starter
  - creating server functions or request middleware
  - handling auth, SSR, hydration, or deployment adapters
  - separating server/client concerns in TanStack Start
- Best paired with:
  - `shadcn`
  - `vercel-react-best-practices`
  - `vercel-composition-patterns`
- Priority for Forge: Very high for the Start starter

### `vercel-react-best-practices`

- Purpose: Broad React and Next performance guidance from Vercel, with strong coverage of waterfalls, bundling, server performance, rerenders, rendering, and advanced React patterns.
- Use when:
  - writing or refactoring React components
  - reviewing performance-sensitive code
  - improving bundle size or data-fetching behavior
  - deciding between `startTransition`, `useDeferredValue`, memoization, or server-side strategies
- Best paired with:
  - `next-best-practices`
  - `react-vite-best-practices`
  - `tanstack-start-best-practices`
  - `react-useeffect`
- Priority for Forge: Very high across all starters

### `vercel-composition-patterns`

- Purpose: Component API and architecture guidance focused on composition, compound components, state placement, and avoiding boolean-prop sprawl.
- Use when:
  - designing reusable UI primitives or shared components
  - defining Forge starter component APIs
  - refactoring complex components with too many flags
  - deciding between compound components, context, and variant components
- Best paired with:
  - `shadcn`
  - `vercel-react-best-practices`
- Priority for Forge: High

### `react-useeffect`

- Purpose: Guardrail skill for avoiding unnecessary Effects and choosing better React patterns.
- Use when:
  - writing `useEffect`
  - reviewing code that syncs state to state
  - deciding whether something belongs in render, an event handler, memoization, or an Effect
  - debugging stale or overcomplicated client logic
- Best paired with:
  - `vercel-react-best-practices`
  - `next-best-practices`
  - `react-vite-best-practices`
- Priority for Forge: High

### `emil-design-eng`

- Purpose: High-taste design engineering guidance inspired by Emil Kowalski, especially around motion, responsiveness, transform origins, button feel, spatial logic, and interaction polish.
- Use when:
  - refining micro-interactions
  - making UI feel more premium
  - reviewing animation choices
  - tuning popovers, tooltips, buttons, drawers, and interaction timing
- Best paired with:
  - `make-interfaces-feel-better`
  - `userinterface-wiki`
  - `web-design-guidelines`
- Priority for Forge: High for polished starter UX and marketing site work

### `make-interfaces-feel-better`

- Purpose: Practical design-engineering polish guide for typography, surfaces, animation details, hit areas, icon transitions, and visual cleanup.
- Use when:
  - UI feels slightly off
  - polishing buttons, cards, icons, layouts, and transitions
  - improving typography and visual hierarchy
  - refining surfaces and spacing
- Best paired with:
  - `emil-design-eng`
  - `userinterface-wiki`
  - `web-design-guidelines`
- Priority for Forge: High

### `userinterface-wiki`

- Purpose: Large UI/UX rulebook covering motion, easing, exit animations, pseudo-elements, audio feedback, sound synthesis, predictive prefetching, typography, and visual design.
- Use when:
  - implementing sound in UI
  - designing motion systems
  - building animation-heavy components
  - reviewing interaction timing or visual hierarchy
  - handling audio accessibility and sound behavior
- Best paired with:
  - `emil-design-eng`
  - `make-interfaces-feel-better`
  - `web-design-guidelines`
- Priority for Forge: Very high for sound, motion, and advanced UX polish

### `web-design-guidelines`

- Purpose: UI review skill that checks code against the latest Vercel web interface guidelines.
- Use when:
  - auditing UI files
  - reviewing accessibility and design quality
  - checking whether a page follows current interface best practices
- Best paired with:
  - `emil-design-eng`
  - `make-interfaces-feel-better`
  - `userinterface-wiki`
- Priority for Forge: High during review passes

### `seo-audit`

- Purpose: SEO review and diagnosis skill for technical SEO, metadata, indexation, Core Web Vitals, on-page optimization, and audit prioritization.
- Use when:
  - auditing the marketing site
  - reviewing metadata, sitemap, robots, canonicals, or search issues
  - diagnosing traffic, indexing, or ranking concerns
- Best paired with:
  - `next-best-practices`
  - `web-design-guidelines`
- Priority for Forge: Medium-high for the marketing site

### `monorepo-management`

- Purpose: Monorepo architecture and tooling guidance for pnpm workspaces, Turborepo, Nx, shared package structure, dependency management, and build orchestration.
- Use when:
  - deciding whether Forge should move to a monorepo
  - setting up `apps/*` and `packages/*` workspace layouts
  - evaluating Turborepo vs plain workspaces vs Nx
  - designing shared package boundaries, dependency flow, or CI for a multi-package repo
  - migrating Forge from a single-package repo to a multi-package workspace later
- Best paired with:
  - `shadcn`
  - `next-best-practices`
  - `react-vite-best-practices`
  - `tanstack-start-best-practices`
- Priority for Forge: Medium for now, high if the repo grows into multiple actively developed apps/packages

## Recommended Skill Bundles

### 1. Generator and starter scaffolding

- Primary: `shadcn`
- Add:
  - `next-best-practices` for Next starter work
  - `react-vite-best-practices` for Vite starter work
  - `tanstack-start-best-practices` for Start starter work

### 2. Shared React component work

- Primary: `vercel-react-best-practices`
- Add:
  - `vercel-composition-patterns`
  - `react-useeffect`

### 3. UI polish and interaction work

- Primary: `emil-design-eng`
- Add:
  - `make-interfaces-feel-better`
  - `userinterface-wiki`

### 4. Sound and motion work

- Primary: `userinterface-wiki`
- Add:
  - `emil-design-eng`
  - `make-interfaces-feel-better`

### 5. UI review pass

- Primary: `web-design-guidelines`
- Add:
  - one framework skill
  - one design skill if the review is visual rather than only structural

### 6. Marketing site SEO pass

- Primary: `seo-audit`
- Add:
  - `next-best-practices`
  - `web-design-guidelines`

### 7. Monorepo and workspace decisions

- Primary: `monorepo-management`
- Add:
  - `shadcn`
  - one framework skill when the workspace decision affects a specific starter or app

## Forge-Specific Defaults

For this project, default skill choices should usually be:

- Generator architecture or component scaffolding:
  - `shadcn`
- Monorepo or workspace-structure decisions:
  - `monorepo-management`
- Next.js marketing site work:
  - `next-best-practices`
  - `vercel-react-best-practices`
  - `shadcn`
- Vite starter work:
  - `react-vite-best-practices`
  - `vercel-react-best-practices`
  - `shadcn`
- TanStack Start starter work:
  - `tanstack-start-best-practices`
  - `vercel-react-best-practices`
  - `shadcn`
- Motion, sound, or tactile UI:
  - `userinterface-wiki`
  - `emil-design-eng`
  - `make-interfaces-feel-better`
- Shared component API design:
  - `vercel-composition-patterns`

## Notes on Structure

- If a skill folder contains `AGENTS.md`, that file may contain the full compiled skill or detailed rulebook.
- If a skill has both `SKILL.md` and `AGENTS.md`, use `SKILL.md` as the quick summary and open `AGENTS.md` or `rules/` only when deeper guidance is needed.
- If a skill has a `rules/` folder, load only the specific rule files relevant to the current task.
- If a skill has `references/`, use them only when the task calls for that supporting material.
