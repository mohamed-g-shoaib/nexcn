"use client"

import * as React from "react"
import { useEffectEvent } from "react"

import { useUiSound } from "@/hooks/use-ui-sound"

type Theme = "dark" | "light" | "system"
type ResolvedTheme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  mounted: boolean
  setTheme: (theme: Theme) => void
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
const THEME_VALUES: Array<Theme> = ["dark", "light", "system"]
const COOKIE_MAX_AGE = 31536000

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined)

function isTheme(value: string | null): value is Theme {
  if (value === null) {
    return false
  }

  return THEME_VALUES.includes(value as Theme)
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window !== "undefined" && window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark"
  }

  return "light"
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}",
    ),
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

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
    // biome-ignore lint/suspicious/noDocumentCookie: Forge persists the explicit theme across SSR locale navigations.
    document.cookie = [
      `forge-theme=${theme}`,
      "Path=/",
      `Max-Age=${COOKIE_MAX_AGE}`,
      "SameSite=Lax",
    ].join("; ")
  }, [theme])

  return null
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "forge-theme",
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [mounted, setMounted] = React.useState(false)

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      if (typeof window === "undefined") {
        return
      }

      window.localStorage.setItem(storageKey, nextTheme)
      setThemeState(nextTheme)
    },
    [storageKey],
  )

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey)
    const nextTheme = isTheme(storedTheme) ? storedTheme : defaultTheme

    setThemeState(nextTheme)
    setMounted(true)
  }, [defaultTheme, storageKey])

  React.useEffect(() => {
    const root = document.documentElement
    const cleanup = disableTransitionOnChange ? disableTransitionsTemporarily() : null
    const resolvedTheme = resolveTheme(theme)

    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)
    root.style.colorScheme = resolvedTheme

    return () => {
      cleanup?.()
    }
  }, [disableTransitionOnChange, theme])

  React.useEffect(() => {
    if (theme !== "system") {
      return
    }

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY)
    const onChange = () => {
      setThemeState((currentTheme) => (currentTheme === "system" ? "system" : currentTheme))
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(getSystemTheme())
      document.documentElement.style.colorScheme = getSystemTheme()
    }

    mediaQuery.addEventListener("change", onChange)

    return () => {
      mediaQuery.removeEventListener("change", onChange)
    }
  }, [theme])

  React.useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.storageArea !== window.localStorage || event.key !== storageKey) {
        return
      }

      const nextTheme = isTheme(event.newValue) ? event.newValue : defaultTheme
      setThemeState(nextTheme)
    }

    window.addEventListener("storage", onStorage)

    return () => {
      window.removeEventListener("storage", onStorage)
    }
  }, [defaultTheme, storageKey])

  const value = React.useMemo<ThemeProviderState>(
    () => ({
      theme,
      resolvedTheme: resolveTheme(theme),
      mounted,
      setTheme,
    }),
    [mounted, setTheme, theme],
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      <ThemeCookieSync />
      <ThemeHotkey />
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme(): ThemeProviderState {
  const context = React.useContext(ThemeProviderContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.")
  }

  return context
}
