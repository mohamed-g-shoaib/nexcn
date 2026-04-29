"use client"

import { useNavigate } from "react-router"
import { useTranslation } from "react-i18next"
import { LanguagesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useRouteLocale } from "@/hooks/use-route-locale"
import { getAlternateLocale, getLocaleHref } from "@/lib/i18n"
import { useUiSound } from "@/hooks/use-ui-sound"

export function LanguageToggle() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { locale, pathname } = useRouteLocale()
  const { playSound } = useUiSound()
  const nextLocale = getAlternateLocale(locale)

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={t("LanguageToggle.label")}
      className="h-9 rounded-full px-3"
      onClick={() => {
        playSound("click-soft")
        window.setTimeout(() => {
          navigate(getLocaleHref(pathname, nextLocale), { replace: true })
        }, 100)
      }}
    >
      <LanguagesIcon data-icon="inline-start" aria-hidden="true" />
      {t("LanguageToggle.label")}
    </Button>
  )
}
