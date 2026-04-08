export function getLayoutTemplate(): string {
  return `import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";

import "../globals.css";
import { AppProviders } from "@/components/app-providers";
import { type Locale, getDirectionForLocale, isLocale, locales } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const initialLocale: Locale = locale;
  const initialDirection = getDirectionForLocale(initialLocale);

  return (
    <html
      lang={initialLocale}
      dir={initialDirection}
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", geist.variable, fontMono.variable)}
    >
      <body>
        <AppProviders locale={initialLocale}>{children}</AppProviders>
      </body>
    </html>
  );
}
`;
}

export function getPageTemplate(): string {
  return `import { StarterShell } from "@/components/starter-shell";

export default function Page() {
  return <StarterShell />;
}
`;
}

export function getProxyTemplate(): string {
  return `import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, locales } from "./lib/i18n";

function getPreferredLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";

  for (const locale of locales) {
    if (acceptLanguage.includes(locale)) {
      return locale;
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(\`/\${getPreferredLocale(request)}\`, request.url));
}

export const config = {
  matcher: "/"
};
`;
}

export function getI18nTemplate(): string {
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

export function getNextConfigTemplate(): string {
  return `import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    root: currentDirectory
  }
};

export default nextConfig;
`;
}
