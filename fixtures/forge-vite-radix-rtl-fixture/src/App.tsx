import { Navigate, Route, Routes, useParams } from "react-router"

import { StarterShell } from "@/components/starter-shell"
import { defaultLocale, isLocale } from "@/lib/i18n"

function LocaleStarterPage() {
  const params = useParams()

  if (!isLocale(params.locale)) {
    return <Navigate replace to={`/${defaultLocale}`} />
  }

  return <StarterShell />
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={`/${defaultLocale}`} />} />
      <Route path="/:locale" element={<LocaleStarterPage />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}
