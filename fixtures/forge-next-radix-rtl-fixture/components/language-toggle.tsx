"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { LanguagesIcon } from "lucide-react"

import { usePathname, useRouter } from "@/i18n/navigation"
import { type Locale, getAlternateLocale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { useUiSound } from "@/hooks/use-ui-sound"

export function LanguageToggle() {
  const t = useTranslations("LanguageToggle")
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const { playSound } = useUiSound()
  const nextLocale = getAlternateLocale(locale)

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={t("label")}
      className="h-9 rounded-full px-3"
      onClick={() => {
        playSound("click-soft")
        window.setTimeout(() => {
          React.startTransition(() => {
            router.replace(pathname, { locale: nextLocale })
          })
        }, 100)
      }}
    >
      <LanguagesIcon data-icon="inline-start" aria-hidden="true" />
      {t("label")}
    </Button>
  )
}
