import {
  HeadContent,
  ScriptOnce,
  Scripts,
  createRootRoute,
  useParams,
} from "@tanstack/react-router"
import appCss from "../styles.css?url"
import type * as React from "react"
import { AppProviders } from "@/components/app-providers"
import { defaultLocale, getDirectionForLocale, isLocale } from "@/lib/i18n"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "forge-start-radix-rtl-fixture",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundScreen,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const params = useParams({ strict: false })
  const locale = isLocale(params.locale) ? params.locale : defaultLocale
  const direction = getDirectionForLocale(locale)

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />
        <HeadContent />
      </head>
      <body className="min-h-svh bg-background font-sans text-foreground antialiased">
        <ScriptOnce>
          {
            '(function(){try{var root=document.documentElement;var stored=localStorage.getItem("theme");var theme=stored==="light"||stored==="dark"||stored==="system"?stored:"system";var resolved=theme==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):theme;root.classList.remove("light","dark");root.classList.add(resolved);root.style.colorScheme=resolved;}catch(_error){}})();'
          }
        </ScriptOnce>
        <AppProviders locale={locale}>{children}</AppProviders>
        <Scripts />
      </body>
    </html>
  )
}

function NotFoundScreen() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Forge
          </p>
          <h1 className="text-xl font-medium tracking-tight">Page not found.</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            This route does not exist in the generated starter yet.
          </p>
        </div>
      </section>
    </main>
  )
}
