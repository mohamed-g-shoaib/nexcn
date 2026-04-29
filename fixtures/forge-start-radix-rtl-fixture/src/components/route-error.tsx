import { useTranslation } from "react-i18next"

import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"
import { useRouteLocale } from "@/hooks/use-route-locale"
import { getLocaleHref } from "@/lib/i18n"

type RouteErrorProps = {
  onRetry?: () => void
}

export function RouteError({ onRetry }: RouteErrorProps) {
  const { t } = useTranslation()
  const { direction, locale } = useRouteLocale()

  return (
    <FallbackScreen
      eyebrow={t("Fallback.eyebrow")}
      locale={locale}
      direction={direction}
      title={t("Fallback.errorTitle")}
      description={t("Fallback.errorDescription")}
      action={
        onRetry ? (
          <FallbackActions
            homeHref={getLocaleHref("/", locale)}
            homeLabel={t("Fallback.homeLabel")}
            retryLabel={t("Fallback.retryLabel")}
            onRetry={onRetry}
          />
        ) : null
      }
    />
  )
}
