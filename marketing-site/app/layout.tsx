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
      <body className={cn("antialiased", "font-sans", geist.variable, fontMono.variable)}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
