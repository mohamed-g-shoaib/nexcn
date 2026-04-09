"use client"

/* eslint-disable react-refresh/only-export-components */

import * as React from "react"
import { useLocation, useNavigate } from "react-router"

import {
  type Direction,
  type Locale,
  defaultLocale,
  getAlternateLocale,
  getDirectionForLocale,
  getLocaleHref,
  isLocale,
} from "@/lib/i18n"

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

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const localeSegment = location.pathname.split("/").filter(Boolean)[0]
  const locale = isLocale(localeSegment) ? localeSegment : defaultLocale
  const nextLocale = getAlternateLocale(locale)
  const direction = getDirectionForLocale(locale)

  const value = React.useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction,
      messages: MESSAGES[locale],
      nextLocale,
      switchLocale: () => {
        navigate(getLocaleHref(location.pathname, nextLocale), { replace: true })
      },
    }),
    [direction, locale, location.pathname, navigate, nextLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const context = React.useContext(LocaleContext)

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider.")
  }

  return context
}
