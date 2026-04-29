import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"

import { AppProviders } from "@/components/app-providers"
import { routing } from "@/i18n/routing"
import { getDirectionForLocale } from "@/lib/i18n"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const direction = getDirectionForLocale(locale)

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale} dir={direction}>
        <AppProviders>{children}</AppProviders>
      </div>
    </NextIntlClientProvider>
  )
}
