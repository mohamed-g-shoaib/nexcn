import { createFileRoute, redirect } from "@tanstack/react-router"

import { defaultLocale } from "@/lib/i18n"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/$locale",
      params: {
        locale: defaultLocale,
      },
    })
  },
})
