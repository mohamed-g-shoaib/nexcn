"use client"

import * as React from "react"
import { useEffectEvent } from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

import { useUiSound } from "@/hooks/use-ui-sound"

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()
  const { playSound } = useUiSound()

  const toggleTheme = useEffectEvent(() => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"

    setTheme(nextTheme)
    playSound(nextTheme === "dark" ? "switch-off" : "switch-on")
  })

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      toggleTheme()
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return null
}

function ThemeCookieSync() {
  const { theme } = useTheme()

  React.useEffect(() => {
    if (!theme) {
      return
    }

    // biome-ignore lint/suspicious/noDocumentCookie: Forge persists the explicit theme across SSR locale navigations.
    document.cookie = [`forge-theme=${theme}`, "Path=/", "Max-Age=31536000", "SameSite=Lax"].join(
      "; ",
    )
  }, [theme])

  return null
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeCookieSync />
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  )
}
