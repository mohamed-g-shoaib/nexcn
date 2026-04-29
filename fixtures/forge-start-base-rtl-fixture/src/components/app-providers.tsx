import * as React from "react"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { Tooltip } from "@base-ui/react/tooltip"
import { I18nextProvider } from "react-i18next"

import { ThemeProvider } from "@/components/theme-provider"
import { createI18nInstance } from "@/i18n/config"
import type { Locale } from "@/lib/i18n"
import { getDirectionForLocale } from "@/lib/i18n"

function DocumentRootSync({ locale, direction }: { locale: Locale; direction: "ltr" | "rtl" }) {
  React.useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = direction
  }, [direction, locale])

  return null
}

function AppShellProviders({
  locale,
  direction,
  children,
}: {
  locale: Locale
  direction: "ltr" | "rtl"
  children: React.ReactNode
}) {
  return (
    <DirectionProvider direction={direction}>
      <Tooltip.Provider delay={400} closeDelay={150} timeout={500}>
        <DocumentRootSync locale={locale} direction={direction} />
        {children}
      </Tooltip.Provider>
    </DirectionProvider>
  )
}

export function AppProviders({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const direction = getDirectionForLocale(locale)
  const i18n = React.useMemo(() => createI18nInstance(locale), [locale])

  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <AppShellProviders locale={locale} direction={direction}>
          {children}
        </AppShellProviders>
      </I18nextProvider>
    </ThemeProvider>
  )
}
