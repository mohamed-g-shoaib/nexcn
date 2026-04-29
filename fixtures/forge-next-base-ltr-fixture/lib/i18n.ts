export type Locale = "en"
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
