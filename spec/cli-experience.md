# Forge CLI Experience

Last updated: 2026-04-11

## Purpose

This file defines the intended user experience for Forge as a command-line scaffolding tool.

It covers:

- package naming and publishing expectations
- direct CLI usage
- interactive prompt behavior
- flag behavior
- validation rules in the terminal
- banner and presentation rules

## Product Shape

Forge should be usable in two closely related ways:

- as a local/direct CLI command: `forge`
- as a package-manager initializer: `create-use-forge`

This means the product should support the familiar initializer flows:

- `npm create use-forge@latest`
- `pnpm create use-forge`
- `bun create use-forge`
- `yarn create use-forge`

The published initializer package name should be:

- `create-use-forge`

The direct executable name should remain:

- `forge`

## Why `create-use-forge`

Package managers already train users to expect scaffolding tools through `create-*` initializers.

The Forge CLI should align with that expectation instead of inventing a custom invocation model.

Expected resolution model:

- `npm create use-forge` -> runs `create-use-forge`
- `pnpm create use-forge` -> runs `create-use-forge`
- `bun create use-forge` -> runs `create-use-forge`
- `yarn create use-forge` -> runs `create-use-forge`

Forge should not expect users to type:

- `npm create create-use-forge`

## CLI Modes

Forge should support two CLI modes:

### 1. Interactive mode

This is the preferred default for humans.

Invocation examples:

- `forge generate`
- `npm create use-forge@latest`
- `pnpm create use-forge`
- `bun create use-forge`
- `yarn create use-forge`

If required inputs are missing, Forge should open an interactive prompt flow in the terminal.

### 2. Flag-driven mode

This is for automation, power users, documentation, and reproducibility.

Invocation examples:

- `forge generate --name my-app --framework next --base base --rtl`
- `forge generate --name my-app --framework vite --base radix --ltr --package-manager npm`

If all required inputs are supplied by flags, Forge should skip prompts and generate immediately.

## Prompt Strategy

Forge should use a prompt library suited for modern interactive CLIs rather than hand-rolled terminal prompting.

Preferred direction:

- use a lightweight prompt library such as `@clack/prompts`

Prompt flow should:

- feel fast
- work cleanly in PowerShell, macOS Terminal, and Linux shells
- allow cancellation without leaving confusing partial state
- validate input at the point of entry

## Required Banner

The interactive CLI should show this exact ASCII banner near the start of the session:

```txt
███████╗ ██████╗ ██████╗  ██████╗ ███████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
█████╗  ██║   ██║██████╔╝██║  ███╗█████╗
██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝
██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
```

Presentation rules:

- keep the banner plain text
- do not add gradients, emoji, or decorative framing characters
- keep one empty line after the banner before prompts begin

## Required Prompt Flow

The first-pass interactive flow should collect:

1. app name
2. framework
3. primitive base
4. direction mode
5. package manager
6. code-quality setup

Recommended order:

1. app name
2. framework
3. primitive base
4. direction mode
5. package manager
6. code-quality setup
7. final confirmation

### Prompt types

- app name:
  - text input with live validation feedback
- framework:
  - single select
- primitive base:
  - single select
- direction mode:
  - single select
- package manager:
  - single select
- code-quality setup:
  - single select
- final confirmation:
  - confirm prompt

Forge does not need multi-select package toggles in v1 because the generation contract is currently based on one value from each supported category, not an arbitrary feature checklist.

## Prompt Copy Rules

Prompt copy should be:

- plain
- direct
- short
- non-marketing

Good:

- `What should the project be called?`
- `Which framework do you want to use?`
- `Which package manager should Forge use?`

Avoid:

- jokes
- hype language
- congratulatory filler after every answer
- noisy terminal chatter

## Generation Output

Forge should own the generation transcript instead of streaming every nested tool by default.

Default output should include:

- target directory
- one concise line per major step
- a short success message
- next commands to run

When stdout is an interactive terminal, long-running steps should use a small `@clack/prompts` spinner and resolve into a completed step line.
When stdout is not interactive, Forge should print plain deterministic step lines instead.
Forge must respect `NO_COLOR`.
Active steps should show elapsed time so the user can tell Forge is still working.
Completed steps should show their duration.
Known heavy steps may show broad expectation copy such as `Fresh installs can take a few minutes.`, but Forge should avoid exact percentages or fake ETAs for opaque subprocesses.

