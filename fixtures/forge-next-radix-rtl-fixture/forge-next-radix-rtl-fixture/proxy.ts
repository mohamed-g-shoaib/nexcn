import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { defaultLocale, locales } from "./lib/i18n"

function getPreferredLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? ""

  for (const locale of locales) {
    if (acceptLanguage.includes(locale)) {
      return locale
    }
  }

  return defaultLocale
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL(`/${getPreferredLocale(request)}`, request.url))
}

export const config = {
  matcher: "/",
}
