# Forge marketing site

This is the Forge marketing website app.

It is a Next.js app in the monorepo and is deployed separately from the CLI package.

## What this app is for

- public landing page for Forge
- install helper and command guidance
- SEO routes and metadata surfaces for discovery

## Where to edit

- `app/page.tsx`: main landing page content and section order
- `app/layout.tsx`: document shell, metadata defaults, and global wrappers
- `components/`: reusable UI sections for the marketing page
- `components/app-providers.tsx`: root provider composition

## Baseline setup

- Next.js App Router
- shadcn preset: `luma` (`b1VlIwYS`)
- single-language LTR shell
- light/dark theme toggle
- shared sound hook surface
- code quality: `Oxlint + Oxfmt`
- custom selection and scrollbar styling

## Common commands

```bash
pnpm run dev
pnpm run build
pnpm run typecheck
pnpm run lint
pnpm run format
```
