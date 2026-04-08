# 08. RTL (Right-to-Left) Support Guide

This project supports RTL languages out of the box. Currently configured for **Arabic**, but easily extensible to Hebrew, Persian, Urdu, and more.

## Adding a New RTL Language

### 1. Update the Language List

Edit [lib/rtl.ts](../lib/rtl.ts):

```typescript
const RTL_LANGUAGES = ["ar", "he", "fa", "ur", "yi"];
// Add your language code here
```

### 2. Add Translation Files

Create translation files in `messages/`:

```
messages/
  en.json
  ar.json
  he.json  ← Add this
```

That's it! RTL support is automatic.

## Using RTL in Components

### Client Components

```typescript
"use client";

import { useLocale } from "next-intl";
import { isRTLLocale } from "@/lib/rtl";

export function MyComponent() {
  const locale = useLocale();
  const isRTL = isRTLLocale(locale);

  return <div dir={isRTL ? "rtl" : "ltr"}>{/* content */}</div>;
}
```

### Server Components

```typescript
import { isRTLLocale } from "@/lib/rtl";

export async function MyComponent({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isRTL = isRTLLocale(locale);

  return <div dir={isRTL ? "rtl" : "ltr"}>{/* content */}</div>;
}
```

## How It Works

- `isRTLLocale(locale)` returns `true` for RTL languages, `false` for LTR
- Automatically updates: HTML direction, font selection, component layouts
- Add fonts to `RTL_LANGUAGE_CONFIG` in [lib/rtl.ts](../lib/rtl.ts) if needed:

```typescript
export const RTL_LANGUAGE_CONFIG = {
  ar: { font: "cairo", name: "Arabic" },
  he: { name: "Hebrew" }, // Add font if needed
};
```

## Currently Supported Languages

- ✅ **Arabic (ar)** - Uses Cairo font
- 🔧 **Persian (fa)** - Ready to add
- 🔧 **Urdu (ur)** - Ready to add
- 🔧 **Yiddish (yi)** - Ready to add

## Reference

- [lib/rtl.ts](../lib/rtl.ts) - RTL utility functions
- [docs/05-internationalization-guide.md](./05-internationalization-guide.md) - Full i18n setup
