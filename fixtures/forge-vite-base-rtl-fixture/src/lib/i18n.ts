export const locales = ["en", "ar"] as const
export const defaultLocale = "en"

export type Locale = (typeof locales)[number]
export type Direction = "ltr" | "rtl"

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ar"
}

export function getDirectionForLocale(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr"
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar"
}

export function getLocaleHref(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = locale
    return `/${segments.join("/")}`
  }

  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`
}