Default output should not include successful subprocess logs from:

- package managers
- shadcn scaffold/apply commands
- formatters
- linters
- TypeScript
- framework builds

If a subprocess fails, Forge should show:

- the failed command
- the exit code
- the captured command output, trimmed to the useful tail if it is long

This keeps the happy path calm while preserving enough detail for debugging failures.

## Validation Rules

Interactive validation and schema validation must use the same underlying rules.

The terminal prompt must not accept names that the generator will reject later.

Current project-name rule set:

- lowercase letters allowed
- numbers allowed
- single hyphens allowed
- must start and end with a letter or digit
- no consecutive hyphens
- no spaces
- no underscores
- no dots except the special current-directory case when explicitly supported by the command
- reject Windows reserved device names
- reject trailing periods and trailing spaces

Preferred regex baseline:

```txt
^(?!.*--)[a-z0-9]+(?:-[a-z0-9]+)*$
```

Additional checks:

- reserved names:
  - `con`
  - `prn`
  - `aux`
  - `nul`
  - `com1` to `com9`
  - `lpt1` to `lpt9`
- maximum length should stay conservative for cross-platform safety

Validation feedback should be immediate and specific.

Good feedback:

- `Use lowercase letters, numbers, and single hyphens only.`
- `This name is reserved on Windows.`

Avoid vague feedback:

- `Invalid name`

## Option Behavior

Interactive answers should normalize to the same config shape as flags.

No generation step should care whether a value came from:

- prompt input
- CLI flag
- default fallback

That means:

- flags and prompts must feed the same normalized config object
- the same schema must validate both paths

## Defaults

If Forge presents defaults in interactive mode, they should match the current product happy path:

- framework: `next`
- base: `base`
- direction: `ltr`
- package manager: detect from environment if possible, otherwise `pnpm`
- code quality: current default contract choice
- app name default: `my-app`

Environment-sensitive defaults should remain conservative and predictable.

## Confirmation Step

Before generation begins, Forge should present a compact summary:

- app name
- framework
- base
- direction mode
- package manager
- code quality

Then ask for confirmation.

This step is important because generation performs filesystem writes and installs dependencies.

## Cancellation Behavior

If the user cancels during prompts:

- exit cleanly
- do not print a stack trace
- do not leave partial terminal noise
- do not start filesystem writes

Cancellation should feel intentional, not like a crash.

## Help and Discoverability

`forge --help` should describe both usage styles:

- direct `forge generate`
- initializer-style `npm create use-forge`

Help text should make the distinction clear:

- `forge` is the executable
- `create-use-forge` is the published initializer package

## Expected Initializer Commands

Forge should document only verified initializer entrypoints in public copy.

Expected entrypoints for `create-use-forge`:

- `npm create use-forge@latest`
- `pnpm create use-forge`
- `bun create use-forge`
- `yarn create use-forge`

Resolution basis:

- npm docs map `npm init <initializer>` and alias `npm create` to `create-<initializer>`
- pnpm docs define `pnpm create` for `create-*` starter kits
- Bun CLI help states Bun runs npm templates via `create-<template>`
- Yarn classic docs and local CLI help both define `yarn create <starter-kit-package>` for `create-*` starter kits

- `create-use-forge` is now published on npm and `latest` resolves to the current published package.
- registry-backed entrypoints should still be smoke-tested after each publish because package-manager caches can briefly hide new versions
- local verification for Yarn in this workspace required running outside the Forge repo because the repo `packageManager` field can interfere with Yarn when executed inside the project root
- the currently installed local Yarn was `1.22.22`, so the verified `yarn create` behavior is grounded in Yarn Classic documentation and CLI output

## Implementation Direction

Recommended CLI flow:

1. parse flags
2. determine which required values are still missing
3. if values are missing, open interactive prompts
4. normalize all values into one config object
5. validate once through the shared schema
6. print summary
7. confirm
8. generate

This keeps:

- interactive mode
- scripted mode
- validation
- future docs

aligned under one implementation path.

## Non-Goals

This spec does not require:

- a wizard with nested submenus
- a checkbox-heavy feature marketplace
- hidden advanced modes in the first pass
- decorative terminal animations
- progress spinners for every trivial step

Forge should feel clean and modern, not theatrical.
