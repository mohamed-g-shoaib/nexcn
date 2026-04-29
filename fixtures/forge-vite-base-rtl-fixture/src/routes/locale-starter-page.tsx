import { Navigate, useParams } from "react-router"

import { StarterShell } from "@/components/starter-shell"
import { defaultLocale, isLocale } from "@/lib/i18n"

export function LocaleStarterPage() {
  const params = useParams()

  if (!isLocale(params.locale)) {
    return <Navigate replace to={`/${defaultLocale}`} />
  }

  return <StarterShell />
}
