"use client"

import type { ThemeProviderProps } from "next-themes"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

export { useTheme }

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="forge-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
