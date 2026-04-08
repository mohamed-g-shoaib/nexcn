# 09. Quick Reference Cheat Sheet

## Essential Commands

| Task                 | Command            |
| :------------------- | :----------------- |
| **Start Dev Server** | `pnpm dev`         |
| **Build Prod**       | `pnpm build`       |
| **Lint & Fix**       | `pnpm lint:fix`    |
| **Format Code**      | `pnpm format`      |
| **Run Unit Tests**   | `pnpm test`        |
| **Run E2E Tests**    | `pnpm test:e2e`    |
| **Update deps**      | `pnpm up --latest` |

## Key File Locations

| What               | Where                                  |
| :----------------- | :------------------------------------- |
| **Homepage**       | `app/[locale]/page.tsx`                |
| **Root Layout**    | `app/[locale]/layout.tsx`              |
| **Global CSS**     | `app/globals.css`                      |
| **Translations**   | `messages/en.json`, `messages/ar.json` |
| **Routing Config** | `i18n/routing.ts`                      |
| **Components**     | `components/*.tsx`                     |

## Common Code Snippets

**Adding a logical margin (RTL safe)**

```tsx
<div className="ms-4">...</div>
```

**Fetching translations (Server)**

```tsx
const t = await getTranslations("Namespace");
```

**Fetching translations (Client)**

```tsx
const t = useTranslations("Namespace");
```

**Merging classes**

```tsx
<div className={cn("text-lg", isActive && "font-bold")}>
```

**Client Component Directive**

```tsx
"use client";
```
