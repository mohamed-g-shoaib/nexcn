"use client"

import "./globals.css"

import { ErrorView } from "@/components/error-view"
import { Geist, Geist_Mono } from "next/font/google"

import { cn } from "@/lib/utils"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body
        className={cn("antialiased", "font-sans", geist.variable, fontMono.variable)}
        suppressHydrationWarning
      >
        <ErrorView onRetry={reset} />
      </body>
    </html>
  )
}
