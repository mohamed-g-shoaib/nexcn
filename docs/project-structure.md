# Project Structure

Understanding the project structure will help you navigate and modify the codebase effectively.

## Directory Overview

```
nexcn/
├── app/                    # Next.js App Router
├── components/             # React components
├── i18n/                   # Internationalization config
├── lib/                    # Utility functions
├── messages/               # Translation files
├── public/                 # Static assets
├── tests/                  # E2E tests
└── docs/                   # Documentation
```

## App Directory (`app/`)

Next.js 15 uses the App Router. All routes are defined here.

```
app/
├── [locale]/              # Locale-based routing
│   ├── layout.tsx        # Root layout (wraps all pages)
│   ├── page.tsx          # Homepage (/)
│   ├── about/            # About page (/about)
│   │   └── page.tsx
│   └── error.tsx         # Error boundary
├── globals.css           # Global styles
├── not-found.tsx         # 404 page
├── global-error.tsx      # Global error handler
├── robots.ts             # Robots.txt generator
├── sitemap.ts            # Sitemap generator
└── icon.svg              # Favicon
```

### Key Files

**`app/[locale]/layout.tsx`**

- Root layout component
- Wraps all pages
- Includes providers (theme, i18n)
- Contains navigation and footer

**`app/[locale]/page.tsx`**

- Homepage component
- First page users see

**`app/globals.css`**

- Global CSS styles
- Tailwind directives
- CSS variables for theming

## Components Directory (`components/`)

Reusable React components.

```
components/
├── ui/                   # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   └── tooltip.tsx
├── navigation.tsx        # Main navigation
├── footer.tsx           # Footer component
├── mode-toggle.tsx      # Dark/light mode toggle
└── language-toggle.tsx  # Language switcher
```

### UI Components (`components/ui/`)

These are shadcn/ui components. They are:

- Fully customizable
- Accessible by default
- Styled with Tailwind CSS

To add more:

```bash
pnpm dlx shadcn@latest add <component-name>
```

## i18n Directory (`i18n/`)

Internationalization configuration.

```
i18n/
├── routing.ts           # Locale configuration
└── request.ts           # Server-side i18n setup
```

**`routing.ts`** - Configure supported languages:

```typescript
export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
});
```

**`request.ts`** - Handles locale detection and message loading (rarely needs changes).

## Messages Directory (`messages/`)

Translation files for each language.

```
messages/
├── en.json              # English translations
└── ar.json              # Arabic translations
```

Each file contains key-value pairs:

```json
{
  "HomePage": {
    "title": "Welcome",
    "description": "Get started"
  }
}
```

## Lib Directory (`lib/`)

Utility functions and helpers.

```
lib/
└── utils.ts             # Utility functions
```

**`utils.ts`** contains the `cn()` function for merging Tailwind classes:

```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-class", condition && "conditional-class")} />
```

## Public Directory (`public/`)

Static files served directly.

```
public/
└── images/
    └── logo.png
```

Access files via `/images/logo.png` in your code.

## Tests Directory (`tests/`)

End-to-end tests with Playwright.

```
tests/
└── example.spec.ts      # E2E test example
```

Unit tests are placed next to components:

```
components/
├── button.tsx
└── button.test.tsx
```

## Configuration Files

### `next.config.ts`

Next.js configuration:

- i18n setup
- Build settings
- Redirects and rewrites

### `tailwind.config.ts`

Tailwind CSS configuration:

- Theme customization
- Custom colors
- Plugins

### `components.json`

shadcn/ui configuration:

- Component path
- Utility path
- Style preferences

### `tsconfig.json`

TypeScript configuration:

- Compiler options
- Path aliases (`@/` points to root)

### `eslint.config.mjs`

ESLint rules for code quality.

### `.prettierrc`

Code formatting rules.

### `vitest.config.ts`

Vitest test runner configuration.

### `playwright.config.ts`

Playwright E2E test configuration.

## Path Aliases

The project uses `@/` as an alias for the root directory:

```typescript
// Instead of:
import { Button } from "../../components/ui/button";

// Use:
import { Button } from "@/components/ui/button";
```

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Adding New Pages

### 1. Create Page File

```
app/[locale]/blog/page.tsx
```

### 2. Add Page Component

```tsx
export default function BlogPage() {
  return (
    <div>
      <h1>Blog</h1>
    </div>
  );
}
```

### 3. Add Translations

In `messages/en.json`:

```json
{
  "BlogPage": {
    "title": "Blog"
  }
}
```

### 4. Access Page

Visit `/en/blog` or `/ar/blog`

## Adding New Routes

### Static Routes

```
app/[locale]/about/page.tsx       → /en/about
app/[locale]/contact/page.tsx     → /en/contact
```

### Dynamic Routes

```
app/[locale]/blog/[slug]/page.tsx → /en/blog/my-post
```

```tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <div>Post: {params.slug}</div>;
}
```

### Nested Routes

```
app/[locale]/dashboard/
├── page.tsx              → /en/dashboard
├── settings/
│   └── page.tsx         → /en/dashboard/settings
└── profile/
    └── page.tsx         → /en/dashboard/profile
```

## Styling Approach

### Global Styles

Define in `app/globals.css`

### Component Styles

Use Tailwind classes directly:

```tsx
<div className="bg-card rounded-lg border p-4">Content</div>
```

### CSS Variables

Defined in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
}
```

Use in Tailwind:

```tsx
<div className="bg-background text-foreground">Content</div>
```

## Environment Variables

Create `.env.local` for environment variables:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

Access in code:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

Note: `NEXT_PUBLIC_` prefix makes variables available in the browser.

## Build and Deploy

### Development

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

### Type Check

```bash
pnpm type-check
```

### Lint

```bash
pnpm lint
pnpm lint:fix
```

## Common Workflows

### Adding a Feature

1. Create component in `components/`
2. Add translations in `messages/`
3. Create page in `app/[locale]/`
4. Write tests
5. Test in both languages
6. Commit changes

### Updating Styles

1. Modify `app/globals.css` for global changes
2. Use Tailwind classes for component styles
3. Update theme in `tailwind.config.ts` if needed

### Adding Dependencies

```bash
pnpm add <package-name>           # Production dependency
pnpm add -D <package-name>        # Dev dependency
```

## File Naming Conventions

- Components: `kebab-case.tsx` (e.g., `user-profile.tsx`)
- Pages: `page.tsx`
- Layouts: `layout.tsx`
- Tests: `component.test.tsx` or `component.spec.ts`
- Types: `types.ts` or `component.types.ts`

## Import Order

Recommended import order:

```typescript
// 1. React and Next.js
import { useState } from "react";
import Link from "next/link";

// 2. Third-party libraries
import { useTranslations } from "next-intl";

// 3. Components
import { Button } from "@/components/ui/button";

// 4. Utils and types
import { cn } from "@/lib/utils";
import type { User } from "@/types";

// 5. Styles
import "./styles.css";
```

## Summary

- `app/` - Pages and routes
- `components/` - Reusable components
- `messages/` - Translations
- `i18n/` - i18n config
- `lib/` - Utilities
- `public/` - Static files
- `tests/` - E2E tests

Use `@/` for imports and follow the established patterns for consistency.
