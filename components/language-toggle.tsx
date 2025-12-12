"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Locale } from "@/app/[lang]/dictionaries";

// Extend DropdownMenu to accept dir prop
declare module "@/components/ui/dropdown-menu" {
  interface DropdownMenuProps {
    dir?: "ltr" | "rtl";
  }
}

interface LanguageToggleProps {
  translations: {
    english: string;
    arabic: string;
    switchLabel: string;
  };
  dir?: "ltr" | "rtl";
}

export function LanguageToggle({ translations, dir }: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: Locale) => {
    // Remove the current locale from pathname
    const currentLocale = pathname.split("/")[1];
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");

    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale || "/"}`);
  };

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" suppressHydrationWarning={true}>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{translations.switchLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage("en")}>
          {translations.english}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage("ar")}>
          {translations.arabic}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
