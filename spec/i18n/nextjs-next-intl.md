# Next.js i18n Migration Spec

Last updated: 2026-04-29

## Purpose

This spec defines the production target for Forge-generated `next + rtl` starters after migrating from the current provider-owned translation model to `next-intl`.

It is intentionally specific to the Next.js generator path.

Vite and TanStack Start must be specified separately.

## Why This Change Is Required

The current bilingual Next.js implementation does not scale well because translation copy and locale behavior are centered in `providers.ts` and `hooks/use-locale.tsx`.

That approach creates several long-term problems:

- translations live in runtime client state instead of structured message files
- locale-aware routing and locale-aware messaging are coupled too tightly
- server and client translation concerns are mixed together
- root fallback surfaces depend on custom headers and ad hoc locale plumbing
- localized navigation is implemented manually instead of using framework-native helpers
- adding more translated surfaces would grow provider complexity instead of preserving clear boundaries

Forge should move to the standard App Router i18n shape:

- route-prefixed locales
- request-scoped message loading
- locale-aware navigation wrappers
- `app/[locale]` provider boundary
- JSON message files

## Source of Truth

This spec is grounded in:

- [spec/NEXT_INTL_IMPLEMENTATION_HANDOFF.md](/D:/Developer/forge/spec/NEXT_INTL_IMPLEMENTATION_HANDOFF.md)
- local skill: `.agents/skills/next-intl-app-router/SKILL.md`
- Next.js App Router conventions already used elsewhere in Forge

If this spec conflicts with the old provider-owned bilingual implementation, this spec wins.

## Scope

This spec applies only to generated Next.js starters where `rtl === true`.

It covers:

- overlay file generation for `next + rtl`
- runtime locale routing
- message storage
- translation APIs
- localized navigation
- error and not-found behavior
- cleanup of the old locale provider implementation
- verification requirements

It does not change the `next + ltr` path beyond keeping the non-RTL path clean and single-language.

## Non-Goals

- adding more locales than `en` and `ar`
- introducing CMS-backed translation loading
- localizing the global root layout through custom request-header hacks
- preserving compatibility with the current `use-locale` API
- solving Vite or TanStack Start i18n in this document

## Current Problem Areas

The current generated Next RTL path is centered around custom files and behaviors such as:

- `components/app-providers.tsx`
- `hooks/use-locale.tsx`
- `lib/i18n.ts`
- `proxy.ts` custom locale header injection
- inline `MESSAGES` objects in generated components and fallbacks

The current model uses:

- `usePathname` and `useRouter` directly from `next/navigation`
- a custom `x-forge-locale` request header
- root `app/layout.tsx` reading locale state from `headers()`
- localized copy embedded in component source files

This is the exact surface that must be replaced for the Next RTL path.

## Target Architecture

Generated Next RTL starters must follow this file shape:

```txt
app/
  layout.tsx
  not-found.tsx
  global-error.tsx
  [locale]/
    layout.tsx
    page.tsx
    not-found.tsx
    error.tsx
components/
  app-providers.tsx
  fallback-actions.tsx
  fallback-screen.tsx
  starter-shell.tsx
  language-toggle.tsx
  theme-provider.tsx
  theme-toggle.tsx
i18n/
  navigation.ts
  request.ts
  routing.ts
lib/
  i18n.ts
messages/
  en.json
  ar.json
proxy.ts
next.config.mjs
```

Rules:

- `app/layout.tsx` stays generic and must not use `NextIntlClientProvider`
- `app/[locale]/layout.tsx` owns locale validation, request locale setup, and provider scoping
- messages must live in JSON files, one file per locale
- localized navigation must come from `i18n/navigation.ts`
- locale must come from the route, not a custom request header

## Locale Model

Next RTL starters must use:

- locales: `en`, `ar`
- default locale: `en`
- URL shape: `/en/...`, `/ar/...`
- `/` as an entry path only, redirecting to the preferred locale

Locale truth rules:

- the route locale is the primary source of truth
- persisted preferences may assist redirects, but they must not replace route truth
- generated app code must not create a second competing locale state model

## Required Libraries

The generated Next RTL path must use:

