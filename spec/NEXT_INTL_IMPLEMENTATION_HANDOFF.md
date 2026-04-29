# next-intl App Router Implementation Handoff

This handoff is a reusable implementation recipe for migrating a Next.js App Router codebase from hand-rolled locale state and inline translation dictionaries to `next-intl` with prefix-based locale routing.

It is written for another LLM agent to follow in a different codebase. Treat it as a procedural guide, not as project history.

## Target Outcome

After this migration, the app should have:

- Locale-prefixed routes, for example `/en` and `/ar`.
- A central `i18n/routing.ts` file defining supported locales and default locale.
- A `next-intl` request config that loads messages from JSON files.
- A locale-aware navigation wrapper exported from `i18n/navigation.ts`.
- A Next.js 16 `proxy.ts` using `next-intl/middleware`.
- An `app/[locale]/layout.tsx` that validates locale params, calls `setRequestLocale(locale)`, loads messages, and wraps children with `NextIntlClientProvider`.
- Page-level `setRequestLocale(locale)` calls for static rendering under `app/[locale]`.
- Components using `useTranslations("Namespace")` instead of local message objects.
- Client navigation importing from the internal `i18n/navigation.ts` wrapper instead of `next/navigation` or `next/link`, except for framework-only APIs such as `notFound`.
- RTL direction handled from the active locale, ideally through document `lang`/`dir` sync and any UI primitive direction providers.

## Starting Assumptions

This guide assumes:

- The project uses Next.js App Router.
- The app has an `app/` directory at the repository root. If the target project uses `src/app/`, place the `i18n` and `proxy` files under `src/` and adjust imports accordingly.
- TypeScript path alias `@/*` points to the repository root or `src/`.
- The desired locale set is English and Arabic:
  - `en` as default locale.
  - `ar` as RTL locale.
- The app may already have a custom hook or context for translations, such as `hooks/use-locale.tsx`.

## Non-Negotiable Rules

Follow these rules exactly:

1. Do not wrap the global root layout with `NextIntlClientProvider`.
2. Scope `NextIntlClientProvider` to `app/[locale]/layout.tsx`.
3. Do not import app navigation helpers like `Link`, `useRouter`, `redirect`, or `usePathname` directly from `next/navigation` or `next/link` in localized app code. Import them from the internal `i18n/navigation.ts` wrapper.
4. Validate the `[locale]` segment with `hasLocale(routing.locales, locale)` and call `notFound()` immediately if invalid.
5. Call `setRequestLocale(locale)` before using next-intl translation APIs in statically rendered layouts or pages.
6. Store translations in JSON files under `messages/`, one file per locale.
7. Keep server and client translation APIs separate:
   - Client components: `useTranslations`.
   - Server components: `getTranslations`.
8. For RTL-capable apps, derive direction from locale and sync `document.documentElement.lang` and `document.documentElement.dir` on the client.

## Step 1: Install Dependency

Install `next-intl`:

```bash
pnpm add next-intl
```

Use the package manager already used by the target repository.

## Step 2: Add Routing Config

Create `i18n/routing.ts`.

If the project uses a `src/` directory, create `src/i18n/routing.ts` instead.

```ts
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
})

export type Locale = (typeof routing.locales)[number]
```

This file is the single source of truth for locale routing.

## Step 3: Add Request Config

Create `i18n/request.ts`.

```ts
import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"

import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

Path adjustment:

- Root-level `i18n/request.ts` loading root-level `messages/`: use `../messages/${locale}.json`.
- `src/i18n/request.ts` loading root-level `messages/`: use `../../messages/${locale}.json`.
- `src/i18n/request.ts` loading `src/messages/`: use `../messages/${locale}.json`.

## Step 4: Add Navigation Wrapper

Create `i18n/navigation.ts`.

```ts
import { createNavigation } from "next-intl/navigation"

