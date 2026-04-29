"use client"

import { FallbackActions } from "@/components/fallback-actions"
import { ErrorView } from "@/components/error-view"

export default function RouteErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorView
      title="Something went wrong."
      description="An unexpected error occurred. Please try again."
      action={
        <FallbackActions homeHref="/" homeLabel="Go home" retryLabel="Try again" onRetry={reset} />
      }
    />
  )
}
