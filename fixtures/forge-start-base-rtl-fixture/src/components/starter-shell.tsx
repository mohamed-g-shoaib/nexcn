import { useTranslation } from "react-i18next"

import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouteLocale } from "@/hooks/use-route-locale"

export function StarterShell() {
  const { t } = useTranslation()
  const { direction } = useRouteLocale()

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-start">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {t("StarterShell.eyebrow")}
            </p>
            <h1 className="max-w-sm text-balance text-xl font-medium tracking-tight text-foreground">
              {t("StarterShell.heading")}
            </h1>
            <p className="max-w-sm text-pretty text-sm leading-6 text-muted-foreground">
              {t("StarterShell.description")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2" dir={direction}>
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </section>
    </main>
  )
}
