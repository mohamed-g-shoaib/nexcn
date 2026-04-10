"use client"

import { Button } from "@/components/ui/button"
import { FallbackScreen } from "@/components/fallback-screen"

type ErrorViewProps = {
  onRetry?: () => void
}

export function ErrorView({ onRetry }: ErrorViewProps) {
  return (
    <FallbackScreen
      title="Something went wrong."
      description="An unexpected error occurred. Please try again."
      action={
        onRetry ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full px-3"
            onClick={onRetry}
          >
            Try again
          </Button>
        ) : null
      }
    />
  )
}