- `next-intl`

It must not depend on a custom translation context for bilingual behavior.

## Routing Contract

Generated Next RTL apps must include:

- `i18n/routing.ts` using `defineRouting`
- `i18n/request.ts` using `getRequestConfig`
- `i18n/navigation.ts` using `createNavigation`
- `proxy.ts` using `next-intl/middleware`

The generated `proxy.ts` must:

- apply locale-prefixed routing
- exclude Next internals and file assets with the standard matcher
- replace the current custom header-based locale transport

The generator must stop emitting custom locale header logic for the Next RTL path.

## Root Layout Contract

`app/layout.tsx` must:

- remain provider-free from an i18n perspective
- keep global CSS, fonts, and non-locale global setup
- keep `ThemeProvider` if needed
- render stable fallback HTML defaults such as `lang="en"` and `dir="ltr"`
- avoid `headers()`-based locale derivation
- avoid `NextIntlClientProvider`

The root layout must not depend on:

- `x-forge-locale`
- `use-locale`
- message dictionaries

## Locale Layout Contract

`app/[locale]/layout.tsx` must:

- validate `params.locale` with `hasLocale`
- call `notFound()` immediately for invalid locales
- call `setRequestLocale(locale)`
- load messages with `getMessages()`
- wrap children with `NextIntlClientProvider`
- provide a server-rendered `lang` and `dir` wrapper around localized content
- place locale-aware providers inside the locale boundary

This is the only place where `NextIntlClientProvider` belongs.

## App Providers Contract

`components/app-providers.tsx` must be reduced to shared runtime providers only.

It may own:

- theme-adjacent shared app wiring
- tooltip provider
- Base UI or Radix direction provider
- document `lang` and `dir` sync derived from the active locale

It must not own:

- translation dictionaries
- locale messages
- primary locale truth
- locale routing
- custom `switchLocale` routing helpers backed by `next/navigation`

If locale is needed inside `AppProviders`, it must be read from `next-intl` APIs or a tiny locale helper derived from route truth.

## Translation Storage Contract

Generated Next RTL apps must create:

- `messages/en.json`
- `messages/ar.json`

Rules:

- component copy must move out of inline `MESSAGES` objects
- namespaces should align with generated surfaces such as `StarterShell`, `ThemeToggle`, `LanguageToggle`, and `Fallback`
- shared fallback copy must come from messages, not embedded conditionals

The generator must stop embedding bilingual content directly in:

- `hooks/use-locale.tsx`
- `components/starter-shell.tsx`
- `components/language-toggle.tsx`
- `app/error.tsx`
- `app/not-found.tsx`

## Translation API Contract

Generated code must use the proper split:

- client components: `useTranslations`
- server components: `getTranslations`

Rules:

- do not use local message objects in components
- do not expose translation copy through a custom React context
- do not mix server and client translation APIs incorrectly

## Navigation Contract

Localized app navigation must import from `@/i18n/navigation`, not directly from `next/link` or `next/navigation`, except for framework-only APIs like `notFound`.

For locale switching:

- use `useLocale` from `next-intl`
- use `usePathname` and `useRouter` from `@/i18n/navigation`
- switch locale by replacing the current pathname with `{ locale: nextLocale }`

The generator must stop producing manual locale href helpers for the Next RTL path unless a tiny shared helper is still needed for direction or alternate locale lookup.

## Fallback and Error Contract

The generated Next RTL path must localize these surfaces correctly:

- `app/not-found.tsx`
- `app/global-error.tsx`
- `app/[locale]/not-found.tsx`
- `app/[locale]/error.tsx`

Rules:

- locale-prefixed missing routes should render through `app/[locale]/not-found.tsx`
- root fallback surfaces must remain defensive because they may render outside the locale provider
- shared fallback action components must not depend on next-intl navigation context
- `window.location.assign(homeHref)` remains acceptable for provider-agnostic home navigation
- Arabic fallback rendering must receive explicit `locale` and `direction` props where needed so it does not render as LTR in fallback paths

## File Cleanup Requirements

This migration must leave no dead files, dead imports, dead helpers, or compatibility shims behind in the generated Next RTL path.

