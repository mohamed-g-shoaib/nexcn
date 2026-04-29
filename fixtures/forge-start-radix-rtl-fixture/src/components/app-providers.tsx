import * as React from "react"
import { Direction, Tooltip } from "radix-ui"
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
    <Direction.Provider dir={direction}>
      <Tooltip.Provider delayDuration={400} skipDelayDuration={150}>
        <DocumentRootSync locale={locale} direction={direction} />
        {children}
      </Tooltip.Provider>
    </Direction.Provider>
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
