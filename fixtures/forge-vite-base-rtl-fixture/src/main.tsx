import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"

import "./index.css"
import "./i18n/config"
import App from "./App"
import { AppErrorBoundary } from "@/components/app-error-boundary"
import { AppProviders } from "@/components/app-providers"

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error('Expected the Vite root element with id="root".')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
)
