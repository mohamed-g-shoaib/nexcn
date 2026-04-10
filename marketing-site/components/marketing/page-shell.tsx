"use client"

import * as React from "react"

import { Header } from "@/components/marketing/header"
import { InstallHelper } from "@/components/marketing/install-helper"
import { SiteHeader } from "@/components/marketing/site-header"

export function PageShell() {
  const [mounted, setMounted] = React.useState(false)
  const [shouldAnimate, setShouldAnimate] = React.useState(false)
  const [reduceMotion, setReduceMotion] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReduceMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener("change", updatePreference)

    return () => {
      mediaQuery.removeEventListener("change", updatePreference)
    }
  }, [])

  React.useEffect(() => {
    if (mounted && !reduceMotion) {
      const timeoutId = window.setTimeout(() => {
        setShouldAnimate(true)
      }, 100)
      return () => window.clearTimeout(timeoutId)
    }
  }, [mounted, reduceMotion])

  const animate = mounted && !reduceMotion

  return (
    <main className="min-h-svh px-6 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-16 sm:gap-20">
        <div className="flex flex-col gap-12">
          <div
            className="marketing-page-item"
            data-animate={animate ? "true" : "false"}
            data-ready={shouldAnimate ? "true" : "false"}
            style={shouldAnimate ? { animationDelay: "0ms" } : undefined}
          >
            <SiteHeader />
          </div>
          <div
            className="marketing-page-item"
            data-animate={animate ? "true" : "false"}
            data-ready={shouldAnimate ? "true" : "false"}
            style={shouldAnimate ? { animationDelay: "80ms" } : undefined}
          >
            <Header />
          </div>
        </div>
        <div
          className="marketing-page-item"
          data-animate={animate ? "true" : "false"}
          data-ready={shouldAnimate ? "true" : "false"}
          style={shouldAnimate ? { animationDelay: "160ms" } : undefined}
        >
          <InstallHelper />
        </div>
      </div>
    </main>
  )
}
