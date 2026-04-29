import * as React from "react"
import { useTranslation } from "react-i18next"

import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"
import { getLocaleHref } from "@/lib/i18n"
import { useRouteLocale } from "@/hooks/use-route-locale"

type AppErrorBoundaryProps = {
  children: React.ReactNode
}

type AppErrorBoundaryState = {
  hasError: boolean
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  handleRetry = () => {
    this.setState({ hasError: false })
    window.location.assign(window.location.href)
  }

  render() {
    if (this.state.hasError) {
      return <AppErrorFallback onRetry={this.handleRetry} />
    }

    return this.props.children
  }
}

function AppErrorFallback({ onRetry }: { onRetry: () => void }) {
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
        <FallbackActions
          homeHref={getLocaleHref("/", locale)}
          homeLabel={t("Fallback.homeLabel")}
          retryLabel={t("Fallback.retryLabel")}
          onRetry={onRetry}
        />
      }
    />
  )
}
