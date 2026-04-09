import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Geist, Geist_Mono } from "next/font/google"

import "../globals.css"
import { AppProviders } from "@/components/app-providers"
import { type Locale, getDirectionForLocale, isLocale, locales } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type ThemeCookieValue = "dark" | "light" | "system"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

function getThemeFromCookie(value: string | undefined): ThemeCookieValue {
  if (value === "dark" || value === "light" || value === "system") {
    return value
  }

  return "system"
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const initialLocale: Locale = locale
  const initialDirection = getDirectionForLocale(initialLocale)
  const cookieStore = await cookies()
  const storedTheme = getThemeFromCookie(cookieStore.get("forge-theme")?.value)
  const initialThemeClass = storedTheme === "system" ? undefined : storedTheme
  const initialColorScheme = storedTheme === "system" ? undefined : storedTheme

  return (
    <html
      lang={initialLocale}
      dir={initialDirection}
      className={initialThemeClass}
      style={initialColorScheme ? { colorScheme: initialColorScheme } : undefined}
      suppressHydrationWarning
    >
      <body className={cn("antialiased", "font-sans", geist.variable, fontMono.variable)}>
        <AppProviders locale={initialLocale}>{children}</AppProviders>
      </body>
    </html>
  )
}
