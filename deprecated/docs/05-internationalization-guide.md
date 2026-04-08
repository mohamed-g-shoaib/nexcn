# 05. Internationalization (i18n)

This project allows you to serve content in English and Arabic easily. It uses `next-intl` to handle routing and translations.

## Workflow: Adding New Text

To add a new piece of text (e.g., a "Sign Up" button), follow these steps:

### 1. Add Keys to Translation Files

You must add the key to **both** files to avoid missing text.

**`messages/en.json`**

```json
{
  "Auth": {
    "signup_btn": "Sign Up Now"
  }
}
```

**`messages/ar.json`**

```json
{
  "Auth": {
    "signup_btn": "سجل الآن"
  }
}
```

### 2. Usage in Server Components (`page.tsx`)

In Server Components, fetching translations is async.

```tsx
import { getTranslations } from "next-intl/server";

export default async function SignupPage() {
  // 1. Fetch the namespace
  const t = await getTranslations("Auth");

  // 2. Render the key
  return <button>{t("signup_btn")}</button>;
}
```

### 3. Usage in Client Components

In Client Components, use the hook.

```tsx
"use client";

import { useTranslations } from "next-intl";

export function SignupButton() {
  const t = useTranslations("Auth");
  return <button onClick={...}>{t("signup_btn")}</button>;
}
```

## Adding a New Language

If you need to add French (fr):

1. **Config**: Open `i18n/routing.ts` and add `"fr"` to the `locales` array.
2. **File**: Create `messages/fr.json` by copying `en.json`.
3. **Translate**: Update the values in `fr.json`.
4. **Middleware**: Next.js automatically detects the new route `/fr`.

## Dynamic Values

You can pass variables into your strings.

**JSON**: `"welcome": "Hello, {name}!"`
**Code**: `t("welcome", { name: "User" })` → "Hello, User!"
