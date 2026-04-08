"use client"

import * as React from "react"

export type Locale = "en" | "ar"
export type Direction = "ltr" | "rtl"

type LocaleMessages = {
  eyebrow: string
  heading: string
  description: string
  themeToggleToLightLabel: string
  themeToggleToDarkLabel: string
  languageLabel: string
}

type LocaleContextValue = {
  locale: Locale
  direction: Direction
  messages: LocaleMessages
  nextLocale: Locale
  switchLocale: () => void
}

const LOCALE_STORAGE_KEY = "forge-locale"

const MESSAGES: Record<Locale, LocaleMessages> = {
  en: {
    eyebrow: "Forge",
    heading: "Your starter is ready to customize.",
    description:
      "Replace this screen in src/App.tsx. Edit src/components/ for UI pieces, or app-providers.tsx for theme, language, and shared app behavior.",
    themeToggleToLightLabel: "Light",
    themeToggleToDarkLabel: "Dark",
    languageLabel: "Arabic",
  },
  ar: {
    eyebrow: "فورج",
    heading: "الواجهة جاهزة لتبدأ التعديل.",
    description:
      "استبدل هذه الشاشة من src/App.tsx. عدل src/components/ لعناصر الواجهة، أو app-providers.tsx للمظهر واللغة والسلوك العام.",
    themeToggleToLightLabel: "فاتح",
    themeToggleToDarkLabel: "داكن",
    languageLabel: "English",
  },
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null)

function getDirectionForLocale(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr"
}

function getNextLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar"
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "en"
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return storedLocale === "ar" ? "ar" : "en"
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = React.useState<Locale>(getInitialLocale)

  React.useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== LOCALE_STORAGE_KEY) {
        return
      }

      setLocale(event.newValue === "ar" ? "ar" : "en")
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("storage", handleStorage)
    }
  }, [])

  const nextLocale = getNextLocale(locale)
  const direction = getDirectionForLocale(locale)

  const value: LocaleContextValue = {
    locale,
    direction,
    messages: MESSAGES[locale],
    nextLocale,
    switchLocale: () => {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale)
      setLocale(nextLocale)
    },
  }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const context = React.useContext(LocaleContext)

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider.")
  }

  return context
}
