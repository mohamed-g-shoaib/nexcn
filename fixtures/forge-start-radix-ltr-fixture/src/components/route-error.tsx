import { FallbackActions } from "@/components/fallback-actions"
import { FallbackScreen } from "@/components/fallback-screen"

type RouteErrorProps = {
  onRetry?: () => void
}

export function RouteError({ onRetry }: RouteErrorProps) {
  return (
    <FallbackScreen
      title="Something went wrong."
      description="An unexpected error occurred. Please try again."
      action={
        onRetry ? (
          <FallbackActions
            homeHref="/"
            homeLabel="Go home"
            retryLabel="Try again"
            onRetry={onRetry}
          />
        ) : null
      }
    />
  )
}
