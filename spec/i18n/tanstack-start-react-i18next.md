# TanStack Start i18n Migration Spec

Last updated: 2026-04-30

## Purpose

This spec defines the production target for Forge-generated `start + rtl` starters after migrating from the current provider-owned translation model to `react-i18next`.

It is intentionally specific to the TanStack Start generator path.

Next.js and Vite remain specified separately.

## Why This Change Is Required

The current TanStack Start bilingual path stores translated copy, direction state, and locale switching behavior inside `src/hooks/use-locale.tsx`.

That design does not scale well because:

- route state and translation content are coupled in one client context
- every new translated surface expands a central `MESSAGES` object
- root fallback behavior depends on pathname parsing and inline copy branches
- provider composition is doing translation ownership instead of only runtime wiring
- the current model is too client-shaped for an SSR framework
- server and client can drift if locale and translations are not initialized from the same route-derived truth

Forge should move the TanStack Start RTL path to a `react-i18next` architecture that keeps:

- route-prefixed locale truth in TanStack Router
- SSR-safe translation initialization
- translation resources outside component source
- root document `lang` and `dir` derived from the active route locale
- provider composition focused on theme, direction, and runtime shell concerns

## Source of Truth

This spec is grounded in:

- local skill: `.agents/skills/tanstack-start-best-practices/SKILL.md`
- local skill: `.agents/skills/react-i18next/SKILL.md`
- official TanStack Router i18n guidance that treats the router as library-agnostic and shows TanStack Start i18n as a routing and server-layer concern
- official react-i18next SSR guidance that requires passing initial language and initial translation store to avoid client-side async drift
- the current Forge TanStack Start overlay structure in `src/overlays/start/`

If this spec conflicts with the old provider-owned TanStack Start bilingual implementation, this spec wins.

## Product Decision

Forge intentionally uses `react-i18next` for TanStack Start even though TanStack documentation highlights Paraglide as a recommended example.

That is a Forge product choice, not a claim that Paraglide is invalid.

The reasons are:

- reduce i18n tool diversity across Forge
- keep Vite and TanStack Start on a familiar translation library
- lower learning overhead for generated-app users
- avoid surprising users with a less familiar library when Forge does not offer an i18n-library selector

This spec therefore optimizes for consistency-first product ergonomics while still respecting TanStack Start SSR constraints.

## Scope

This spec applies only to generated TanStack Start starters where `rtl === true`.

It covers:

- overlay file generation for `start + rtl`
- runtime locale routing
- SSR-safe translation initialization
- translation storage
- language switching behavior
- root document `lang` and `dir`
- not-found and error handling
- cleanup of the old locale provider implementation
- verification requirements

It does not change the `start + ltr` path beyond keeping the non-RTL path single-language and free of unnecessary i18n runtime code.

## Non-Goals

- adding locales beyond `en` and `ar`
- introducing remote translation services
- introducing browser language detection as primary locale truth
- preserving compatibility with the current `use-locale` hook API
- introducing Paraglide into Forge
- solving Next.js or Vite i18n in this document

## Current Problem Areas

The current generated TanStack Start RTL path is centered around:

- `src/hooks/use-locale.tsx`
- `src/components/app-providers.tsx`
- `src/lib/i18n.ts`
- `src/routes/__root.tsx`
- `src/routes/$locale/route.tsx`
- inline `MESSAGES` objects and pathname-based locale branching

The current model uses:

- a `LocaleProvider` that owns messages and switching behavior
- `useLocation` and `useNavigate` inside the locale provider
- route parsing and translation content inside the same state model
- inline bilingual copy in fallback surfaces and route errors

This is the surface that must be replaced for the TanStack Start RTL path.

## Target Architecture

Generated TanStack Start RTL starters must follow this file shape:

```txt
src/
  components/
    app-providers.tsx
    fallback-actions.tsx
    fallback-screen.tsx
    language-toggle.tsx
    route-error.tsx
    starter-shell.tsx
    theme-provider.tsx
    theme-toggle.tsx
  i18n/
    config.ts
    resources.ts
    types.ts
  lib/
    i18n.ts
  routes/
    __root.tsx
    index.tsx
    $locale/
      route.tsx
      index.tsx
  styles.css
```

