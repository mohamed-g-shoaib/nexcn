# Nexcn Starter

![Nexcn Starter Banner](./app/opengraph-image.png)

A production-ready Next.js boilerplate with internationalization, testing, and modern tooling.

## Features

- **Next.js 16** - App Router with React Server Components
- **TypeScript** - Full type safety
- **Internationalization** - English and Arabic with next-intl
- **UI Components** - shadcn/ui with Radix UI primitives
- **Styling** - Tailwind CSS v4 with design tokens
- **Dark Mode** - Built-in theme switching
- **RTL Support** - Full right-to-left layout for Arabic
- **Testing** - Vitest for unit tests, Playwright for E2E
- **Code Quality** - ESLint, Prettier, Husky pre-commit hooks
- **Type-Safe** - TypeScript with strict mode

## Quick Start

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Check for linting errors
pnpm lint:fix         # Fix linting errors
pnpm format           # Format code with Prettier
pnpm type-check       # Check TypeScript types
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
```

## Documentation

Comprehensive guides are available in the `docs/` folder:

- **[Getting Started](./docs/getting-started.md)** - Installation and setup
- **[Project Structure](./docs/project-structure.md)** - Understanding the codebase
- **[Adding Components](./docs/adding-components.md)** - Creating and using components
- **[Styling Guide](./docs/styling.md)** - Tailwind CSS and design system
- **[Internationalization](./docs/internationalization.md)** - Multi-language support
- **[Testing Guide](./docs/testing.md)** - Unit and E2E testing
- **[Quick Reference](./docs/quick-reference.md)** - Common commands and patterns

## Project Structure

```
nexcn/
├── app/                    # Next.js app directory
│   ├── [locale]/          # Locale-specific routes
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── i18n/                 # Internationalization config
├── messages/             # Translation files
│   ├── en.json          # English
│   └── ar.json          # Arabic
├── lib/                  # Utility functions
├── tests/               # E2E tests
└── docs/                # Documentation
```

## Common Tasks

### Adding a New Page

1. Create `app/[locale]/your-page/page.tsx`
2. Add translations to `messages/en.json` and `messages/ar.json`
3. Add navigation link if needed

### Adding a Component

```bash
# Add shadcn/ui component
pnpm dlx shadcn@latest add button

# Or create custom component in components/
```

### Adding Translations

Edit `messages/en.json` and `messages/ar.json`:

```json
{
  "YourPage": {
    "title": "Your Title",
    "description": "Your description"
  }
}
```

Use in components:

```tsx
import { useTranslations } from "next-intl";

export function Component() {
  const t = useTranslations("YourPage");
  return <h1>{t("title")}</h1>;
}
```

### Styling Components

Use Tailwind CSS with design tokens:

```tsx
<div className="bg-card text-foreground rounded-lg border p-6">Content</div>
```

## Tech Stack

### Core

- Next.js 16 (App Router)
- React 19
- TypeScript 5

### Styling

- Tailwind CSS v4
- shadcn/ui
- Radix UI
- next-themes

### Internationalization

- next-intl

### Testing

- Vitest (unit tests)
- React Testing Library
- Playwright (E2E tests)

### Code Quality

- ESLint
- Prettier
- Husky
- lint-staged

## Development Workflow

### Pre-commit Hooks

The project uses Husky to run checks before commits:

- ESLint fixes
- Prettier formatting
- Type checking

### Testing

```bash
# Unit tests
pnpm test              # Run tests
pnpm test:ui           # Run with UI
pnpm test:coverage     # Generate coverage

# E2E tests
pnpm test:e2e          # Run E2E tests
pnpm test:e2e:ui       # Run with UI
```

### Code Quality

```bash
pnpm lint              # Check for errors
pnpm lint:fix          # Fix errors
pnpm format            # Format code
pnpm type-check        # Check types
```

## Deployment

### Build for Production

```bash
pnpm build
pnpm start
```

### Deploy to Vercel

```bash
vercel
```

Or use any hosting platform that supports Node.js.

## Customization

### Change Theme Colors

Edit `app/globals.css` to modify CSS variables for light and dark modes.

### Add New Language

1. Create `messages/[lang].json`
2. Add locale to `i18n/routing.ts`:
   ```typescript
   locales: ["en", "ar", "fr"];
   ```
3. Translate content in the new JSON file

### Modify Components

All components are in `components/`. UI components from shadcn/ui are in `components/ui/` and can be customized.

## Browser Support

Modern browsers supporting ES2020+:

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - Use freely in your projects.

## Support

For detailed guides and examples, check the [documentation](./docs/README.md).
