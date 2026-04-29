import i18n from "i18next"
import Backend from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

import { defaultLocale, getLocaleFromPathname, locales } from "@/lib/i18n"

const initialLanguage =
  typeof window === "undefined" ? defaultLocale : getLocaleFromPathname(window.location.pathname)

void i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
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
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  })

export default i18n
