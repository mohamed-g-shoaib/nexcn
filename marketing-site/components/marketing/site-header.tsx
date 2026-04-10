"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

import ForgeLogo from "@/components/marketing/forge-logo"
import { useUiSound } from "@/hooks/use-ui-sound"

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme()
  const { playSound } = useUiSound()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    playSound(nextTheme === "dark" ? "switch-off" : "switch-on")
  }

  return (
    <header className="flex items-center justify-between">
      {/* Logo + Brand lockup */}
      <div className="flex items-center gap-2.5">
        <ForgeLogo className="size-7" aria-hidden="true" />
        <span className="text-lg font-semibold tracking-tight text-foreground">Forge</span>
      </div>

      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-[background-color,color,transform] duration-150 ease-out hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.96] sm:size-8"
        aria-label="Toggle theme"
      >
        <span className="relative block size-4">
          <SunIcon
            className={[
              "absolute inset-0 size-4 transition-[opacity,transform,filter] duration-200 [transition-timing-function:cubic-bezier(0.2,0,0,1)]",
              mounted && resolvedTheme === "dark"
                ? "scale-[0.25] opacity-0 blur-[4px]"
                : "scale-100 opacity-100 blur-0",
            ].join(" ")}
            aria-hidden="true"
          />
          <MoonIcon
            className={[
              "absolute inset-0 size-4 transition-[opacity,transform,filter] duration-200 [transition-timing-function:cubic-bezier(0.2,0,0,1)]",
              mounted && resolvedTheme === "dark"
                ? "scale-100 opacity-100 blur-0"
                : "scale-[0.25] opacity-0 blur-[4px]",
            ].join(" ")}
            aria-hidden="true"
          />
        </span>
      </button>
    </header>
  )
}
