export const locales = ["en"] as const
export const defaultLocale = "en"

export type Locale = (typeof locales)[number]
export type Direction = "ltr" | "rtl"

export function isLocale(value: string | undefined): value is Locale {
  return value === "en"
}

export function getDirectionForLocale(_locale: Locale): Direction {
  return "ltr"
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale
}

export function getLocaleHref(pathname: string, _locale: Locale): string {
  return pathname
}

export function getLocaleFromPathname(_pathname: string): Locale {
  return "en"
}
