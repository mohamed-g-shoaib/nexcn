import { Route, Routes } from "react-router"

import { NotFoundScreen } from "@/routes/not-found-screen"
import { StarterShell } from "@/components/starter-shell"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StarterShell />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}
