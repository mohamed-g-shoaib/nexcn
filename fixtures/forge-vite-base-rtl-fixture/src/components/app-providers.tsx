"use client"

import * as React from "react"
import { useLocation } from "react-router"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { Tooltip } from "@base-ui/react/tooltip"

import { ThemeProvider } from "@/components/theme-provider"
import i18n from "@/i18n/config"
import { getDirectionForLocale, getLocaleFromPathname } from "@/lib/i18n"

function RouteLocaleSync() {
  const location = useLocation()
  const locale = getLocaleFromPathname(location.pathname)
  const direction = getDirectionForLocale(locale)

  React.useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = direction
    void i18n.changeLanguage(locale)
  }, [direction, locale])

  return null
}

function AppShellProviders({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const locale = getLocaleFromPathname(location.pathname)
  const direction = getDirectionForLocale(locale)

  return (
    <DirectionProvider direction={direction}>
      <Tooltip.Provider delay={400} closeDelay={150} timeout={500}>
        <RouteLocaleSync />
        {children}
      </Tooltip.Provider>
    </DirectionProvider>
  )
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppShellProviders>{children}</AppShellProviders>
    </ThemeProvider>
  )
}
