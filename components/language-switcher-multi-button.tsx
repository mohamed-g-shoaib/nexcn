/**
 * Language Switcher Multi-Button Component
 *
 * A compact multi-button language switcher that displays all language options
 * (English, Arabic) in a single integrated button group.
 *
 * Features:
 * - Two language options: English (EN), Arabic (ع)
 * - Visual indicator for active language with animated background
 * - RTL/LTR automatic handling based on selected language
 * - Locale-based routing with preserved URL path
 * - Used in mobile drawer navigation
 * - Accessibility labels and tooltips for each language
 *
 * Usage:
 * <LanguageSwitcherMultiButton />
 *
 * To customize:
 * - Add more languages in the languages array
 * - Change display text (currently "EN" and "ع" for Arabic)
 * - Adjust button size by modifying the h-8 class (currently 32px)
 * - Update label text for accessibility and tooltips
 */

"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface LanguageSwitcherMultiButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function LanguageSwitcherMultiButton({
  className,
  ...props
}: LanguageSwitcherMultiButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    // Remove the current locale from pathname
    const pathWithoutLocale = pathname.slice(locale.length + 1);
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale || "/"}`);
  };

  type LanguageValue = "en" | "ar";

  const languages: { value: LanguageValue; label: string; display: string }[] =
    [
      { value: "en", label: "Switch to English", display: "EN" },
      { value: "ar", label: "Switch to Arabic", display: "ع" },
    ];

  return (
    <div
      className={cn(
        "relative isolate inline-flex h-8 items-center rounded-full border border-dotted px-1",
        className
      )}
      {...props}
    >
      {languages.map(({ value, label, display }) => {
        const isActive = locale === value;

        return (
          <button
            key={value}
            aria-label={label}
            title={label}
            type="button"
            onClick={() => switchLanguage(value)}
            className="group relative flex size-6 items-center justify-center rounded-full transition-all duration-200 ease-out"
          >
            {isActive && (
              <div className="bg-muted absolute inset-0 rounded-full transition-all duration-200" />
            )}
            <span
              className={cn(
                "relative text-xs font-medium transition-all duration-200 ease-out",
                isActive
                  ? "text-foreground scale-100 opacity-100"
                  : "text-secondary-foreground group-hover:text-foreground group-focus-visible:text-foreground scale-90 opacity-70"
              )}
            >
              {display}
            </span>
          </button>
        );
      })}
    </div>
  );
}
