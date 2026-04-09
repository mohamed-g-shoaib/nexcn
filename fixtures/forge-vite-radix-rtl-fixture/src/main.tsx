import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"

import "./index.css"
import App from "./App"
import { AppProviders } from "@/components/app-providers"

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error('Expected the Vite root element with id="root".')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
)
