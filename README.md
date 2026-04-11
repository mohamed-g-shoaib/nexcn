![Forge banner](./marketing-site/public/marketing-image.jpg)

# Forge

Forge is a CLI that scaffolds clean React starters you can edit immediately.

It uses shadcn for the scaffold, then applies Forge setup for app shell wiring, theme support, optional RTL routing, sound hooks, fallback pages, metadata, code-quality tooling, and starter docs.

Website: [use-forge.vercel.app](https://use-forge.vercel.app/)

> [!WARNING]
> Do not use `npm i create-use-forge` to start a new app.
> It only installs the package and does not run the initializer.
> Use the **Create an app** commands below.

## Create an app

Use one of these commands to start a new project:

```bash
npm create use-forge@latest
pnpm create use-forge
bun create use-forge
yarn create use-forge
```

## Naming rules

Project names must use lowercase letters, numbers, and single hyphens.

Valid examples:

```txt
my-app
forge-demo
app2
```

Invalid examples:

```txt
MyApp
my_app
my--app
my app
con
```

The special name `.` is valid when you generate into the current empty folder.

## What Forge generates

Forge starters stay intentionally minimal.

Each generated app includes:

- a minimal starter page
- a theme switch
- a language switch only when RTL is enabled
- framework-native error and not-found pages
- favicon and core metadata
- sound hooks for clicks and theme switching
- lint and format setup based on your chosen option
- a README that matches your package manager

Generated apps do not include Forge internal specs, skills, or planning docs.

## Choose your setup

Frameworks:

- `next` (Next.js)
- `vite` (Vite)
- `start` (TanStack Start)

UI base:

- `base` (Base UI)
- `radix` (Radix UI)

Direction:

- `--ltr` for English only
- `--rtl` for English and Arabic with locale routes

Package manager:

- `pnpm`
- `npm`
- `yarn`
- `bun`

Code quality:

- `biome`
- `eslint-prettier`
- `oxlint-oxfmt`

Current default preset:

```txt
next + base + ltr + pnpm + biome
```

## Common Forge commands

After app creation, these are the commands most users need:

```bash
forge generate
```

Preview plan only:

```bash
forge plan
```

Generate from flags:

```bash
forge generate --name my-app --framework next --base base --ltr --package-manager pnpm --code-quality biome
```

Generate in current empty folder:

```bash
forge generate --name .
```

Generate a retained fixture in `fixtures/`:

```bash
forge generate --fixture --name next-base-ltr --framework next --base base --ltr
```

## Advanced command paths

If you installed the package and want to run it manually, use one of these:

```bash
npx create-use-forge generate
npm exec create-use-forge -- generate
```

If `forge` is already available in your environment, this also works:

```bash
forge generate
```

## Current status

Forge is in its first public release pass.

The npm package name is `create-use-forge`, and it exposes:

- `forge`
- `create-use-forge`

The marketing site is deployed from `marketing-site/` on Vercel. npm publish is the remaining public release step.

## Maintainers

This section is for contributors and release maintainers.

### How Forge is built

Forge is a single-package TypeScript CLI with three layers:

1. Scaffold adapter
2. Framework overlay
3. Feature packs

In short, scaffold tools create the base app, overlays apply framework shell details, and feature packs add cross-cutting pieces like docs, sounds, metadata, dependency freshness, and code quality.

### Repository map

```txt
src/                  CLI, generator, overlays, feature packs, verification
assets/branding/      Forge assets copied into generated apps
fixtures/             generated regression fixtures
marketing-site/       Next.js marketing site
spec/                 project contracts and working memory
deprecated/           legacy code outside active surface
```

### Development

Install dependencies:

```bash
pnpm install
```

Run CLI from source:

```bash
pnpm dev -- --help
pnpm dev -- plan
pnpm dev -- generate --dry-run
```

Build:

```bash
pnpm build
```

Typecheck:

```bash
pnpm typecheck
```

Test:

```bash
pnpm test
```

Inspect package contents:

```bash
npm pack --dry-run
```

### Marketing site

Local checks:

```bash
pnpm --dir marketing-site typecheck
pnpm --dir marketing-site lint
pnpm --dir marketing-site build
```

Vercel settings:

```txt
Root Directory: marketing-site
Framework Preset: Next.js
Install Command: default
Build Command: default
Output Directory: default
```

### Release

Release checklist: [spec/release-and-publishing.md](./spec/release-and-publishing.md)

Before npm publish:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
npm pack --dry-run
```

For local tarball smoke tests, use `npm exec --package <tarball>` instead of `npm create <tarball>`.

## License

MIT. See [LICENSE](./LICENSE).