import { routing } from "./routing"

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
```

Use this wrapper throughout localized app code.

Examples:

```tsx
import { Link } from "@/i18n/navigation"
```

```tsx
import { usePathname, useRouter } from "@/i18n/navigation"
```

Do not use:

```tsx
import Link from "next/link"
import { useRouter } from "next/navigation"
```

Exception: `notFound` still comes from `next/navigation`.

## Step 5: Add Message Files

Create:

```text
messages/
  en.json
  ar.json
```

Example `messages/en.json`:

```json
{
  "StarterShell": {
    "eyebrow": "Forge",
    "heading": "Your starter is ready to customize.",
    "description": "Replace this screen in app/[locale]/page.tsx."
  },
  "ThemeToggle": {
    "fallbackLabel": "Theme",
    "toLightLabel": "Light",
    "toDarkLabel": "Dark"
  },
  "LanguageToggle": {
    "label": "Arabic"
  },
  "Fallback": {
    "eyebrow": "Forge",
    "notFoundTitle": "Page not found.",
    "notFoundDescription": "This route does not exist yet.",
    "errorTitle": "Something went wrong.",
    "errorDescription": "An unexpected error occurred. Please try again.",
    "homeLabel": "Go home",
    "retryLabel": "Try again"
  }
}
```

Example `messages/ar.json`:

```json
{
  "StarterShell": {
    "eyebrow": "فورج",
    "heading": "الواجهة جاهزة لتبدأ التعديل.",
    "description": "استبدل هذه الشاشة من app/[locale]/page.tsx."
  },
  "ThemeToggle": {
    "fallbackLabel": "المظهر",
    "toLightLabel": "فاتح",
    "toDarkLabel": "داكن"
  },
  "LanguageToggle": {
    "label": "English"
  },
  "Fallback": {
    "eyebrow": "فورج",
    "notFoundTitle": "الصفحة غير موجودة.",
    "notFoundDescription": "هذا المسار غير موجود بعد.",
    "errorTitle": "حدث خطأ ما.",
    "errorDescription": "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    "homeLabel": "العودة للرئيسية",
    "retryLabel": "أعد المحاولة"
  }
}
```

Keep namespaces aligned with component names or route names.

## Step 6: Wire next-intl Plugin

Update the Next config.

For `next.config.mjs`:

```js
import createNextIntlPlugin from "next-intl/plugin"

/** @type {import("next").NextConfig} */
const nextConfig = {
  // Existing config stays here.
}

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

export default withNextIntl(nextConfig)
```

If the project uses `src/i18n/request.ts`, use:

```js
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")
```

For `next.config.ts`:

```ts
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  // Existing config stays here.
}

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

export default withNextIntl(nextConfig)
```

Preserve existing config keys. Only wrap the final export.

## Step 7: Replace Custom Middleware with next-intl Proxy

For Next.js 16, use `proxy.ts`.

Create or replace root-level `proxy.ts`:

```ts
import createMiddleware from "next-intl/middleware"

import { routing } from "./i18n/routing"

export const proxy = createMiddleware(routing)

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
}
```

If using `src/`, place this at `src/proxy.ts` and import from `./i18n/routing`.

The matcher excludes:

- API routes.
- tRPC routes.
- Next internals.
- Vercel internals.
- Static assets with file extensions.

Remove old custom locale redirect logic, custom locale headers, and hand-written accepted-language parsing unless the app has a specific product requirement that next-intl routing cannot cover.

## Step 8: Keep Global Root Layout Provider-Free

The root layout should not use `NextIntlClientProvider`.

Example `app/layout.tsx`:

```tsx
import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
  title: "App",
  description: "App description",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
