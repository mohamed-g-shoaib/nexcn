# Forge Code Quality Tooling

Last updated: 2026-04-08

## Purpose

This file locks how Forge should handle linter and formatter choices in generated apps.

It answers:

- whether code-quality tooling should be configurable
- which choices v1 should support
- how those choices should appear in the product
- what Forge should generate for each choice

## Locked Decision

Forge should expose code-quality tooling as a user choice.

v1 supported choices:

- `biome`
- `eslint-prettier`
- `oxlint-oxfmt`

This is a generator option for generated apps.

It is not a reason to delay the generator core, the first framework overlays, or the fixture strategy.

## Product Positioning

Code-quality tooling is important enough to support, but not important enough to become the centerpiece of v1.

Forge should treat it as:

- a real generation choice
- a secondary configurator choice
- an advanced-but-valid starter preference

It should appear after the core starter decisions:

- framework
- base
- RTL

Do not let this tooling choice overshadow the main product promise:

- clean starter scaffolding
- runtime wiring
- polished minimal UX
- framework correctness

## Supported Choices

### `biome`

Use Biome as an integrated formatter and linter choice.

Generated app expectations:

- install `@biomejs/biome`
- generate a root `biome.json` or `biome.jsonc`
- add scripts for:
  - `lint`
  - `lint:fix`
  - `format`
  - `format:check`
- prefer one-step checking ergonomics where helpful
- do not add ESLint or Prettier when this option is selected unless a framework hard requirement makes that unavoidable

### `eslint-prettier`

Use ESLint for linting and Prettier for formatting.

Generated app expectations:

- install ESLint and required framework/react/typescript packages
- install Prettier
- disable conflicting ESLint formatting rules
- generate:
  - `eslint.config.*`
  - Prettier config
  - optional ignore files when needed
- add scripts for:
  - `lint`
  - `lint:fix`
  - `format`
  - `format:check`

This option should feel like the familiar, conservative choice.

### `oxlint-oxfmt`

Use Oxlint for linting and Oxfmt for formatting.

Generated app expectations:

- install `oxlint`
- install `oxfmt`
- generate:
  - `.oxlintrc.json` or `oxlint.config.ts` when needed
  - `.oxfmtrc.json`
- add scripts for:
  - `lint`
  - `lint:fix`
  - `format`
  - `format:check`
- prefer the official Oxc naming and configuration model

This option should be treated as supported, but Forge should remain conservative about rule intensity and custom complexity in v1.

## Config Contract

Normalized config should include a code-quality field.

Example:

```ts
type CodeQualityTooling = "biome" | "eslint-prettier" | "oxlint-oxfmt";

type ForgeConfig = {
  projectName: string;
  framework: "next" | "vite" | "start";
  base: "base" | "radix";
  rtl: boolean;
  localePair: "en-ar";
  packageManager: "pnpm" | "npm" | "yarn" | "bun";
  presetCode: "b1VlIwYS";
  codeQuality: CodeQualityTooling;
};
```

## UX Contract

Forge should present this option clearly and without jargon overload.

User-facing labels should be:

- `Biome`
- `ESLint + Prettier`
- `Oxlint + Oxfmt`

Guidance should be short and confidence-building:

- `Biome`: all-in-one
- `ESLint + Prettier`: most familiar
- `Oxlint + Oxfmt`: fast Oxc stack

Do not force users to understand migration history, rule-compat details, or ecosystem politics before generating a starter.

## Script Contract

Every generated app should expose a stable script surface regardless of tooling choice.

Required script names:

- `lint`
- `lint:fix`
- `format`
- `format:check`

Framework-specific scripts such as `dev`, `build`, and `typecheck` should remain independent from the chosen code-quality stack.

## README Contract

Generated README content should mention the selected code-quality tooling and show the common commands.
Those commands should match the selected package manager rather than assuming `pnpm`.

The README should not contain long comparisons between tooling options.

It should simply tell the user:

- what this starter uses
- how to lint
- how to format

## Editor Guidance Contract

v1 generated apps may include minimal editor guidance, but should not ship editor-specific clutter by default.

Allowed:

- brief README note
- optional `.vscode/extensions.json` later if clearly worth it

Avoid:

- large editor setup docs
- multiple editor-specific config files unless truly necessary

## Verification Contract

Forge should verify generated code-quality tooling in a lightweight, predictable way.

Minimum expectation per generated app:

- install succeeds
- `lint` command exists
- `format:check` command exists
- generated lint/format config should ignore package-manager artifacts that are not app source, such as Yarn PnP files when they appear
- generated tooling should remain compatible with Yarn starter project boundaries and linker output

For the first implementation slices, build/typecheck verification remains more important than exhaustive lint-style verification.

Tooling verification can deepen after the core framework matrix is stable.

## Implementation Order

1. Lock the tooling-choice spec.
2. Add `codeQuality` to the normalized config contract.
3. Implement one tooling path first in the active framework happy path.
4. Add the remaining tooling paths without breaking the core starter UX contract.
5. Extend fixture coverage so each supported tooling choice is exercised at least once.

## Current Prioritization

This is important, but secondary to the main Forge delivery path.

Forge remains focused on:

- generator-first implementation
- framework overlays
- runtime RTL correctness
- minimal starter quality
- generated fixtures as regression targets

Tooling choice should be implemented in a way that supports those goals, not competes with them.

## Source Notes

This spec was informed by current official docs:

- Biome docs
- ESLint docs
- Prettier docs
- Oxc docs for Oxlint and Oxfmt

Important current observations:

- Biome is a combined toolchain with formatter, linter, and assist in one config model
- ESLint no longer positions core formatting rules as the preferred path
- Prettier remains intentionally opinionated and configuration-light
- Oxlint is mature enough to support as a real choice
- Oxfmt is now documented as an official formatter with its own quickstart, config, and editor setup
