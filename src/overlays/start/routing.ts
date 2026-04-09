import { getThemeBootstrapScript } from "../shared/theme-bootstrap.js";

export function getRootRouteTemplate(projectName: string, rtl: boolean): string {
  const themeBootstrapScript = JSON.stringify(getThemeBootstrapScript());

  if (!rtl) {
    return `import { HeadContent, ScriptOnce, Scripts, createRootRoute } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import type * as React from "react";
import { AppProviders } from "@/components/app-providers";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "${projectName}",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundScreen,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <HeadContent />
      </head>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <ScriptOnce>{${themeBootstrapScript}}</ScriptOnce>
        <AppProviders locale="en">{children}</AppProviders>
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundScreen() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Forge
          </p>
          <h1 className="text-xl font-medium tracking-tight">Page not found.</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            This route does not exist in the generated starter yet.
          </p>
        </div>
      </section>
    </main>
  );
}
`;
  }

  return `import {
  HeadContent,
  ScriptOnce,
  Scripts,
  createRootRoute,
  useParams,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import type * as React from "react";
import { AppProviders } from "@/components/app-providers";
import { defaultLocale, getDirectionForLocale, isLocale } from "@/lib/i18n";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "${projectName}",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundScreen,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const params = useParams({ strict: false });
  const locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const direction = getDirectionForLocale(locale);

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <HeadContent />
      </head>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <ScriptOnce>{${themeBootstrapScript}}</ScriptOnce>
        <AppProviders locale={locale}>{children}</AppProviders>
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundScreen() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Forge
          </p>
          <h1 className="text-xl font-medium tracking-tight">Page not found.</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            This route does not exist in the generated starter yet.
          </p>
        </div>
      </section>
    </main>
  );
}
`;
}

export function getIndexRouteTemplate(rtl: boolean): string {
  if (!rtl) {
    return `import { createFileRoute } from "@tanstack/react-router";

import { StarterShell } from "@/components/starter-shell";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  return <StarterShell />;
}
`;
  }

  return `import { createFileRoute, redirect } from "@tanstack/react-router";

import { defaultLocale } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/$locale",
      params: {
        locale: defaultLocale,
      },
    });
  },
});
`;
}

export function getLocaleLayoutRouteTemplate(): string {
  return `import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

import { isLocale } from "@/lib/i18n";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) {
      throw notFound();
    }
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  return <Outlet />;
}
`;
}

export function getLocaleIndexRouteTemplate(): string {
  return `import { createFileRoute } from "@tanstack/react-router";

import { StarterShell } from "@/components/starter-shell";

export const Route = createFileRoute("/$locale/")({
  component: Page,
});

function Page() {
  return <StarterShell />;
}
`;
}

export function getI18nTemplate(rtl: boolean): string {
  if (!rtl) {
    return `export const locales = ["en"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];
export type Direction = "ltr" | "rtl";

export function isLocale(value: string | undefined): value is Locale {
  return value === "en";
}

export function getDirectionForLocale(_locale: Locale): Direction {
  return "ltr";
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale;
}

export function getLocaleHref(pathname: string, _locale: Locale): string {
  return pathname;
}
`;
  }

  return `export const locales = ["en", "ar"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];
export type Direction = "ltr" | "rtl";

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ar";
}

export function getDirectionForLocale(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

export function getLocaleHref(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = locale;
    return \`/\${segments.join("/")}\`;
  }

  return pathname === "/" ? \`/\${locale}\` : \`/\${locale}\${pathname}\`;
}
`;
}

export function getViteConfigTemplate(): string {
  return `import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    nitro(),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
});
`;
}
