# Vite i18n Migration Spec

Last updated: 2026-04-29

## Purpose

This spec defines the production target for Forge-generated `vite + rtl` starters after migrating from the current provider-owned translation model to `react-i18next`.

It is intentionally specific to the Vite generator path.

Next.js and TanStack Start must continue to be specified separately.

## Why This Change Is Required

The current Vite bilingual path stores translated copy and locale-switch behavior inside `src/hooks/use-locale.tsx`.

That design does not scale well because:

- route state and translations are coupled inside one client context
- every new translated surface expands a central `MESSAGES` object
- translation content is embedded in component source instead of reusable files
- locale routing is implemented through custom helpers instead of a dedicated i18n layer
- fallback and shell copy remain tied to app runtime context rather than structured translation loading

Forge should move the Vite RTL path to a `react-i18next` architecture that keeps:

- route-prefixed locale truth in React Router
- translation resources in locale files
- translation APIs in components via `useTranslation`
- document `lang` and `dir` sync as a separate concern from translation storage

## Source of Truth

This spec is grounded in:

- local skill: `.agents/skills/react-i18next/SKILL.md`
- local skill: `.agents/skills/react-vite-best-practices/SKILL.md`
- the current Forge Vite overlay structure in `src/overlays/vite/`

If this spec conflicts with the old provider-owned Vite bilingual implementation, this spec wins.

## Scope

This spec applies only to generated Vite starters where `rtl === true`.

It covers:

- overlay file generation for `vite + rtl`
- runtime locale routing
- translation storage
- `react-i18next` setup
- language switching behavior
- not-found and error handling
- cleanup of the old locale provider implementation
- verification requirements

It does not change the `vite + ltr` path beyond keeping the non-RTL path single-language and free of unnecessary i18n runtime code.

## Non-Goals

- adding locales beyond `en` and `ar`
- introducing remote translation loading
- introducing SSR-only i18n patterns not needed by Vite
- preserving compatibility with the current `use-locale` hook API
- solving TanStack Start i18n in this document

## Current Problem Areas

The current generated Vite RTL path is centered around:

- `src/hooks/use-locale.tsx`
- `src/components/app-providers.tsx`
- `src/lib/i18n.ts`
- inline `MESSAGES` objects inside generated hooks and components

The current model uses:

- `useLocation` and `useNavigate` directly inside the locale provider
- a provider-owned `switchLocale` helper
- route parsing and translated copy in the same file
- embedded bilingual UI text inside source templates

This is the surface that must be replaced for the Vite RTL path.

## Target Architecture

Generated Vite RTL starters must follow this file shape:

```txt
public/
  locales/
    en/
      translation.json
    ar/
      translation.json
src/
  App.tsx
  main.tsx
  i18n/
    config.ts
  lib/
    i18n.ts
  components/
    app-providers.tsx
    app-error-boundary.tsx
    fallback-actions.tsx
    fallback-screen.tsx
    language-toggle.tsx
    starter-shell.tsx
    theme-provider.tsx
    theme-toggle.tsx
  routes/
    locale-starter-page.tsx
    not-found-screen.tsx
vite.config.ts
index.html
```

Rules:

- route locale remains the primary source of truth
- translation files must live outside component source, under `public/locales/`
- `react-i18next` setup must live in a dedicated `src/i18n/config.ts`
- document `lang` and `dir` sync must be handled separately from translation storage

## Required Libraries

Generated Vite RTL starters must use:

- `i18next`
- `react-i18next`

Optional helper libraries such as `i18next-browser-languagedetector` or `i18next-http-backend` are not required for the first production pass if static resources are bundled locally and route locale remains the primary truth.

## Locale Model

Vite RTL starters must use:

- locales: `en`, `ar`
- default locale: `en`
- URL shape: `/en/...`, `/ar/...`
- `/` as an entry path only, redirecting to the default locale

Locale truth rules:

- the active route locale is primary
- `i18next.changeLanguage(locale)` must be driven from route changes, not the other way around
- language persistence may exist later, but must not replace route truth

## Routing Contract

Generated Vite RTL apps must keep route-based locale handling with React Router declarative mode.

The generated app must:

- redirect `/` to `/${defaultLocale}`
- validate `/:locale` using a small locale helper
- render the starter page inside a locale route
- render a localized not-found surface for unknown paths

The route layer must remain the source of locale truth.

## i18n Setup Contract

Generated Vite RTL apps must include a dedicated i18n setup file such as:

- `src/i18n/config.ts`

That file must:

- initialize `i18next`
- register `initReactI18next`
- load `en` and `ar` translation resources
- set `fallbackLng` to `en`
- set `interpolation.escapeValue` to `false`
- avoid hidden language detection taking precedence over the route locale

The app entry must import the i18n config before rendering React.

## Translation Storage Contract

Generated Vite RTL apps must create:

- `public/locales/en/translation.json`
- `public/locales/ar/translation.json`

Rules:

- starter copy must move out of inline `MESSAGES` objects
- fallback copy must move out of component conditionals
- theme toggle and language toggle labels must come from translation resources
- shared copy should live in stable namespaces or a single starter namespace structure, not inside component files

The generator must stop embedding bilingual content directly in:

- `src/hooks/use-locale.tsx`
- `src/components/starter-shell.tsx`
- `src/components/language-toggle.tsx`
- `src/App.tsx`

## Translation API Contract

Generated Vite RTL components must use:

- `useTranslation`

Rules:

- do not expose translated copy through a custom locale React context
- do not keep large inline resource objects inside components
- do not use `useEffect` to derive plain translated strings that can be read directly during render

