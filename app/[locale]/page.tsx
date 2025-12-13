"use client";

/**
 * Homepage Component
 *
 * This is your main landing page. Customize the content below to match your project.
 *
 * To customize:
 * - Update translations in messages/en.json and messages/ar.json
 * - Replace the logo in public/nexcn.svg
 * - Modify the CTA buttons to link to your documentation or features
 * - Remove or replace the instruction lines once you're familiar with the structure
 */

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useLocale, useTranslations } from "next-intl";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Navigation } from "@/components/navigation";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { generateOrganizationSchema, generateFAQSchema } from "@/app/schema";

export default function Home() {
  const locale = useLocale();
  const t = useTranslations();
  const isRTL = locale === "ar";

  // JSON-LD schemas for SEO and LLM crawling
  const organizationSchema = generateOrganizationSchema();
  const faqSchema = generateFAQSchema();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* JSON-LD Schema Markup for Google and LLM Crawlers */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Navbar */}
      <nav
        className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-4xl items-center justify-between">
            {/* Logo/Brand - Replace with your own logo and brand name */}
            <Link
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Image
                className="dark:invert"
                src="/nexcn.svg" // Replace with your logo path
                alt="Nexcn logo" // Update alt text
                width={24}
                height={24}
                style={{ width: "24px", height: "24px" }}
              />
              {/* Nexcn - Replace with your brand name */}
              <span className="text-lg font-semibold text-black dark:text-white">
                Nexcn
              </span>
            </Link>

            {/* Navigation Menu - Desktop (navigation.tsx) and Mobile Drawer (mobile-navigation.tsx) */}
            <div className="hidden md:flex md:flex-1 md:justify-center">
              <Navigation dir={isRTL ? "rtl" : "ltr"} />
            </div>

            {/* Mobile Navigation - Shows on mobile only (< 768px). Drawer opens from bottom with language and theme multi-button switchers */}
            <div className="md:hidden">
              <MobileNavigation dir={isRTL ? "rtl" : "ltr"} />
            </div>

            {/* Switchers - Desktop only */}
            <div
              className={`hidden gap-2 md:flex ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <LanguageToggle />
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div
            className="flex flex-col items-start gap-8 text-start sm:gap-12"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Hero Section - Update translations in messages/en.json and messages/ar.json */}
            <div className="flex flex-col gap-4 text-start">
              <h1 className="text-4xl leading-tight font-bold tracking-tight text-black sm:text-5xl dark:text-zinc-50">
                {t("content.title")}
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                {t("content.subtitle")}
              </p>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t("content.description")}
              </p>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {t("content.instructions.line1")}
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {t("content.instructions.line2")}
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {t("content.instructions.line3")}
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {t("content.instructions.line4")}
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {t("content.instructions.line5")}
                </p>
              </div>
            </div>

            {/* CTA Buttons - Update links and labels to match your project */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                render={
                  <a
                    href="https://nextjs.org/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                variant="default"
                size="lg"
                className="h-12 cursor-pointer px-6"
              >
                {t("cta.nextjsDocs")}
              </Button>
              <Button
                render={
                  <a
                    href="https://base-ui.com/react/overview/quick-start"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                variant="outline"
                size="lg"
                className="h-12 cursor-pointer px-6"
              >
                {t("cta.baseUiDocs")}
              </Button>
              <Button
                render={
                  <a
                    href="https://ui.shadcn.com/docs/components"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                variant="outline"
                size="lg"
                className="h-12 cursor-pointer px-6"
              >
                {t("cta.shadcnDocs")}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer dir={isRTL ? "rtl" : "ltr"} />
    </div>
  );
}