```

Notes:

- It is acceptable for the root layout to include non-i18n providers such as theme providers.
- Do not read custom locale headers in the root layout.
- Do not derive locale from `headers()` here.
- The locale-specific layout will handle the active language.

## Step 9: Implement `app/[locale]/layout.tsx`

Create or update `app/[locale]/layout.tsx`.

```tsx
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { routing } from "@/i18n/routing"
import { getDirectionForLocale } from "@/lib/i18n"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const direction = getDirectionForLocale(locale)

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale} dir={direction}>
        {children}
      </div>
    </NextIntlClientProvider>
  )
}
```

If the app has additional providers that depend on `useLocale`, place them inside `NextIntlClientProvider`.

Example:

```tsx
return (
  <NextIntlClientProvider messages={messages}>
    <div lang={locale} dir={direction}>
      <AppProviders>{children}</AppProviders>
    </div>
  </NextIntlClientProvider>
)
```

The `lang`/`dir` wrapper is important. The root `<html>` element cannot be controlled from a nested locale layout, and client-side document synchronization may not run for every fallback render. A server-rendered locale wrapper gives shadcn/ui, Tailwind logical utilities, and normal browser text alignment a reliable direction ancestor before hydration.

## Step 10: Update Pages Under `[locale]`

For every page under `app/[locale]` that participates in static rendering and uses locale-aware content, call `setRequestLocale(locale)`.

Example `app/[locale]/page.tsx`:

```tsx
import { setRequestLocale } from "next-intl/server"
import { use } from "react"

import { StarterShell } from "@/components/starter-shell"

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)

  return <StarterShell />
}
```

For async server pages:

```tsx
import { setRequestLocale } from "next-intl/server"

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return <main>...</main>
}
```

Call `setRequestLocale(locale)` before any next-intl server translation calls.

## Step 11: Replace Custom Translation Hooks

If the app has a hook like this:

```tsx
const MESSAGES = {
  en: {
    heading: "Hello",
  },
  ar: {
    heading: "مرحبا",
  },
}
```

Replace component usage with `useTranslations`.

Before:

```tsx
"use client"

import { useLocale } from "@/hooks/use-locale"

export function StarterShell() {
  const { messages } = useLocale()

  return <h1>{messages.heading}</h1>
}
```

After:

```tsx
"use client"

import { useTranslations } from "next-intl"

export function StarterShell() {
  const t = useTranslations("StarterShell")

  return <h1>{t("heading")}</h1>
}
```

When all references are gone, delete the old locale hook/context file.

Verification search:

```bash
rg "use-locale|LocaleProvider|MESSAGES|x-custom-locale|x-forge-locale"
```

## Step 12: Implement Locale Switching

Use `useLocale` from `next-intl` and navigation helpers from the internal wrapper.

Example:

```tsx
"use client"

import { useLocale, useTranslations } from "next-intl"
import * as React from "react"

import { usePathname, useRouter } from "@/i18n/navigation"
import { type Locale } from "@/i18n/routing"

function getAlternateLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar"
}

export function LanguageToggle() {
  const t = useTranslations("LanguageToggle")
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const nextLocale = getAlternateLocale(locale)

  return (
    <button
      type="button"
      aria-label={t("label")}
      onClick={() => {
        React.startTransition(() => {
          router.replace(pathname, { locale: nextLocale })
        })
      }}
    >
      {t("label")}
    </button>
  )
}
```

Important detail:

- `usePathname()` from `@/i18n/navigation` returns the internal localized pathname shape expected by `router.replace`.
- Passing `{ locale: nextLocale }` lets next-intl build the correct locale-prefixed URL.

## Step 13: Preserve RTL Behavior

Create a small locale helper if the app needs one.

Example `lib/i18n.ts`:

```ts
import { routing, type Locale } from "@/i18n/routing"

export type Direction = "ltr" | "rtl"

export function isLocale(value: string | undefined): value is Locale {
  return routing.locales.some((locale) => locale === value)
}

export function getDirectionForLocale(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr"
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar"
}
```

If using Radix UI, shadcn/ui, or another library with direction providers, wrap localized children inside the provider.

Example:

```tsx
"use client"

import { useLocale } from "next-intl"
import { Direction } from "radix-ui"
import * as React from "react"

import { type Locale } from "@/i18n/routing"
import { getDirectionForLocale } from "@/lib/i18n"

