import * as React from "react"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { Tooltip } from "@base-ui/react/tooltip"

import { ThemeProvider } from "@/components/theme-provider"
import { LocaleProvider } from "@/hooks/use-locale"

function AppShellProviders({ children }: { children: React.ReactNode }) {
  return (
    <DirectionProvider direction="ltr">
      <Tooltip.Provider delay={400} closeDelay={150} timeout={500}>
        {children}
      </Tooltip.Provider>
    </DirectionProvider>
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
