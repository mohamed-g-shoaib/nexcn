"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

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
      "Replace this screen in app/[locale]/page.tsx. Edit components/ for UI pieces, or app-providers.tsx for theme, language, and shared app behavior.",
    themeToggleFallbackLabel: "Theme",
    themeToggleToLightLabel: "Light",
    themeToggleToDarkLabel: "Dark",
    languageLabel: "Arabic",
  },
  ar: {
    eyebrow: "فورج",
    heading: "الواجهة جاهزة لتبدأ التعديل.",
    description:
      "استبدل هذه الشاشة من app/[locale]/page.tsx. عدل components/ لعناصر الواجهة، أو app-providers.tsx للمظهر واللغة والسلوك العام.",
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
  const router = useRouter()
  const pathname = usePathname()
  const direction = getDirectionForLocale(locale)
  const nextLocale = getAlternateLocale(locale)

  const value: LocaleContextValue = {
    locale,
    direction,
    messages: MESSAGES[locale],
    nextLocale,
    switchLocale: () => {
      React.startTransition(() => {
        router.push(getLocaleHref(pathname, nextLocale))
      })
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