function DocumentRootSync() {
  const locale = useLocale() as Locale
  const direction = getDirectionForLocale(locale)

  React.useEffect(() => {
    document.documentElement.dir = direction
    document.documentElement.lang = locale
  }, [direction, locale])

  return null
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Locale
  const direction = getDirectionForLocale(locale)

  return (
    <Direction.Provider dir={direction}>
      <DocumentRootSync />
      {children}
    </Direction.Provider>
  )
}
```

If the target app uses portaled UI like popovers or tooltips, pass `dir` explicitly to portaled content when required by the component library.

## Step 14: Localize Not Found and Error Routes

Important provider boundary:

- Root `app/not-found.tsx` can render outside `app/[locale]/layout.tsx`.
- Any shared component used by root not-found or global error boundaries must not call next-intl navigation hooks such as `useRouter` from `@/i18n/navigation`.
- If a fallback action must work both inside and outside `NextIntlClientProvider`, use a plain browser navigation fallback such as `window.location.assign(homeHref)` inside the click handler.

For `app/not-found.tsx`, use server APIs:

```tsx
import { getLocale, getTranslations } from "next-intl/server"

export default async function NotFound() {
  const locale = await getLocale()
  const t = await getTranslations("Fallback")

  return (
    <main>
      <h1>{t("notFoundTitle")}</h1>
      <p>{t("notFoundDescription")}</p>
      <a href={`/${locale}`}>{t("homeLabel")}</a>
    </main>
  )
}
```

For locale-prefixed missing routes, add `app/[locale]/not-found.tsx`. This keeps `/en/missing` and `/ar/missing` inside the locale segment and allows localized not-found copy to render reliably:

```tsx
import { getLocale, getTranslations } from "next-intl/server"

import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"

export default async function LocaleNotFound() {
  const locale = await getLocale()
  const t = await getTranslations("Fallback")

  return (
    <FallbackScreen
      eyebrow={t("eyebrow")}
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      action={<FallbackActions homeHref={`/${locale}`} homeLabel={t("homeLabel")} />}
    />
  )
}
```

Direction-aware fallback shell:

```tsx
import { type Direction } from "@/lib/i18n"

type FallbackScreenProps = {
  eyebrow?: string
  locale?: string
  direction?: Direction
  title: string
  description: string
  action?: React.ReactNode
}

export function FallbackScreen({
  eyebrow = "Forge",
  locale,
  direction,
  title,
  description,
  action,
}: FallbackScreenProps) {
  return (
    <main lang={locale} dir={direction}>
      <section>
        <div className="text-start">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {action ? <div className="flex justify-start">{action}</div> : null}
      </section>
    </main>
  )
}
```

When rendering Arabic fallback pages, pass `direction="rtl"` and `locale="ar"`. This is necessary because Next.js fallback boundaries may not always go through the normal client provider effect that syncs `document.documentElement.dir`.

Provider-agnostic shared fallback action:

```tsx
"use client"

import { Button } from "@/components/ui/button"

type FallbackActionsProps = {
  homeHref: string
  homeLabel: string
  retryLabel?: string
  onRetry?: () => void
}

