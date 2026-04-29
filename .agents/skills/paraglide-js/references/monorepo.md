# Monorepo

## Recommended Pattern: Each Package Compiles

Paraglide's official monorepo recommendation is "each package compiles."

Use one shared source of truth:

- repo-level `project.inlang/`
- repo-level message files such as `messages/{locale}.json`

Then compile into each consuming package:

```text
project.inlang/
messages/
packages/
  web/
    src/paraglide/
  admin/
    src/paraglide/
```

Example package script:

```bash
npx @inlang/paraglide-js compile --project ../../project.inlang --outdir ./src/paraglide
```

Use this pattern by default because each package can choose its own:

- strategy order
- output location
- bundler integration
- runtime entrypoints

This is the best fit when one package is a TanStack Start web app and another package has different locale requirements.

## Shared I18n Package Pattern

An alternative is a dedicated i18n package that compiles once and exports `messages` and `runtime` for other packages.

Only choose this when all consumers can share the same locale detection and generated runtime behavior.

Avoid it when:

- web and mobile need different strategies
- one app uses URL routing and another does not
- package-specific output or plugin wiring matters

## Vite In A Monorepo

In Vite app packages, point the plugin at the shared project path:

```ts
paraglideVitePlugin({
  project: "../../project.inlang",
  outdir: "./src/paraglide",
});
```

Keep the generated output inside the consuming package so imports stay local and package boundaries remain clear.

## Reusable Pattern From A Real TanStack Start Monorepo

The `muse-gea` setup is a strong example of the recommended pattern:

- shared `project.inlang/settings.json` at the repo root
- shared `messages/` directory at the repo root
- package-local output in `packages/web/src/paraglide`
- package-local compile command pointing back to `../../project.inlang`
- a custom search-param strategy layered ahead of `cookie`, `preferredLanguage`, and `baseLocale`

What is reusable:

- centralize message definitions once
- compile where the app consumes Paraglide
- keep custom strategies app-local unless they are truly shared

What is repo-specific:

- Bun and Turborepo command names
- exact output paths
- the `custom-searchParams` strategy choice

Reuse the pattern, not the literal file layout.