Rules:

- route locale remains the primary source of truth
- translation resources must not live in `use-locale.tsx` or inline component dictionaries
- `react-i18next` setup must live in dedicated `src/i18n/*` files
- root document `lang` and `dir` must be derived from the active route locale
- SSR initialization must not rely on browser-only language detection

## Required Libraries

Generated TanStack Start RTL starters must use:

- `i18next`
- `react-i18next`

The first production pass should not require:

- `i18next-browser-languagedetector`
- `i18next-http-backend`

Reason:

- route locale is the source of truth
- SSR safety is easier when translations are available synchronously in process
- the generated starter should avoid client fetch waterfalls for its own base translation copy

## Locale Model

TanStack Start RTL starters must use:

- locales: `en`, `ar`
- default locale: `en`
- URL shape: `/en/...`, `/ar/...`
- `/` as an entry path only, redirecting to the default locale

Locale truth rules:

- the active route locale is primary
- `i18n.changeLanguage(locale)` must follow route truth, not override it
- persisted preferences may be added later, but they must not replace route truth
- server and client must initialize from the same route locale on first render

## Routing Contract

Generated TanStack Start RTL apps must keep route-based locale handling with TanStack Router file routes.

The generated app must:

- redirect `/` to `/${defaultLocale}`
- validate `/$locale` with a small locale helper
- render the starter page inside `/$locale`
- keep locale-aware not-found handling attached to `/$locale`
- keep root-level not-found and error handling defensive for paths that resolve outside the locale boundary

Important TanStack Start rule:

- if `notFound()` is thrown inside `/$locale`, that route must define `notFoundComponent`

The spec must preserve that route-boundary behavior instead of assuming a root-level not-found screen is enough.

## SSR and Hydration Contract

The generated TanStack Start RTL path must be SSR-safe.

Rules:

- the server render and the client hydration pass must start from the same locale
- the client must not fetch starter translations after paint just to discover the active language
- translations required for the initial route must already be available during the first render
- the generated app must not rely on browser language detection for initial locale selection

The app must initialize `react-i18next` in a way that avoids:

- English HTML hydrating into Arabic UI on the client
- Suspense waterfalls for the starter route
- cross-request translation leakage from one locale render into another

Implementation direction for the later code pass:

- keep translation resources local and synchronously available
- provide `initialLanguage` and the matching initial resource store to the client-side binding
- avoid a server-global mutable locale singleton as the source of rendering truth

## i18n Setup Contract

Generated TanStack Start RTL apps must include dedicated i18n setup files such as:

- `src/i18n/config.ts`
- `src/i18n/resources.ts`
- `src/i18n/types.ts`

These files must collectively provide:

- the translation resource object for `en` and `ar`
- `i18next` initialization
- `initReactI18next`
- `fallbackLng: "en"`
- `interpolation.escapeValue = false`
- TypeScript wiring for typed translation resources if practical in the generated starter

The setup must avoid hidden auto-detection taking precedence over the route locale.

## Translation Storage Contract

Generated TanStack Start RTL apps must move starter copy out of `src/hooks/use-locale.tsx`.

The first production pass should store translations in code-owned resource files under `src/i18n/` rather than fetching them from `public/`.

Recommended structure:

- one exported `resources` object
- one default namespace such as `translation`
- grouped keys for starter, fallback, theme toggle, and language toggle copy

Rules:

- starter copy must move out of inline `MESSAGES`
- fallback copy must move out of pathname-based conditionals
- theme toggle and language toggle labels must come from translation resources
- root fallback text should still come from the same resource source even if the root fallback component receives locale explicitly rather than reading the translation context directly

## Translation API Contract

Generated TanStack Start RTL components must use:

- `useTranslation` in client components
- direct resource lookup or route-fed props only when a fallback surface is intentionally provider-agnostic

