# TanStack Start

## Base Integration

For TanStack Start, use the Vite plugin in the app package:

```ts
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

plugins: [
  paraglideVitePlugin({
    project: "./project.inlang",
    outdir: "./src/paraglide",
  }),
  tanstackStart(),
];
```

Adjust the `project` path in monorepos.

## Server Middleware

TanStack Start uses a server entry. Add middleware there for SSR:

```ts
import handler from "@tanstack/react-start/server-entry";
import { paraglideMiddleware } from "./paraglide/server";

export default {
  fetch(req: Request) {
    return paraglideMiddleware(req, () => handler.fetch(req));
  },
};
```

This is required for SSR request isolation and server-side locale detection. Skip it for client-only setups.

## HTML Lang

Set the document language from the runtime:

```tsx
import { getLocale } from "@/paraglide/runtime";

<html lang={getLocale()} />
```

Use this in the root document or shell component so SSR and hydration agree on the active locale.

## Router Rewrites

TanStack Router supports rewrite-based URL localization with `deLocalizeUrl()` and `localizeUrl()`. This can work well, but it overlaps with Paraglide's URL handling when `url` strategy and middleware are active.

Use rewrites only when you intentionally want router-owned URL transformation. If middleware already manages localized URL redirects, adding router rewrites without a clear plan can create loops or mismatched URLs.

## Offline-Safe Redirects

For offline or client-driven redirect flows, use `shouldRedirect()` during route loading instead of relying only on server redirects.

This is especially useful when the app must recover locale-aware navigation without a fresh server request.

## Practical Pattern

A strong default for TanStack Start:

1. Use the Vite plugin in the app package.
2. Import generated `m` and runtime helpers from the package-local `paraglide/` output.
3. Add `paraglideMiddleware()` in `server.ts`.
4. Set `<html lang={getLocale()}>`.
5. Add router rewrites only if URL localization needs to be router-owned and you have tested the interaction carefully.

