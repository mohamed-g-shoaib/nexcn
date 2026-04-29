import { useTranslation } from "react-i18next"

import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"
import { defaultLocale, getLocaleHref } from "@/lib/i18n"
import { useRouteLocale } from "@/hooks/use-route-locale"

export function NotFoundScreen() {
  const { t } = useTranslation()
  const { direction, locale, pathname } = useRouteLocale()
  const homeHref = pathname === "/" ? `/${defaultLocale}` : getLocaleHref("/", locale)

  return (
    <FallbackScreen
      eyebrow={t("Fallback.eyebrow")}
      locale={locale}
      direction={direction}
      title={t("Fallback.notFoundTitle")}
      description={t("Fallback.notFoundDescription")}
      action={<FallbackActions homeHref={homeHref} homeLabel={t("Fallback.homeLabel")} />}
    />
  )
}
