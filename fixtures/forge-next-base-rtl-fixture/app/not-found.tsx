import { getLocale, getTranslations } from "next-intl/server"

import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"
import { getDirectionForLocale, isLocale } from "@/lib/i18n"

export default async function NotFound() {
  const requestLocale = await getLocale()
  const locale = isLocale(requestLocale) ? requestLocale : "en"
  const direction = getDirectionForLocale(locale)
  const t = await getTranslations("Fallback")

  return (
    <FallbackScreen
      eyebrow={t("eyebrow")}
      locale={locale}
      direction={direction}
      title={t("notFoundTitle")}
      description={t("notFoundDescription")}
      action={<FallbackActions homeHref={`/${locale}`} homeLabel={t("homeLabel")} />}
    />
  )
}
