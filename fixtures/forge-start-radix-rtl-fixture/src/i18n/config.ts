import { createInstance } from "i18next"
import { initReactI18next } from "react-i18next"

import { resources } from "@/i18n/resources"
import { defaultLocale, locales, type Locale } from "@/lib/i18n"

export function createI18nInstance(locale: Locale) {
  const i18n = createInstance()

  void i18n.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: defaultLocale,
    supportedLngs: [...locales],
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    initAsync: false,
  })

  return i18n
}
