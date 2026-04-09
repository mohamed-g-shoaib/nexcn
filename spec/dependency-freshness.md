# Forge Dependency Freshness Spec

Last updated: 2026-04-09

## Purpose

This file defines how Forge should handle dependency freshness for generated apps.

## Problem

Upstream scaffold tools and presets can lag behind current stable releases.

Forge should not silently treat scaffold output as the final dependency policy.

## Rules

### 1. Distinguish scaffold output from Forge output

- upstream scaffold versions are an input
- Forge version policy is a product decision
- if upstream scaffolds pin stale framework versions, Forge should decide whether to accept, patch, or deliberately defer them

### 2. Prefer current stable majors for primary frameworks

For user-facing frameworks, Forge should prefer the latest stable major supported by official docs unless a documented compatibility reason blocks it.

Current examples to track:

- Next.js
- Vite
- TanStack Start

### 3. Do not confuse semver ranges with stale installs

- if a dependency uses a caret range, the installed version may already resolve to the latest compatible patch
- exact pins deserve stricter review than ranged dependencies

### 4. Record intentional lag explicitly

If Forge ships a version behind the current stable line, document:

- what is behind
- why it is behind
- what is blocking the update

### 5. TypeScript deprecations should be fixed, not silenced by default

- remove deprecated config when a forward-safe fix exists
- do not add `ignoreDeprecations` as the default answer when the config can be corrected cleanly

### 6. Freshness must include compatibility follow-through

- upgrading to current latest versions is not complete until the generated app still passes lint, format, typecheck, and build
- if a latest-version upgrade exposes framework-specific breakage, Forge should patch the generated app shape rather than silently pinning older versions without a documented reason
- current known examples include:
  - TypeScript 6 CSS side-effect import declarations
  - Vite 8 config compatibility updates
  - TanStack Start scaffold tsconfig normalization

## Immediate Policy

- remove deprecated `baseUrl` from generated tsconfig files while preserving alias paths
- normalize direct dependency and devDependency versions against current npm `latest` dist-tags before the final generated-app install
- audit exact framework pins in scaffolded outputs

## Next Step

Use this policy to review:

1. Next.js version pinning
2. Vite version pinning
3. other exact-pinned framework-critical dependencies that come from scaffold output
