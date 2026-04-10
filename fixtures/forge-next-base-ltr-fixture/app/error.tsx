"use client"

import { ErrorView } from "@/components/error-view"

export default function RouteErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorView onRetry={reset} />
}
