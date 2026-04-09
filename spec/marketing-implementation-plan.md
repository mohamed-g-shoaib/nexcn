# Forge Marketing Implementation Plan

Last updated: 2026-04-09

## Purpose

This file turns the marketing-site brief into an implementation plan.

It exists to answer:

- what should be built first
- what should be scaffolded vs hand-built
- where icons will plug in
- where to pause before visual asset integration

## Locked Starting Point

Use Forge itself as the starting scaffold for the marketing site.

Preferred bootstrap:

- framework: `next`
- base: `base`
- rtl: `false`
- code-quality: `oxlint-oxfmt`

Reason:

- it validates Forge with its own output
- it gives the site the same quality baseline as generated starters
- it avoids inventing a separate setup path before the marketing app even exists

## v1 Scope

The app should remain a single landing page with:

1. hero
2. features
3. configurator
4. copyable install command

Do not add extra pages during the first implementation pass.

## Page Architecture

Recommended component map:

- `src/app/layout.tsx`
  - metadata
  - font setup
  - root background and global shell
- `src/app/page.tsx`
  - page composition only
- `src/components/marketing/page-shell.tsx`
  - top-level section order and spacing
- `src/components/marketing/hero.tsx`
  - headline
  - supporting paragraph
  - primary CTA
  - optional secondary CTA if GitHub is ready
- `src/components/marketing/features.tsx`
  - asymmetric layout
  - concrete product reasons to trust Forge
- `src/components/marketing/configurator.tsx`
  - framework/base/RTL/code-quality controls
  - state shape and section framing
- `src/components/marketing/install-command.tsx`
  - package-manager switcher
  - copy button
  - command output
- `src/components/marketing/section-heading.tsx`
  - shared small heading pattern
- `src/components/marketing/icons/`
  - user-provided icon components when available

## Content Structure

### Hero

Must communicate:

- Forge is a generator for starters
- it supports multiple frameworks and bases
- it removes setup drag without producing bloated output

Locked direction:

- headline: `Generate the starter you actually want.`
- primary CTA: scroll to configurator
- secondary CTA: omit unless GitHub is publicly ready

### Features

The section should persuade, not merely describe.

Recommended feature themes:

1. one generator, not a template farm
2. framework and base flexibility without messy setup
3. real RTL/runtime handling where needed
4. minimal output that is easy to clean
5. polished defaults for theme, sound, and tooling

### Configurator

Expose:

- framework
- base
- RTL yes/no
- code-quality tooling

Do not expose package manager as a top-level product decision.

### Install Command

Should reflect:

- current configurator state
- package-manager selection
- locked Forge command semantics

Package managers:

- `pnpm`
- `npm`
- `yarn`
- `bun`

## Design Direction

The page should lean:

- premium
- restrained
- product-focused
- technically literate

The page should avoid:

- loud gradients
- startup cliché section patterns
- decorative filler
- fake UI chrome that adds no trust

Recommended interaction details:

- subtle staggered reveals
- exact hover transitions
- `scale(0.96)` press states on pressable controls
- strong typographic hierarchy
- very small number of repeated visual motifs

## Icon Integration Plan

Icons are not required to start layout implementation, but they should have a defined insertion point.

When user-provided icons arrive, place them in:

- `src/components/marketing/icons/`

Recommended future file names:

- `next-icon.tsx`
- `vite-icon.tsx`
- `tanstack-start-icon.tsx`
- `base-ui-icon.tsx`
- `radix-ui-icon.tsx`
- `pnpm-icon.tsx`
- `npm-icon.tsx`
- `yarn-icon.tsx`
- `bun-icon.tsx`
- `index.ts`

Until those files exist:

- use text labels
- keep any icon slots structurally simple
- do not hand-recreate brand or stack icons

## Implementation Order

1. Scaffold the site from Forge using `next + base + non-rtl`.
2. Replace the minimal starter surface with the landing-page section structure.
3. Build the configurator and command-generation logic.
4. Build the package-manager switcher in the command surface.
5. Refine typography, spacing, and motion.
6. Integrate user-provided icons once available.

## Planned Pause Point

Pause when:

- the section structure is defined
- icon slots are known
- the implementation is ready for real stack/package-manager icons

At that point, wait for the user to provide the TSX icon files before finishing the final visual pass.
