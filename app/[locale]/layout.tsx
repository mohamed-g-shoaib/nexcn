/**
 * Root Layout
 *
 * Defines the base HTML structure, fonts, and providers for the entire application.
 *
 * To customize:
 * - Update SEO metadata below (title, description, icons)
 * - Modify fonts by changing the Google Fonts imports
 * - Update the theme provider settings if needed
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

/**
 * SEO Metadata
 *
 * Comprehensive SEO configuration for Google ranking and LLM crawling.
 * Optimized for both search engines and AI language model indexing.
 *
 * For page-specific metadata, export metadata from individual page.tsx files.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL("https://nexcn.vercel.app"),
    title: {
      default: "Nexcn - Next.js Starter with TypeScript, Tailwind & i18n",
      template: "%s | Nexcn Starter",
    },
    description:
      "Nexcn is a production-ready Next.js 16 starter. Includes TypeScript, Tailwind CSS v4, Base UI, shadcn/ui, next-intl i18n with English & Arabic, Vitest + Playwright testing, and ESLint/Prettier configured out of the box.",
    keywords: [
      "Next.js",
      "Next.js starter",
      "TypeScript",
      "Tailwind CSS",
      "Base UI",
      "shadcn/ui",
      "internationalization",
      "i18n",
      "English",
      "Arabic",
      "RTL",
      "Vitest",
      "Playwright",
      "React 19",
    ],
    authors: [{ name: "Nexcn" }],
    creator: "Nexcn",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: "/icon.svg",
      apple: "/apple-touch-icon.png",
      shortcut: "/icon.svg",
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_SA"],
      url: `https://nexcn.vercel.app/${locale}`,
      siteName: "Nexcn",
      title: "Nexcn - Production-Ready Next.js Starter",
      description:
        "Ship faster with Nexcn. A Next.js 16 starter with TypeScript, Tailwind CSS, Base UI, shadcn/ui, internationalization, testing, and code quality tools configured out of the box.",
      images: [
        {
          url: "https://nexcn.vercel.app/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: "Nexcn Starter Banner",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Nexcn - Next.js Starter",
      description:
        "Production-ready Next.js 16 starter with everything you need to ship fast.",
      images: ["https://nexcn.vercel.app/opengraph-image.png"],
    },
    verification: {
      // Add your Google Search Console verification code here
      // google: "your-google-verification-code",
    },
    alternates: {
      canonical: `https://nexcn.vercel.app/${locale}`,
      languages: {
        en: "https://nexcn.vercel.app/en",
        ar: "https://nexcn.vercel.app/ar",
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRTL = locale === "ar";
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning dir={isRTL ? "rtl" : "ltr"}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${
          locale === "ar" ? cairo.variable : ""
        } antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            enableColorScheme
            storageKey="nexcn-theme"
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
