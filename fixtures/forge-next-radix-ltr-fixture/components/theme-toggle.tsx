"use client"

import { MoonStarIcon, SunMediumIcon } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-locale"
import { useUiSound } from "@/hooks/use-ui-sound"

export function ThemeToggle() {
  const { mounted, resolvedTheme, setTheme } = useTheme()
  const { messages } = useLocale()
  const { playSound } = useUiSound()

  const isDark = resolvedTheme === "dark"
  const nextThemeLabel = !mounted
    ? messages.themeToggleFallbackLabel
    : isDark
      ? messages.themeToggleToLightLabel
      : messages.themeToggleToDarkLabel

  function handleToggle() {
    if (!mounted) {
      return
    }

    const nextTheme = isDark ? "light" : "dark"

    setTheme(nextTheme)
    playSound(nextTheme === "dark" ? "switch-off" : "switch-on")
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={nextThemeLabel}
      className="h-9 rounded-full px-3"
      onClick={handleToggle}
    >
      <span className="relative me-1.5 size-4">
        <span
          className={[
            "absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-out",
            !mounted || !isDark
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.25] opacity-0 blur-[4px]",
          ].join(" ")}
        >
          <SunMediumIcon aria-hidden="true" />
        </span>
        <span
          className={[
            "absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-out",
            mounted && isDark
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.25] opacity-0 blur-[4px]",
          ].join(" ")}
        >
          <MoonStarIcon aria-hidden="true" />
        </span>
      </span>
      {nextThemeLabel}
    </Button>
  )
}
