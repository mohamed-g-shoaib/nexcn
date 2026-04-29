"use client"

import { ThemeToggle } from "@/components/theme-toggle"

const COPY = {
  eyebrow: "Forge",
  heading: "Your starter is ready to customize.",
  description:
    "Replace this screen in app/page.tsx. Edit components/ for UI pieces, or app-providers.tsx for theme and shared app behavior.",
} as const

export function StarterShell() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-start">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {COPY.eyebrow}
            </p>
            <h1 className="max-w-sm text-balance text-xl font-medium tracking-tight text-foreground">
              {COPY.heading}
            </h1>
            <p className="max-w-sm text-pretty text-sm leading-6 text-muted-foreground">
              {COPY.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </section>
    </main>
  )
}
