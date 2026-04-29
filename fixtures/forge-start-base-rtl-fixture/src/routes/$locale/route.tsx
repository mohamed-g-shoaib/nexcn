import { Outlet, createFileRoute, notFound } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"
import { useRouteLocale } from "@/hooks/use-route-locale"
import { getLocaleHref, isLocale } from "@/lib/i18n"

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) {
      throw notFound()
    }
  },
  notFoundComponent: LocaleNotFoundScreen,
  component: LocaleLayout,
})

function LocaleLayout() {
  return <Outlet />
}

function LocaleNotFoundScreen() {
  const { t } = useTranslation()
  const { direction, locale } = useRouteLocale()

  return (
    <FallbackScreen
      eyebrow={t("Fallback.eyebrow")}
      locale={locale}
      direction={direction}
      title={t("Fallback.notFoundTitle")}
      description={t("Fallback.notFoundDescription")}
      action={
        <FallbackActions
          homeHref={getLocaleHref("/", locale)}
          homeLabel={t("Fallback.homeLabel")}
        />
      }
    />
  )
}