Rules:

- do not expose translated copy through a custom locale React context
- do not keep large inline translation objects in components
- do not use `useEffect` to derive plain translated strings that can be read during render
- do not let translation ownership move back into `AppProviders`

## App Providers Contract

`src/components/app-providers.tsx` must be reduced to shared runtime providers only.

It may own:

- theme provider
- tooltip provider
- Base UI or Radix direction provider
- a small document root sync effect for `lang` and `dir` if still needed after the root document shell is route-aware
- i18next provider wiring if that provider is passed already-initialized locale data

It must not own:

- translation dictionaries
- primary locale truth
- route parsing
- `switchLocale`
- a `MESSAGES` object

If `AppProviders` needs the active locale, it should receive it from the route layer or from a small route-aware hook, not from a translation-owning context.

## Locale Utility Contract

`src/lib/i18n.ts` may remain as a small utility module, but only for locale and routing helpers such as:

- `Locale`
- `Direction`
- `isLocale`
- `getDirectionForLocale`
- `getAlternateLocale`
- `getLocaleHref`

It must not own translation content.

## Root Document Contract

`src/routes/__root.tsx` must:

- derive locale defensively from route params
- derive `dir` from that locale
- render `<html lang={locale} dir={direction}>`
- preserve the early theme bootstrap script
- keep favicon and metadata links intact
- keep root error and root not-found handling framework-native

It must not:

- own bilingual copy branches inline if that copy can be resolved from shared translation resources
- initialize a provider-owned locale state model
- rely on browser-only locale discovery during SSR

## Locale Route Contract

`src/routes/$locale/route.tsx` must:

- validate `params.locale` with `isLocale`
- throw `notFound()` for invalid locale params
- define a locale-bound `notFoundComponent`
- provide the locale boundary that the starter page and localized fallback surfaces render inside

This route is the correct place for locale-aware not-found behavior.

## Language Switching Contract

`src/components/language-toggle.tsx` must:

- read the active locale from route truth
- compute the alternate locale with a small helper
- switch to the locale-adjusted path with TanStack Router navigation
- preserve the current pathname during language switch
- ensure the rendered language after navigation matches the route locale on both server and client

The generated app must not keep a separate provider-owned `switchLocale` API.

## Theme and Locale Interaction Contract

The i18n migration must not regress theme behavior.

Rules:

- the early theme bootstrap in `__root.tsx` must remain so there is no dark/light flash
- locale switches must not reset or flash the current theme
- theme labels must be translated through `react-i18next`
- theme and locale synchronization must remain separate concerns

## Fallback and Error Contract

The generated TanStack Start RTL path must keep localized fallback surfaces, but they must no longer depend on provider-owned translation dictionaries.

Rules:

- localized not-found copy must come from shared translation resources
- localized error copy must come from shared translation resources
- not-found surfaces expose only `Go home`
- error surfaces expose `Try again` and `Go home`
- fallback actions keep the existing click-sound behavior and delayed home navigation
- root fallback surfaces must stay defensive because they can render outside the locale route boundary
- locale route not-found surfaces must use the route locale as the primary truth

Recommended component split:

- `fallback-screen.tsx` for shared layout
- `fallback-actions.tsx` for reusable action buttons
- `route-error.tsx` for localized retry/home behavior

## File Cleanup Requirements

This migration must leave no dead files, dead imports, dead helpers, or compatibility shims behind in the generated TanStack Start RTL path.

Mandatory removals:

- remove `src/hooks/use-locale.tsx`
- remove any `LocaleProvider` implementation
- remove old inline `MESSAGES` objects after translation resources are added
- remove route parsing logic that exists only to feed the old translation context
- remove dead imports from `@tanstack/react-router`, `React`, or helper modules after the migration

Cleanup rules:

- if a file becomes only a compatibility bridge for the old i18n system, delete it
- do not ship both `use-locale` and `react-i18next` in generated output
- if fallback components can stop branching on pathname manually, simplify them in the same pass
- generated output must not contain both the old provider-owned system and the new `react-i18next` system at once

