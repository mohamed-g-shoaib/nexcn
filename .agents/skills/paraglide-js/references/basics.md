# Basics

## Default Setup

For most Vite-based apps:

```bash
npx @inlang/paraglide-js@latest init
```

Then add the Vite plugin:

```ts
import { paraglideVitePlugin } from "@inlang/paraglide-js";

paraglideVitePlugin({
  project: "./project.inlang",
  outdir: "./src/paraglide",
});
```

This keeps `project.inlang` as the source of truth and generates typed runtime files in `outdir`.

## Generated Files

Expect the output directory to contain generated runtime helpers and message accessors. Treat these files as generated artifacts:

- import from them
- configure them via plugin/CLI options
- do not hand-edit them

If codegen output looks stale, re-run compilation instead of patching generated files.

## Messages

Import generated messages from the compiled output:

```ts
import { m } from "./paraglide/messages";

m.hello_world();
m.greeting({ name: "Ada" });
```

Use source message files (commonly `messages/{locale}.json`) to add or change translations, then recompile.

## Locale Runtime

Use runtime helpers from the generated output:

```ts
import { getLocale, setLocale } from "./paraglide/runtime";

getLocale();
setLocale("de");
```

`setLocale()` reloads the page by default. Keep that behavior unless the host framework already handles rerendering correctly after locale changes.

## When To Recompile

Recompile after any of these changes:

- `messages/*.json`
- locale list or base locale
- strategy configuration
- output directory or plugin settings
- custom strategy registration that must exist in generated runtime consumers

## CLI Compile

Use explicit compile commands when:

- the app is not Vite-based
- you need a package-level script in a monorepo
- you want prebuild generation before import-time usage

Example:

```bash
npx @inlang/paraglide-js compile --project ./project.inlang --outdir ./src/paraglide
```

