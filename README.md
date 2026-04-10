# Forge

Forge is a CLI for creating small React starters that do not need a cleanup pass before real work begins.

It builds on shadcn's scaffold flow, then applies Forge's own framework overlays and feature packs for runtime shell wiring, theme support, optional RTL routing, sound hooks, metadata, fallback pages, code-quality tooling, and starter docs.

Website: [use-forge.vercel.app](https://use-forge.vercel.app/)

## Status

Forge is in its first public release pass.

The root package is prepared for npm as `create-forge`, with two binaries:

- `forge`
- `create-forge`

The marketing site is deployed from `marketing-site/` on Vercel. npm publishing is the remaining public release step.

## Create an app

After the package is published, use one of the initializer commands:

```bash
npm create forge@latest
pnpm create forge
bun create forge
yarn create forge
```

The package-manager create commands resolve to the npm package named `create-forge`. Users type `npm create forge`, not `npm create create-forge`.

You can also run the CLI directly after installing it:

```bash
forge generate
```

## CLI examples

Interactive generation:

```bash
forge generate
```

Preview the generation plan without writing files:

```bash
forge plan
```

Generate from flags:

```bash
forge generate --name my-app --framework next --base base --ltr --package-manager pnpm --code-quality biome
```

Generate into the current empty directory:

```bash
forge generate --name .
```

Generate a retained fixture under `fixtures/`:

```bash
forge generate --fixture --name next-base-ltr --framework next --base base --ltr
```

## Options

Frameworks:

- `next` for Next.js
- `vite` for Vite
- `start` for TanStack Start

UI primitive bases:

- `base` for Base UI
- `radix` for Radix UI

Direction:

- `--ltr` for a single-language English starter
- `--rtl` for English and Arabic with route-based locale handling

Package managers:

- `pnpm`
- `npm`
- `yarn`
- `bun`

Code quality:

- `biome`
- `eslint-prettier`
- `oxlint-oxfmt`

Current defaults:

```txt
next + base + ltr + pnpm + biome
```

## Project-name rules

Forge validates project names before generation begins. Names must use lowercase letters, numbers, and single hyphens.

Valid:

```txt
my-app
forge-demo
app2
```

Invalid:

```txt
MyApp
my_app
my--app
my app
con
```

The special name `.` is allowed when generating into the current empty directory.

## What Forge generates

Generated apps are intentionally small. The starter page includes:

- a small heading
- one short edit hint
- a theme switch
- a language switch only when RTL mode is enabled

Generated apps also include:

- framework-native error and not-found pages
- minimal metadata and favicon wiring
- centralized `soundcn` click and theme-switch sounds
- selected lint and format tooling
- a README that matches the chosen package manager
- runtime `lang` and `dir` handling where needed

Generated apps do not include Forge's internal specs, local skills, or project planning files.

## Architecture

Forge is a single-package TypeScript CLI.

The generator has three layers:

1. Scaffold adapter
2. Framework overlay
3. Feature packs

The scaffold adapter lets shadcn and framework tooling create the baseline project. Framework overlays handle app-shell and routing details. Feature packs add cross-cutting behavior such as docs, sound, code quality, dependency freshness, package metadata, and starter polish.

## Repository layout

```txt
src/                  CLI, generator, overlays, feature packs, verification
assets/branding/      Forge assets copied into generated apps
fixtures/             generated regression fixtures
marketing-site/       deployed Next.js marketing site
spec/                 project contracts and working memory
deprecated/           legacy code kept out of the active surface
```

## Development

Install dependencies:

```bash
pnpm install
```

Run the CLI from source:

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

Run tests:

```bash
pnpm test
```

Inspect the npm package contents:

```bash
npm pack --dry-run
```

## Marketing site

The marketing site lives in `marketing-site/`.

For local checks:

```bash
pnpm --dir marketing-site typecheck
pnpm --dir marketing-site lint
pnpm --dir marketing-site build
```

Vercel should use:

```txt
Root Directory: marketing-site
Framework Preset: Next.js
Install Command: default
Build Command: default
Output Directory: default
```

## Release

Release notes and the publishing checklist live in [spec/release-and-publishing.md](./spec/release-and-publishing.md).

Before publishing to npm:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
npm pack --dry-run
```

Local tarball smoke tests should use `npm exec --package <tarball>`, not `npm create <tarball>`.

## License

MIT. See [LICENSE](./LICENSE).
