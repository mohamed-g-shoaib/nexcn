"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { useLocale } from "@/hooks/use-locale"

export function StarterShell() {
  const { direction, messages } = useLocale()

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {messages.eyebrow}
            </p>
            <h1 className="max-w-sm text-balance text-xl font-medium tracking-tight text-foreground">
              {messages.heading}
            </h1>
            <p className="max-w-sm text-pretty text-sm leading-6 text-muted-foreground">
              {messages.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2" dir={direction}>
            <ThemeToggle />
          </div>
        </div>
      </section>
    </main>
  )
}
