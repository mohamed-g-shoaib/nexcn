"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { Direction, Tooltip } from "radix-ui"

import { type Locale, getDirectionForLocale } from "@/lib/i18n"

function DocumentRootSync() {
  const locale = useLocale() as Locale
  const direction = getDirectionForLocale(locale)

  React.useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = direction
  }, [direction, locale])

  return null
}

function AppShellProviders({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Locale
  const direction = getDirectionForLocale(locale)

  return (
    <Direction.Provider dir={direction}>
      <Tooltip.Provider delayDuration={400} skipDelayDuration={150}>
        <DocumentRootSync />
        {children}
      </Tooltip.Provider>
    </Direction.Provider>
  )
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AppShellProviders>{children}</AppShellProviders>
}