## Expected File Responsibilities

`src/i18n/resources.ts`

- exports locale resources
- keeps starter and fallback copy out of components

`src/i18n/config.ts`

- initializes `i18next`
- registers `initReactI18next`
- exposes helpers for SSR-safe locale initialization

`src/i18n/types.ts`

- optional typed resource helpers for TypeScript

`src/lib/i18n.ts`

- small route and direction helpers only

`src/components/app-providers.tsx`

- theme provider
- direction provider
- tooltip provider
- document root sync if still required
- i18n provider composition only, not translation ownership

`src/components/language-toggle.tsx`

- localized label
- route-preserving locale switch

`src/routes/__root.tsx`

- root document shell
- metadata
- theme bootstrap
- defensive root fallback handling

`src/routes/$locale/route.tsx`

- locale validation
- locale-bound not-found handling

## Generator Implementation Requirements

The TanStack Start overlay generator must be updated so that the `start + rtl` path writes the new i18n structure directly instead of generating the old locale-provider model and patching around it.

Implementation direction:

1. add `i18next` and `react-i18next` to generated TanStack Start RTL dependencies
2. emit `src/i18n/config.ts`, `src/i18n/resources.ts`, and any small supporting type file
3. rewrite starter, toggle, and fallback components to use `useTranslation`
4. reduce `app-providers.tsx` to provider composition and document sync only
5. move route-aware locale switching out of the old locale provider and into dedicated route-aware UI helpers
6. remove `src/hooks/use-locale.tsx`
7. keep the LTR TanStack Start path single-language and lightweight

## Suggested File-Generation Delta

Files to add for `start + rtl`:

- `src/i18n/config.ts`
- `src/i18n/resources.ts`
- `src/i18n/types.ts`
- `src/components/fallback-actions.tsx`

Files to rewrite substantially:

- `src/routes/__root.tsx`
- `src/routes/index.tsx`
- `src/routes/$locale/route.tsx`
- `src/routes/$locale/index.tsx`
- `src/components/app-providers.tsx`
- `src/components/starter-shell.tsx`
- `src/components/language-toggle.tsx`
- `src/components/theme-toggle.tsx`
- `src/components/route-error.tsx`
- `src/components/fallback-screen.tsx`
- `src/lib/i18n.ts`
- `README.md`

Files to stop generating for `start + rtl`:

- `src/hooks/use-locale.tsx`

## Verification Requirements

The generated TanStack Start RTL starter is not production-ready until all of these pass:

- `typecheck`
- `lint`
- `format:check`
- `build`

Runtime smoke checks must confirm:

- `/` redirects to `/en`
- `/en` renders English copy
- `/ar` renders Arabic copy
- `html lang` updates correctly from the route locale
- `html dir` updates correctly from the route locale
- language switching preserves the current pathname
- theme state does not flash or reset on locale switch
- unknown locale-prefixed paths render localized not-found content
- root fallback behavior still works for paths that do not resolve inside `/$locale`
- no hydration mismatch appears between first SSR render and client hydration

## Review Checklist

- generated TanStack Start RTL apps no longer contain `src/hooks/use-locale.tsx`
- translation copy no longer lives in inline `MESSAGES` objects
- route locale remains the primary source of truth
- `AppProviders` no longer owns translation dictionaries or locale switching
- `react-i18next` setup is isolated under `src/i18n/`
- root document `lang` and `dir` come from the route locale
- locale-bound not-found handling remains attached to `/$locale`
- no dead imports or compatibility wrappers from the old provider-owned approach remain
- the initial SSR render and client hydration use the same locale and translation store

## Delivery Order

This spec should be implemented only after the Vite `react-i18next` migration is complete and retained Vite fixtures are healthy.

After implementation:

1. regenerate the retained TanStack Start RTL fixtures
2. verify the generated TanStack Start fixtures
3. update [spec/context.md](/D:/Developer/forge/spec/context.md) with the completed Start migration state
