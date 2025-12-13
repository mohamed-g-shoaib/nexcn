"use client";

import { Languages } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations();
  const isRTL = locale === "ar";

  const switchLanguage = (newLocale: string) => {
    // Remove the current locale from pathname
    const pathWithoutLocale = pathname.slice(locale.length + 1);

    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale || "/"}`);
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  suppressHydrationWarning={true}
                />
              }
            />
          }
        >
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("languages.switchLabel")}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("languages.switchLabel")}</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuItem onClick={() => switchLanguage("en")}>
          {t("languages.english")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage("ar")}>
          {t("languages.arabic")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
