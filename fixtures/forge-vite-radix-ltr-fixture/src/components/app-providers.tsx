"use client"

import * as React from "react"
import { Direction, Tooltip } from "radix-ui"

import { ThemeProvider } from "@/components/theme-provider"
import { LocaleProvider } from "@/hooks/use-locale"

function AppShellProviders({ children }: { children: React.ReactNode }) {
  return (
    <Direction.Provider dir="ltr">
      <Tooltip.Provider delayDuration={400} skipDelayDuration={150}>
        {children}
      </Tooltip.Provider>
    </Direction.Provider>
  )
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AppShellProviders>{children}</AppShellProviders>
      </LocaleProvider>
    </ThemeProvider>
  )
}
