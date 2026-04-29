import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"

export default function NotFound() {
  return (
    <FallbackScreen
      title="Page not found."
      description="This route does not exist yet."
      action={<FallbackActions homeHref="/" homeLabel="Go home" />}
    />
  )
}
