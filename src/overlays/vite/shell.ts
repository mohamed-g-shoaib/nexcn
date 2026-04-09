import { getThemeBootstrapScript } from "../shared/theme-bootstrap.js";

export function getIndexHtmlTemplate(projectName: string): string {
  return `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark light" />
    <script>${getThemeBootstrapScript()}</script>
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

export function getMainTemplate(rtl: boolean): string {
  if (!rtl) {
    return `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App";
import { AppProviders } from "@/components/app-providers";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Expected the Vite root element with id="root".');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
`;
  }

  return `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import "./index.css";
import App from "./App";
import { AppProviders } from "@/components/app-providers";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Expected the Vite root element with id="root".');
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
);
`;
}

export function getViteConfigTemplate(rtl: boolean): string {
  const vendorDependencies = rtl ? '["react", "react-dom", "react-router"]' : '["react", "react-dom"]';

  return `import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ${vendorDependencies},
  },
  server: {
    port: 3000,
    hmr: {
      overlay: true,
    },
  },
});
`;
}