export function FallbackActions({
  homeHref,
  homeLabel,
  retryLabel,
  onRetry,
}: FallbackActionsProps) {
  return (
    <>
      {onRetry && retryLabel ? (
        <Button type="button" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
      <Button
        type="button"
        onClick={() => {
          window.location.assign(homeHref)
        }}
      >
        {homeLabel}
      </Button>
    </>
  )
}
```

For route-level localized error boundaries, add `app/[locale]/error.tsx`:

```tsx
"use client"

import { useLocale, useTranslations } from "next-intl"

export default function LocaleErrorBoundary({ reset }: { reset: () => void }) {
  const locale = useLocale()
  const t = useTranslations("Fallback")

  return (
    <main>
      <h1>{t("errorTitle")}</h1>
      <p>{t("errorDescription")}</p>
      <button type="button" onClick={reset}>
        {t("retryLabel")}
      </button>
      <a href={`/${locale}`}>{t("homeLabel")}</a>
    </main>
  )
}
```

Keep global error boundaries defensive. They may render outside the next-intl provider, so avoid relying on `useTranslations` there unless you are certain the provider is available.

## Step 15: Verify Imports

Run searches for forbidden or obsolete patterns:

```bash
rg "use-locale|LocaleProvider|MESSAGES|x-forge-locale|x-custom-locale"
```

```bash
rg "from \"next/link\"|from 'next/link'|from \"next/navigation\"|from 'next/navigation'" app components
```

Review any remaining `next/navigation` imports manually.

Allowed:

- `notFound` in layouts/pages where invalid routes are handled.
- `useParams` only in code that cannot reasonably use next-intl APIs, though this should be rare.

Preferred:

- `Link`, `useRouter`, `usePathname`, `redirect`, `getPathname` from `@/i18n/navigation`.

## Step 16: Run Checks

Run:

```bash
pnpm typecheck
```

```bash
pnpm build
```

```bash
pnpm lint
```

If full lint scans non-app examples, generated files, or skill docs, also run a targeted lint on the touched app paths:

```bash
pnpm exec oxlint app components lib i18n proxy.ts next.config.mjs
```

Adjust the targeted command to the linter used by the target repository.

## Step 17: Runtime Smoke Test

Start the dev server:

```bash
pnpm dev
```

Verify:

- `/` redirects to a locale route.
- `/en` renders English content.
- `/ar` renders Arabic content.
- The HTML element changes to `lang="ar"` and `dir="rtl"` on Arabic routes.
- The language toggle preserves the current pathname while switching locale.
- Navigation links keep the active locale.
- Production build prerenders the expected locale pages.

Expected build shape for a minimal app:

```text
Route (app)
┌ ƒ /_not-found
└ ● /[locale]
  ├ /en
  └ /ar
```

## Common Failure Modes

### `NextIntlClientProvider` in the wrong layout

Symptom:

- Client translations work inconsistently.
- Invalid locale routes are not isolated.

Fix:

- Remove `NextIntlClientProvider` from `app/layout.tsx`.
- Add it to `app/[locale]/layout.tsx`.

### Missing `setRequestLocale(locale)`

Symptom:

- Static rendering errors.
- Dynamic rendering unexpectedly triggered.

Fix:

- Call `setRequestLocale(locale)` in `app/[locale]/layout.tsx`.
- Also call it in every statically rendered page under `app/[locale]`.

### Wrong message import path

Symptom:

- Runtime cannot find `messages/en.json`.

Fix:

- Check the relative path in `i18n/request.ts`.
- Root `i18n/request.ts` to root `messages/` is `../messages/${locale}.json`.
- `src/i18n/request.ts` to root `messages/` is `../../messages/${locale}.json`.

### Locale switching loses pathname

Symptom:

- Language toggle always returns home.
- Query/path state is lost unexpectedly.

Fix:

- Use `usePathname` and `useRouter` from `@/i18n/navigation`.
- Call `router.replace(pathname, { locale: nextLocale })`.

### RTL not applied after client navigation

Symptom:

- Arabic route loads but UI direction stays LTR after toggling.

Fix:

- Add a client provider that reads `useLocale()`, derives direction, and syncs `document.documentElement.dir` and `document.documentElement.lang`.
- Wrap Radix/shadcn primitives with a direction provider.

### Translated Arabic fallback page is still laid out LTR

Symptom:

- Arabic not-found or error copy is correct.
- The page still aligns and orders content as LTR.
- Inspecting the rendered HTML shows no `dir="rtl"` ancestor around the fallback content.

Cause:

- `app/[locale]/layout.tsx` may rely only on a client-side document sync effect to update `<html dir="rtl">`.
- Next.js not-found and error boundaries can render through fallback paths where that normal client provider lifecycle is not a reliable source of direction.
- The root layout cannot receive `[locale]` params, so the root `<html>` often remains `dir="ltr"` during fallback rendering.

Fix:

- Add a server-rendered wrapper inside `app/[locale]/layout.tsx`: `<div lang={locale} dir={direction}>`.
- Make shared fallback shells accept `locale` and `direction` props and apply them directly to the fallback `<main>`.
- Add `text-start` to fallback copy blocks so text alignment follows the active direction.
- Keep using logical classes and shadcn/ui RTL-compatible components.

### `No intl context found` in not-found or error screens

Symptom:

- Visiting `/en/missing` or `/ar/missing` renders an error boundary instead of the not-found UI.
- Console shows `No intl context found. Have you configured the provider?`
- Stack trace points at a shared fallback component calling `useRouter` from the next-intl navigation wrapper.

Cause:

- Root `app/not-found.tsx` and some error boundaries may render outside `app/[locale]/layout.tsx`, so `NextIntlClientProvider` is not guaranteed to be available.
- A shared fallback component imported `useRouter` from `@/i18n/navigation`, which requires next-intl context.

Fix:

- Make shared fallback action components provider-agnostic.
- Do not call `useRouter`, `usePathname`, `Link`, or other next-intl client navigation helpers in shared root fallback components.
- Use `window.location.assign(homeHref)` for fallback home navigation, or split the component into a provider-bound localized variant and a provider-free root variant.
- Add `app/[locale]/not-found.tsx` so locale-prefixed 404s render localized copy inside the locale segment.

### Lint flags skill examples or docs

Symptom:

- App code is valid, but lint fails in unrelated example files.

Fix:

- Do not ignore the error blindly.
- Confirm app paths pass targeted lint.
- Decide whether the repo should exclude example directories from lint or fix those example files separately.

## Final Migration Checklist

- [ ] `next-intl` is installed.
- [ ] `next.config.*` wraps config with `createNextIntlPlugin`.
- [ ] `i18n/routing.ts` exports `routing`.
- [ ] `i18n/request.ts` loads locale JSON messages.
- [ ] `i18n/navigation.ts` exports localized navigation helpers.
- [ ] `messages/en.json` exists.
- [ ] `messages/ar.json` exists.
- [ ] `proxy.ts` uses `createMiddleware(routing)`.
- [ ] `app/layout.tsx` does not use `NextIntlClientProvider`.
- [ ] `app/[locale]/layout.tsx` validates locale with `hasLocale`.
- [ ] `app/[locale]/layout.tsx` calls `notFound()` for invalid locale.
- [ ] `app/[locale]/layout.tsx` calls `setRequestLocale(locale)`.
- [ ] `app/[locale]/layout.tsx` wraps children with `NextIntlClientProvider`.
- [ ] `app/[locale]/layout.tsx` provides a server-rendered `lang`/`dir` wrapper for localized content.
- [ ] Pages under `app/[locale]` call `setRequestLocale(locale)` when statically rendered.
- [ ] `app/[locale]/not-found.tsx` exists for localized 404 routes.
- [ ] Fallback screens accept and apply `locale` and `direction` props.
- [ ] Shared root fallback components do not depend on next-intl client navigation context.
- [ ] Client copy uses `useTranslations`.
- [ ] Server copy uses `getTranslations`.
- [ ] Locale-aware links/router calls use the internal navigation wrapper.
- [ ] Old translation context/hook is removed.
- [ ] RTL direction is derived from active locale.
- [ ] Typecheck passes.
- [ ] Production build passes.
- [ ] Locale routes smoke test correctly.

## Minimal File Map

For a root-level App Router project:

```text
app/
  layout.tsx
  [locale]/
    layout.tsx
    page.tsx
i18n/
  navigation.ts
  request.ts
  routing.ts
messages/
  ar.json
  en.json
next.config.mjs
proxy.ts
```

For a `src/` App Router project:

```text
messages/
  ar.json
  en.json
next.config.ts
src/
  app/
    layout.tsx
    [locale]/
      layout.tsx
      page.tsx
  i18n/
    navigation.ts
    request.ts
    routing.ts
  proxy.ts
```

## Implementation Summary

The migration replaces local translation state with route-scoped internationalization. Locale becomes part of the URL, request-time message loading comes from `next-intl`, client components consume messages through `useTranslations`, and navigation goes through `createNavigation(routing)` so every route transition remains locale-aware.

The most important architectural boundary is provider placement: the global root layout stays generic, while `app/[locale]/layout.tsx` owns locale validation, static locale setup, message loading, and the client provider.
