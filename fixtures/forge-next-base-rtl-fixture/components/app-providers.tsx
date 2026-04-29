"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { Tooltip } from "@base-ui/react/tooltip"

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
    <DirectionProvider direction={direction}>
      <Tooltip.Provider delay={400} closeDelay={150} timeout={500}>
        <DocumentRootSync />
        {children}
      </Tooltip.Provider>
    </DirectionProvider>
  )
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <AppShellProviders>{children}</AppShellProviders>
}
