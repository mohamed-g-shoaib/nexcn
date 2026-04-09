import * as React from "react"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { Tooltip } from "@base-ui/react/tooltip"

import type { Locale } from "@/lib/i18n"
import { ThemeProvider } from "@/components/theme-provider"
import { LocaleProvider, useLocale } from "@/hooks/use-locale"

function DocumentRootSync() {
  const { direction, locale } = useLocale()

  React.useEffect(() => {
    document.documentElement.dir = direction
    document.documentElement.lang = locale
  }, [direction, locale])

  return null
}

function AppShellProviders({ children }: { children: React.ReactNode }) {
  const { direction } = useLocale()

  return (
    <DirectionProvider direction={direction}>
      <Tooltip.Provider delay={400} closeDelay={150} timeout={500}>
        <DocumentRootSync />
        {children}
      </Tooltip.Provider>
    </DirectionProvider>
  )
}

export function AppProviders({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider locale={locale}>
        <AppShellProviders>{children}</AppShellProviders>
      </LocaleProvider>
    </ThemeProvider>
  )
}
