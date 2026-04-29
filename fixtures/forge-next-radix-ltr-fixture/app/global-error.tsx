"use client"

import "./globals.css"

import * as React from "react"
import { Geist, Geist_Mono } from "next/font/google"

import { ErrorView } from "@/components/error-view"
import { FallbackActions } from "@/components/fallback-actions"
import { type Direction } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

type LocaleCopy = {
  locale: "en" | "ar"
  direction: Direction
  eyebrow: string
  title: string
  description: string
  homeLabel: string
  retryLabel: string
  homeHref: string
}

const ENGLISH_COPY: LocaleCopy = {
  locale: "en",
  direction: "ltr",
  eyebrow: "Forge",
  title: "Something went wrong.",
  description: "An unexpected error occurred. Please try again.",
  homeLabel: "Go home",
  retryLabel: "Try again",
  homeHref: "/en",
}

const ARABIC_COPY: LocaleCopy = {
  locale: "ar",
  direction: "rtl",
  eyebrow: "فورج",
  title: "حدث خطأ ما.",
  description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
  homeLabel: "العودة للرئيسية",
  retryLabel: "أعد المحاولة",
  homeHref: "/ar",
}

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [copy, setCopy] = React.useState<LocaleCopy>(ENGLISH_COPY)

  React.useEffect(() => {
    setCopy(document.documentElement.lang === "ar" ? ARABIC_COPY : ENGLISH_COPY)
  }, [])

  return (
    <html lang={copy.locale} dir={copy.direction} suppressHydrationWarning>
      <body
        className={cn("antialiased", "font-sans", geist.variable, fontMono.variable)}
        suppressHydrationWarning
      >
        <ErrorView
          eyebrow={copy.eyebrow}
          locale={copy.locale}
          direction={copy.direction}
          title={copy.title}
          description={copy.description}
          action={
            <FallbackActions
              homeHref={copy.homeHref}
              homeLabel={copy.homeLabel}
              retryLabel={copy.retryLabel}
              onRetry={reset}
            />
          }
        />
      </body>
    </html>
  )
}
