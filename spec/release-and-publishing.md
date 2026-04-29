# Forge release and publishing

Last updated: 2026-04-30

## Purpose

This file defines the release path for Forge after the generator and marketing site are ready to ship.

Forge has two separate public surfaces:

- the marketing site, deployed from `marketing-site/` to Vercel
- the CLI initializer package, published from the repository root to npm as `create-use-forge`

Do not treat Vercel deployment as npm release readiness. The website can be deployed before the CLI package is published, but the public install commands should only be promoted once npm verification passes.

## Release surfaces

### Marketing site

Source directory:

- `marketing-site/`

Production domain:

- `https://use-forge.vercel.app/`

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

- `create-use-forge`

Executable names:

- `forge`
- `create-use-forge`

Expected public initializer commands:

```bash
npm create use-forge@latest
pnpm create use-forge
bun create use-forge
yarn create use-forge
```

The package-manager initializer model resolves `npm create use-forge` to the package named `create-use-forge`. Users should not be asked to type `npm create create-use-forge`.

## Current npm readiness

Current local release state on 2026-04-30:

- package name is `create-use-forge`
- package version is `0.1.3`
- root package metadata is already finalized for publish
- `npm pack --dry-run` is clean
- local tarball smoke checks for both executable names pass when run against a clean npm cache

Historical note:

- `npm publish` for `create-forge@0.1.0` failed with `E403`
- npm blocked `create-forge` because it was too similar to the existing `createforge` package
- Forge switched the npm package name to `create-use-forge`

## Current root package.json state

The root `package.json` already has the required publish metadata:

- `"private": false`
- version set to `0.1.3`
- MIT license
- repository, homepage, and bugs metadata
- keywords for framework and starter discovery
- both `forge` and `create-use-forge` in `bin`
- a `files` allowlist that keeps publish contents narrow

Current required `bin` shape:

```json
{
  "bin": {
    "forge": "./dist/index.js",
    "create-use-forge": "./dist/index.js"
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

The root `LICENSE` file is already present and matches the `package.json` license field (`MIT`).

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
npm exec --cache D:\Developer\forge\tmp\release-smoke-cache --package D:\Developer\forge\create-use-forge-0.1.3.tgz -- forge --help
```

Also verify direct executable behavior:

```bash
npm exec --cache D:\Developer\forge\tmp\release-smoke-cache --package D:\Developer\forge\create-use-forge-0.1.3.tgz -- create-use-forge --help
```

If these local tarball checks fail, do not publish.

`npm create` should be used for the published registry initializer, not for a local tarball path. Local tarball testing should use `npm exec` or `npx`.

If npm's default `_npx` cache is in a bad state locally, use a clean `--cache` directory for the smoke check instead of treating that as a package failure.

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

If Forge moves to a scoped package later, public publishing needs:

```bash
npm publish --access public
```

## Post-publish verification

After npm publish, test the public registry entry from a clean location outside the repo:

```bash
npm create use-forge@latest
pnpm create use-forge
bun create use-forge
yarn create use-forge
```

Also verify:

```bash
npm view create-use-forge name version bin
```

The published package must expose both executable names.

## Marketing site post-deploy checks

After Vercel deployment, verify:

- home page loads at `https://use-forge.vercel.app/`
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
2. Run root typecheck, tests, and build.
3. Run `npm pack --dry-run`.
4. Test the local package tarball outside the repo.
5. Deploy `marketing-site/` on Vercel if needed.
6. Publish `create-use-forge` to npm.
7. Verify all public initializer commands.
8. Update the marketing site if the final command or package name changes.
9. Tag the release in git after npm and Vercel are both verified.

## Documentation updates

After the next successful npm publish, update:

- root `README.md`
- `marketing-site` install helper copy if needed
- `spec/context.md`
- any release notes or changelog added later

The public docs should show only verified commands.
