import { useLocation } from "@tanstack/react-router"

import { getDirectionForLocale, getLocaleFromPathname } from "@/lib/i18n"

export function useRouteLocale() {
  const location = useLocation()
  const locale = getLocaleFromPathname(location.pathname)
  const direction = getDirectionForLocale(locale)

  return {
    locale,
    direction,
    pathname: location.pathname,
  }
}
