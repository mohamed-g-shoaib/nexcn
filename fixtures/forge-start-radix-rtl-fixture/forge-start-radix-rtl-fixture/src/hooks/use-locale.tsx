import * as React from "react"
import { useLocation, useNavigate } from "@tanstack/react-router"

import {
  type Direction,
  type Locale,
  getAlternateLocale,
  getDirectionForLocale,
  getLocaleHref,
} from "@/lib/i18n"

type LocaleMessages = {
  eyebrow: string
  heading: string
  description: string
  themeToggleFallbackLabel: string
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
      "Replace this screen in src/routes/$locale/index.tsx. Edit src/components/ for UI pieces, or app-providers.tsx for theme, language, and root provider composition.",
    themeToggleFallbackLabel: "Theme",
    themeToggleToLightLabel: "Light",
    themeToggleToDarkLabel: "Dark",
    languageLabel: "Arabic",
  },
  ar: {
    eyebrow: "فورج",
    heading: "الواجهة جاهزة لتبدأ التعديل.",
    description:
      "استبدل هذه الشاشة من src/routes/$locale/index.tsx. عدل src/components/ لعناصر الواجهة، أو app-providers.tsx للمظهر واللغة وبنية المزودات العامة.",
    themeToggleFallbackLabel: "المظهر",
    themeToggleToLightLabel: "فاتح",
    themeToggleToDarkLabel: "داكن",
    languageLabel: "English",
  },
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const direction = getDirectionForLocale(locale)
  const nextLocale = getAlternateLocale(locale)

  const value = React.useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction,
      messages: MESSAGES[locale],
      nextLocale,
      switchLocale: () => {
        React.startTransition(() => {
          navigate({
            to: getLocaleHref(location.pathname, nextLocale),
          })
        })
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
