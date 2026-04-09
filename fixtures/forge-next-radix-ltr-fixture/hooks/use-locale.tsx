"use client"

import * as React from "react"

type LocaleMessages = {
  eyebrow: string
  heading: string
  description: string
  themeToggleFallbackLabel: string
  themeToggleToLightLabel: string
  themeToggleToDarkLabel: string
}

type LocaleContextValue = {
  locale: "en"
  direction: "ltr"
  messages: LocaleMessages
}

const MESSAGES: LocaleMessages = {
  eyebrow: "Forge",
  heading: "Your starter is ready to customize.",
  description:
    "Replace this screen in app/page.tsx. Edit components/ for UI pieces, or app-providers.tsx for theme and shared app behavior.",
  themeToggleFallbackLabel: "Theme",
  themeToggleToLightLabel: "Light",
  themeToggleToDarkLabel: "Dark",
}

const LocaleContext = React.createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const value: LocaleContextValue = {
    locale: "en",
    direction: "ltr",
    messages: MESSAGES,
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
