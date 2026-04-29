"use client"

import { useLocale, useTranslations } from "next-intl"

import { FallbackActions } from "@/components/fallback-actions"
import { ErrorView } from "@/components/error-view"
import { type Locale, getDirectionForLocale } from "@/lib/i18n"

export default function LocaleErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useLocale() as Locale
  const direction = getDirectionForLocale(locale)
  const t = useTranslations("Fallback")

  return (
    <ErrorView
      eyebrow={t("eyebrow")}
      locale={locale}
      direction={direction}
      title={t("errorTitle")}
      description={t("errorDescription")}
      action={
        <FallbackActions
          homeHref={`/${locale}`}
          homeLabel={t("homeLabel")}
          retryLabel={t("retryLabel")}
          onRetry={reset}
        />
      }
    />
  )
}
