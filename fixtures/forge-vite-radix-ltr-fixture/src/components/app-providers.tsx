"use client"

import type * as React from "react"
import { Direction, Tooltip } from "radix-ui"

import { ThemeProvider } from "@/components/theme-provider"

function AppShellProviders({ children }: { children: React.ReactNode }) {
  return (
    <Direction.Provider dir={"ltr"}>
      <Tooltip.Provider delayDuration={400} skipDelayDuration={150}>
        {children}
      </Tooltip.Provider>
    </Direction.Provider>
  )
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppShellProviders>{children}</AppShellProviders>
    </ThemeProvider>
  )
}
