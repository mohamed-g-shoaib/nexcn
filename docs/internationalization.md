# Internationalization (i18n)

This guide explains how to use next-intl for internationalization in your app.

## Overview

The boilerplate supports multiple languages out of the box:

- English (en)
- Arabic (ar)

All translations are stored in JSON files in the `messages/` directory.

## How It Works

### URL Structure

The app uses locale-based routing:

- English: `http://localhost:3000/en`
- Arabic: `http://localhost:3000/ar`

The locale is automatically detected and applied.

### Configuration Files

**`i18n/routing.ts`** - Defines supported locales:

```typescript
export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
});
```

**`i18n/request.ts`** - Server-side i18n configuration (don't modify unless needed)

## Adding Translations

### 1. Add Keys to Translation Files

Edit the JSON files in `messages/`:

**`messages/en.json`**:

```json
{
  "HomePage": {
    "title": "Welcome to our app",
    "description": "This is a great app"
  }
}
```

**`messages/ar.json`**:

```json
{
  "HomePage": {
    "title": "مرحبا بك في تطبيقنا",
    "description": "هذا تطبيق رائع"
  }
}
```

### 2. Use Translations in Components

**Server Components:**

```tsx
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("HomePage");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
```

**Client Components:**

```tsx
"use client";

import { useTranslations } from "next-intl";

export function WelcomeMessage() {
  const t = useTranslations("HomePage");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
```

## Organizing Translations

### Use Namespaces

Group related translations together:

```json
{
  "Navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "HomePage": {
    "title": "Welcome",
    "subtitle": "Get started now"
  },
  "Footer": {
    "copyright": "© 2024 All rights reserved",
    "privacy": "Privacy Policy"
  }
}
```

Then use the namespace:

```tsx
const t = useTranslations("Navigation");
<a href="/home">{t("home")}</a>;
```

### Nested Keys

You can nest translation keys:

```json
{
  "Form": {
    "validation": {
      "required": "This field is required",
      "email": "Invalid email address"
    },
    "buttons": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  }
}
```

Usage:

```tsx
const t = useTranslations("Form");
<button>{t("buttons.submit")}</button>
<span>{t("validation.required")}</span>
```

## Dynamic Values

### Simple Interpolation

**Translation file:**

```json
{
  "greeting": "Hello, {name}!"
}
```

**Usage:**

```tsx
const t = useTranslations();
<p>{t("greeting", { name: "John" })}</p>;
// Output: Hello, John!
```

### Rich Text

**Translation file:**

```json
{
  "terms": "I agree to the <link>terms and conditions</link>"
}
```

**Usage:**

```tsx
const t = useTranslations();
<p>
  {t.rich("terms", {
    link: (chunks) => <a href="/terms">{chunks}</a>,
  })}
</p>;
```

## Pluralization

**Translation file:**

```json
{
  "items": "{count, plural, =0 {No items} =1 {One item} other {# items}}"
}
```

**Usage:**

```tsx
const t = useTranslations();
<p>{t("items", { count: 0 })}</p>  // No items
<p>{t("items", { count: 1 })}</p>  // One item
<p>{t("items", { count: 5 })}</p>  // 5 items
```

## Date and Time Formatting

```tsx
import { useFormatter } from "next-intl";

export function DateDisplay() {
  const format = useFormatter();
  const date = new Date();

  return (
    <div>
      <p>{format.dateTime(date, { dateStyle: "long" })}</p>
      <p>{format.dateTime(date, { timeStyle: "short" })}</p>
    </div>
  );
}
```

## Number Formatting

```tsx
import { useFormatter } from "next-intl";

export function PriceDisplay() {
  const format = useFormatter();

  return (
    <div>
      <p>{format.number(1234.56, { style: "currency", currency: "USD" })}</p>
      // Output: $1,234.56
    </div>
  );
}
```

## Language Switcher

The boilerplate includes a language toggle component in `components/language-toggle.tsx`.

To use it:

```tsx
import { LanguageToggle } from "@/components/language-toggle";

export function Header() {
  return (
    <header>
      <LanguageToggle />
    </header>
  );
}
```

## Getting Current Locale

**Server Component:**

```tsx
import { getLocale } from "next-intl/server";

export default async function Page() {
  const locale = await getLocale();
  console.log(locale); // "en" or "ar"
}
```

**Client Component:**

```tsx
"use client";

import { useLocale } from "next-intl";

export function LocaleDisplay() {
  const locale = useLocale();
  return <p>Current locale: {locale}</p>;
}
```

## Adding a New Language

1. Add the locale to `i18n/routing.ts`:

```typescript
export const routing = defineRouting({
  locales: ["en", "ar", "fr"], // Added French
  defaultLocale: "en",
});
```

2. Create a new translation file:

```bash
# Copy existing translations
cp messages/en.json messages/fr.json
```

3. Translate the content in `messages/fr.json`

4. Done! The app will automatically support French.

## RTL Support

Arabic is automatically rendered right-to-left. The layout adjusts based on the locale.

To check if current locale is RTL:

```tsx
const locale = useLocale();
const isRTL = locale === "ar";
```

## Best Practices

### 1. Always Use Translation Keys

Never hardcode text:

```tsx
// Bad
<h1>Welcome</h1>

// Good
<h1>{t("welcome")}</h1>
```

### 2. Keep Keys Descriptive

```json
{
  "loginButton": "Log In", // Good
  "btn1": "Log In" // Bad
}
```

### 3. Group Related Translations

```json
{
  "Auth": {
    "login": "Log In",
    "logout": "Log Out",
    "signup": "Sign Up"
  }
}
```

### 4. Provide Context in Keys

```json
{
  "Navigation": {
    "home": "Home" // Navigation link
  },
  "Breadcrumb": {
    "home": "Home" // Breadcrumb item
  }
}
```

### 5. Test All Languages

Always check that your app works in all supported languages.

## Common Issues

### Missing Translation Key

If a key is missing, next-intl will show the key name. Always add keys to all language files.

### Type Safety

For better type safety, you can generate types from your translations. Check the next-intl documentation for advanced setup.

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- Translation files: `messages/en.json`, `messages/ar.json`
- Configuration: `i18n/routing.ts`
