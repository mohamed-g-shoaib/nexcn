import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"

import "./globals.css"
import { AppProviders } from "@/components/app-providers"
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

export const metadata: Metadata = {
  metadataBase: new URL("https://forgedx.vercel.app"),
  title: "Forge - Generate minimal React starters with real app structure",
  description:
    "Forge generates minimal starters with theme support, RTL, and your choice of code quality tools like ESLint or Biome. Choose Next.js, Vite, or TanStack Start with Base UI or Radix UI.",
  keywords: [
    "React starter",
    "Next.js starter",
    "Vite starter",
    "TanStack Start",
    "React boilerplate",
    "shadcn starter",
    "Base UI",
    "Radix UI",
    "React generator",
    "minimal starter",
    "RTL support",
    "ESLint",
    "Biome",
    "Oxlint",
  ],
  authors: [{ name: "Forge" }],
  creator: "Forge",
  publisher: "Forge",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://forgedx.vercel.app",
    siteName: "Forge",
    title: "Forge - Generate minimal React starters with real app structure",
    description:
      "Forge generates minimal starters with theme support, RTL, and your choice of code quality tools like ESLint or Biome.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forge - Generate minimal React starters with real app structure",
    description:
      "Forge generates minimal starters with theme support, RTL, and your choice of code quality tools like ESLint or Biome.",
  },
}

function getThemeFromCookie(value: string | undefined): ThemeCookieValue {
  if (value === "dark" || value === "light" || value === "system") {
    return value
  }

  return "system"
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const storedTheme = getThemeFromCookie(cookieStore.get("forge-theme")?.value)
  const initialThemeClass = storedTheme === "system" ? undefined : storedTheme
  const initialColorScheme = storedTheme === "system" ? undefined : storedTheme

  return (
    <html
      lang="en"
      dir="ltr"
      className={initialThemeClass}
      style={initialColorScheme ? { colorScheme: initialColorScheme } : undefined}
      suppressHydrationWarning
    >
      <body
        className={cn("antialiased", "font-sans", geist.variable, fontMono.variable)}
        suppressHydrationWarning
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
