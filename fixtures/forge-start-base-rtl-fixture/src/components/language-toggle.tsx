import { useLocation, useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { LanguagesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getAlternateLocale, getLocaleHref } from "@/lib/i18n"
import { useRouteLocale } from "@/hooks/use-route-locale"
import { useUiSound } from "@/hooks/use-ui-sound"

export function LanguageToggle() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { locale } = useRouteLocale()
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
          navigate({
            to: getLocaleHref(location.pathname, nextLocale),
          })
        }, 100)
      }}
    >
      <LanguagesIcon data-icon="inline-start" aria-hidden="true" />
      {t("LanguageToggle.label")}
    </Button>
  )
}
