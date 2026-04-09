"use client"

import * as React from "react"
import { Direction, Tooltip } from "radix-ui"

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
    <Direction.Provider dir={direction}>
      <Tooltip.Provider delayDuration={400} skipDelayDuration={150}>
        <DocumentRootSync />
        {children}
      </Tooltip.Provider>
    </Direction.Provider>
  )
}

export function AppProviders({
  locale,
  children,
}: {
  locale: "en" | "ar"
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <LocaleProvider locale={locale}>
        <AppShellProviders>{children}</AppShellProviders>
      </LocaleProvider>
    </ThemeProvider>
  )
}