## App Providers Contract

`src/components/app-providers.tsx` must be reduced to shared runtime providers only.

It may own:

- theme provider
- tooltip provider
- Base UI or Radix direction provider
- a small document root sync effect for `lang` and `dir`

It must not own:

- translation dictionaries
- primary locale truth
- `switchLocale`
- route parsing

If `AppProviders` needs the active locale, it should read it from a small route-aware hook or from `react-i18next` plus route helpers, not from a custom translation context.

## Locale Utility Contract

`src/lib/i18n.ts` may remain as a small utility module, but only for route-level helpers such as:

- `Locale`
- `Direction`
- `isLocale`
- `getDirectionForLocale`
- `getAlternateLocale`
- `getLocaleHref`

It must not own translation content.

## Language Switching Contract

`src/components/language-toggle.tsx` must:

- read the current locale from route truth
- compute the alternate locale with a small helper
- switch to the locale-adjusted path with React Router navigation
- call `i18n.changeLanguage(nextLocale)` as part of the route-driven locale update flow if needed

The generated app must preserve the current pathname when switching language.

## Theme and Locale Interaction Contract

The i18n migration must not regress theme behavior.

Rules:

- theme bootstrap in `index.html` must remain early so there is no dark/light flash
- locale switching must not cause theme reset flicker
- theme labels must be translated through `react-i18next`

## Fallback and Error Contract

The generated Vite RTL path must keep localized fallback surfaces, but they must no longer depend on provider-owned translation dictionaries.

Rules:

- not-found copy must come from translation resources
- error copy must come from translation resources
- home navigation remains `Go home` only for not-found
- error surfaces keep `Try again` plus `Go home`
- Arabic fallback rendering must get explicit direction-aware layout through the active route locale
- fallback action components should stay reusable and avoid duplicating route parsing logic everywhere

## File Cleanup Requirements

This migration must leave no dead files, dead imports, dead helpers, or compatibility shims behind in the generated Vite RTL path.

Mandatory removals:

- remove `src/hooks/use-locale.tsx`
- remove any `LocaleProvider` implementation
- remove old inline `MESSAGES` objects after translation resources are added
- remove route parsing logic that exists only to feed the old translation context
- remove dead imports from `react-router`, `React`, or helper modules after the migration

Cleanup rules:

- if a file becomes only a compatibility bridge for the old i18n system, delete it
- do not ship both `use-locale` and `react-i18next` in generated output
- if route helpers can be simplified after the migration, simplify them in the same pass

## Expected File Responsibilities

`src/i18n/config.ts`

- `i18next` setup
- resource registration
- `initReactI18next`

`public/locales/*/translation.json`

- starter copy
- fallback copy
- toggle labels

`src/lib/i18n.ts`

- small route and direction helpers only

`src/components/app-providers.tsx`

- theme provider
- direction provider
- tooltip provider
- document root sync

`src/components/language-toggle.tsx`

- localized language label
- route-preserving locale switch

## Generator Implementation Requirements

The Vite overlay generator must be updated so that the `vite + rtl` path writes the new i18n structure directly instead of generating the old locale-provider model and patching around it.

Implementation direction:

1. add `i18next` and `react-i18next` to generated Vite RTL dependencies
2. emit `src/i18n/config.ts`
3. emit translation files under `public/locales/`
4. rewrite starter, toggle, and fallback components to use `useTranslation`
5. reduce `app-providers.tsx` to provider composition and document sync only
6. remove `src/hooks/use-locale.tsx`
7. keep the LTR Vite path single-language and lightweight

## Suggested File-Generation Delta

Files to add for `vite + rtl`:

- `src/i18n/config.ts`
- `public/locales/en/translation.json`
- `public/locales/ar/translation.json`
- optional route helper files if the Vite overlay benefits from separating route surfaces

Files to rewrite substantially:

- `src/main.tsx`
- `src/App.tsx`
- `src/components/app-providers.tsx`
- `src/components/starter-shell.tsx`
- `src/components/language-toggle.tsx`
- `src/components/theme-toggle.tsx`
- `src/components/fallback-screen.tsx`
- `src/components/app-error-boundary.tsx`
- `src/lib/i18n.ts`
- `vite.config.ts`
- `README.md`

Files to stop generating for `vite + rtl`:

- `src/hooks/use-locale.tsx`

## Verification Requirements

The generated Vite RTL starter is not production-ready until all of these pass:

- `typecheck`
- `lint`
- `format:check`
- `build`

Runtime smoke checks must confirm:

- `/` redirects to `/en`
- `/en` renders English copy
- `/ar` renders Arabic copy
- `document.documentElement.lang` updates correctly
- `document.documentElement.dir` updates correctly
- language switching preserves the current pathname
- theme state does not flash or reset on locale switch
- unknown routes render localized not-found content

## Review Checklist

- generated Vite RTL apps no longer contain `src/hooks/use-locale.tsx`
- translation copy lives under `public/locales/`
- `src/i18n/config.ts` is imported before the app renders
- route locale remains the primary source of truth
- `AppProviders` no longer owns translation dictionaries
- `useTranslation` is used in translated components
- no dead imports or compatibility wrappers from the old provider-owned approach remain

## Delivery Order

This spec should be implemented only after the Next.js `next-intl` migration is complete and retained Next fixtures are healthy.

After implementation:

1. regenerate the retained Vite RTL fixtures
2. verify the generated Vite fixtures
3. only then move to the TanStack Start i18n spec and implementation pass

