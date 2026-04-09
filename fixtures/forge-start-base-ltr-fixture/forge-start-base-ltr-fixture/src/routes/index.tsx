import { createFileRoute } from "@tanstack/react-router"

import { StarterShell } from "@/components/starter-shell"

export const Route = createFileRoute("/")({
  component: Page,
})

function Page() {
  return <StarterShell />
}
