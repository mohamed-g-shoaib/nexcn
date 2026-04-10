# Forge release and publishing

Last updated: 2026-04-10

## Purpose

This file defines the release path for Forge after the generator and marketing site are ready to ship.

Forge has two separate public surfaces:

- the marketing site, deployed from `marketing-site/` to Vercel
- the CLI initializer package, published from the repository root to npm as `create-forge`

Do not treat Vercel deployment as npm release readiness. The website can be deployed before the CLI package is published, but the public install commands should only be promoted once npm verification passes.

## Release surfaces

### Marketing site

Source directory:

- `marketing-site/`

Production domain:

- `https://forgedx.vercel.app`

Vercel project settings:

- Root Directory: `marketing-site`
- Framework Preset: `Next.js`
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Output Directory: leave as Vercel default for Next.js

The repo root is the CLI package. Deploying the repository root as the Vercel app would point Vercel at the wrong package.

The marketing app has its own `package.json` and `pnpm-lock.yaml`, so Vercel should use the `marketing-site/` package boundary.

No required runtime environment variables are currently expected for the marketing site.

### npm package

Package source directory:

- repository root

Published package name:

- `create-forge`

Executable names:

- `forge`
- `create-forge`

Expected public initializer commands:

```bash
npm create forge@latest
pnpm create forge
bun create forge
yarn create forge
```

The package-manager initializer model resolves `npm create forge` to the package named `create-forge`. Users should not be asked to type `npm create create-forge`.

## Current npm readiness

Observed on 2026-04-10:

- `npm view create-forge name version --json` returned `E404`
- npm reported the package as unpublished on 2024-06-11
- local `npm whoami` returned `E401`, so the local machine is not logged in to npm

The name appears unoccupied in the registry lookup, but the first real publish attempt is the final test because npm keeps some unpublished package history.

Do not publish version `0.0.0`.

## Required root package.json changes

Before publishing, finalize the root `package.json`.

Required changes:

- set `"private": false`
- set the first public version, likely `"0.1.0"`
- add a license field after the license decision is made
- add repository metadata
- add homepage metadata pointing to the marketing site
- add bugs metadata
- add useful npm keywords
- keep the `bin` map for both `forge` and `create-forge`
- add a `files` allowlist so npm does not publish internal project material

Current required `bin` shape:

```json
{
  "bin": {
    "forge": "./dist/index.js",
    "create-forge": "./dist/index.js"
  }
}
```

Suggested npm `files` shape:

```json
{
  "files": ["dist", "README.md", "LICENSE", "assets/branding/favicon.ico"]
}
```

Only keep `assets/branding/favicon.ico` in `files` if the built CLI needs it at runtime when generating apps.

Do not publish:

- `spec/`
- `.agents/`
- `fixtures/`
- `deprecated/`
- `marketing-site/`
- `node_modules/`
- local build caches

## LICENSE file

Add a root `LICENSE` file before publishing.

Default recommendation:

- MIT, if Forge is intended to be a permissive open-source CLI

If the package should restrict commercial reuse, template copying, or redistribution, choose a different license before publishing. Do not leave the npm package unlicensed by accident.

The `package.json` license field and `LICENSE` file must agree.

## Pre-publish checklist

Run from the repository root:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm build
```

Inspect the npm package contents:

```bash
npm pack --dry-run
```

The dry run should show the package contents clearly. If internal files appear, fix the `files` allowlist or `.npmignore` before publishing.

Create a local tarball:

```bash
npm pack
```

Test the tarball from a temporary directory outside the Forge repo:

```bash
npm exec --package D:\Developer\nexcn\create-forge-0.1.0.tgz -- forge --help
```

Also verify direct executable behavior:

```bash
npm exec --package D:\Developer\nexcn\create-forge-0.1.0.tgz -- create-forge --help
```

If these local tarball checks fail, do not publish.

`npm create` should be used for the published registry initializer, not for a local tarball path. Local tarball testing should use `npm exec` or `npx`.

## npm account setup

Before publishing:

```bash
npm login
npm whoami
```

The publish account should have 2FA configured according to npm account policy. If publishing from CI later, prefer npm trusted publishing or a narrowly scoped automation token.

## Publish command

For the current unscoped package:

```bash
npm publish
```

If Forge moves to a scoped package later, such as `@forgedx/create-forge`, public publishing needs:

```bash
npm publish --access public
```

## Post-publish verification

After npm publish, test the public registry entry from a clean location outside the repo:

```bash
npm create forge@latest
pnpm create forge
bun create forge
yarn create forge
```

Also verify:

```bash
npm view create-forge name version bin
```

The published package must expose both executable names.

## Marketing site post-deploy checks

After Vercel deployment, verify:

- home page loads at `https://forgedx.vercel.app`
- install helper command output matches the published npm package
- `/robots.txt` loads
- `/sitemap.xml` loads
- `/manifest.webmanifest` or the generated manifest route loads as expected
- `/llms.txt` loads
- `/llms-full.txt` loads
- Open Graph image route renders
- 404 page uses the intended fallback screen
- error pages build without TypeScript or lint failures

If npm has not been published yet, the marketing site can still deploy, but install copy should avoid implying the command is live.

## Release order

Recommended order:

1. Verify the generator locally.
2. Finalize root `package.json`.
3. Add the root `LICENSE`.
4. Run root typecheck, tests, and build.
5. Run `npm pack --dry-run`.
6. Test the local package tarball outside the repo.
7. Deploy `marketing-site/` on Vercel.
8. Publish `create-forge` to npm.
9. Verify all public initializer commands.
10. Update the marketing site if the final command or package name changes.
11. Tag the release in git after npm and Vercel are both verified.

## Documentation updates

After the first successful npm publish, update:

- root `README.md`
- `marketing-site` install helper copy if needed
- `spec/context.md`
- any release notes or changelog added later

The public docs should show only verified commands.
