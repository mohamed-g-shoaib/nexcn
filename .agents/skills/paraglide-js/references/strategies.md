# Strategies

## Strategy Order Matters

Paraglide resolves locale by walking the configured strategies in order. Earlier strategies take precedence.

Typical examples:

- `["url", "cookie", "baseLocale"]`
  Use URL as the source of truth. Good when localized URLs should control the active locale.
- `["cookie", "url", "baseLocale"]`
  User preference can override the URL, which may trigger redirects.
- `["cookie", "preferredLanguage", "baseLocale"]`
  Good for apps without localized routing.

Choose the order deliberately. Do not treat it as cosmetic config.

## Built-In Strategies

Common built-ins include:

- `url`
- `cookie`
- `preferredLanguage`
- `baseLocale`

Start with built-ins. Only add custom strategies when the locale source is project-specific.

## Custom Strategies

Use custom strategies for locale sources like:

- search params such as `?locale=zh-CN`
- app-specific headers
- embedded shell state
- legacy storage keys

Register them on both client and server when both environments need the same locale source.

Pattern:

```ts
import {
  defineCustomClientStrategy,
  defineCustomServerStrategy,
} from "@/paraglide/runtime";

defineCustomServerStrategy("custom-name", {
  getLocale: (request) => undefined,
});

defineCustomClientStrategy("custom-name", {
  getLocale: () => undefined,
  setLocale: () => {},
});
```

Keep names stable, usually with a `custom-` prefix so the configured strategy string is obvious.

## URL Strategy And Redirects

With `url` enabled, middleware can redirect when the detected locale and URL locale disagree.

Use this as a mental model:

- `url` first: URL wins, fewer redirects from stored preferences
- `url` later: stored preference can override URL, redirects are more likely

If the app uses localized URLs, test direct navigation, refresh, locale switching, and SSR entry requests.

## Avoiding Rewrite Conflicts

If a framework also rewrites URLs with helpers like `deLocalizeUrl()` and `localizeUrl()`, do not assume that can coexist safely with middleware-managed URL handling.

Before combining them:

- confirm which layer owns URL localization
- test for redirect loops
- test refreshes and deep links

If there is doubt, simplify: either let Paraglide middleware own URL localization for SSR, or let the router own it for client-side routing, but do not duplicate the responsibility casually.

