import path from "node:path"
import { fileURLToPath } from "node:url"
import createNextIntlPlugin from "next-intl/plugin"

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))

/** @type {import("next").NextConfig} */
const nextConfig = {
  turbopack: {
    root: currentDirectory,
  },
}

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

export default withNextIntl(nextConfig)
