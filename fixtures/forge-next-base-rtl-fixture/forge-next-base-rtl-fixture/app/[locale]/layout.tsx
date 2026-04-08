import { notFound } from "next/navigation"
import { Geist, Geist_Mono } from "next/font/google"

import "../globals.css"
import { AppProviders } from "@/components/app-providers"
import { type Locale, getDirectionForLocale, isLocale, locales } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

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

  return (
    <html
      lang={initialLocale}
      dir={initialDirection}
      suppressHydrationWarning
      className={cn("antialiased", "font-sans", geist.variable, fontMono.variable)}
    >
      <body>
        <AppProviders locale={initialLocale}>{children}</AppProviders>
      </body>
    </html>
  )
}