Mandatory removals:

- remove `hooks/use-locale.tsx`
- remove any `LocaleProvider` implementation
- remove old inline `MESSAGES` objects once messages are moved to `messages/*.json`
- remove `x-forge-locale` header logic
- remove `headers()`-based locale detection from `app/layout.tsx`
- remove direct localized navigation imports from `next/navigation` and `next/link` where the app should use `i18n/navigation.ts`
- remove obsolete helpers in `lib/i18n.ts` that only exist to patch over the old routing model

Cleanup rules:

- if a file becomes a thin compatibility wrapper, delete it instead of preserving it
- if an import is no longer needed after the migration, remove it in the same pass
- if a helper exists only because translation state was provider-owned, remove it
- generated output should not contain both the old and new systems at once

## Expected File Responsibilities

`i18n/routing.ts`

- supported locales
- default locale
- route configuration

`i18n/request.ts`

- request locale validation fallback
- message loading from JSON files

`i18n/navigation.ts`

- locale-aware `Link`
- locale-aware `useRouter`
- locale-aware `usePathname`

`lib/i18n.ts`

- small locale helpers only if still useful
- direction lookup
- alternate locale lookup

`components/app-providers.tsx`

- direction provider
- tooltip provider
- document root sync

`messages/*.json`

- generated starter copy
- generated fallback copy
- toggle labels

## Generator Implementation Requirements

The Next overlay generator must be updated so that the `next + rtl` path writes the new file set directly instead of generating the old provider-owned system and then patching around it.

Implementation direction:

1. replace emitted locale-routing files with `next-intl` file templates
2. replace generated locale hooks with JSON messages and `next-intl` consumers
3. update provider templates to consume locale from `next-intl`
4. update starter shell, language toggle, and fallback surfaces
5. remove obsolete files from the emitted overlay
6. keep the non-RTL Next path single-language and free of unnecessary i18n runtime code

The generator should not carry transitional files in emitted output just because the migration happened in the generator source.

## Suggested File-Generation Delta

Files to add for `next + rtl`:

- `i18n/routing.ts`
- `i18n/request.ts`
- `i18n/navigation.ts`
- `messages/en.json`
- `messages/ar.json`
- `app/[locale]/not-found.tsx`

Files to rewrite substantially:

- `app/layout.tsx`
- `app/[locale]/layout.tsx`
- `app/[locale]/page.tsx`
- `app/not-found.tsx`
- `app/error.tsx`
- `app/global-error.tsx`
- `components/app-providers.tsx`
- `components/starter-shell.tsx`
- `components/language-toggle.tsx`
- `components/fallback-screen.tsx`
- `components/fallback-actions.tsx`
- `lib/i18n.ts`
- `proxy.ts`
- `next.config.mjs`

Files to stop generating for `next + rtl`:

- `hooks/use-locale.tsx`

## Verification Requirements

The generated Next RTL starter is not production-ready until all of these pass:

- `typecheck`
- `lint`
- `format:check`
- `build`

Runtime smoke checks must confirm:

- `/` redirects into a locale route
- `/en` renders English copy
- `/ar` renders Arabic copy
- `document.documentElement.lang` updates correctly
- `document.documentElement.dir` updates correctly
- locale switching preserves the current pathname
- localized links keep the active locale
- `/en/missing` and `/ar/missing` render localized not-found content
- fallback actions work even when rendered outside the locale provider

## Review Checklist

- `app/layout.tsx` does not import or render `NextIntlClientProvider`
- `app/layout.tsx` does not read locale from `headers()`
- `app/[locale]/layout.tsx` validates locale and calls `setRequestLocale`
- generated translations live under `messages/`
- no generated component depends on `use-locale`
- no generated file depends on `x-forge-locale`
- localized client navigation uses `@/i18n/navigation`
- root fallback surfaces stay provider-agnostic where necessary
- generated output contains no dead imports or dead files from the previous approach

## Delivery Order

This spec should be implemented before writing the Vite or TanStack Start i18n specs into code.

After implementation:

1. regenerate the retained Next RTL fixtures
2. verify the generated Next RTL fixtures
3. only then move to the Vite-specific i18n spec

