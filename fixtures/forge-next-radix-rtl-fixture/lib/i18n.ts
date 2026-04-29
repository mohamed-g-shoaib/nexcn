import type { Locale as RoutingLocale } from "@/i18n/routing"
import { routing } from "@/i18n/routing"

export type Locale = RoutingLocale
export type Direction = "ltr" | "rtl"

export function isLocale(value: string | undefined): value is Locale {
  return routing.locales.some((locale) => locale === value)
}

export function getDirectionForLocale(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr"
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar"
}
