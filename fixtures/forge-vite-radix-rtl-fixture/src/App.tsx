import { Navigate, Route, Routes } from "react-router"

import { defaultLocale } from "@/lib/i18n"
import { LocaleStarterPage } from "@/routes/locale-starter-page"
import { NotFoundScreen } from "@/routes/not-found-screen"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={`/${defaultLocale}`} />} />
      <Route path="/:locale" element={<LocaleStarterPage />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}
