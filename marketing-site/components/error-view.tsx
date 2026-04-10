"use client"

import { Button } from "@/components/ui/button"
import { FallbackScreen } from "@/components/fallback-screen"
import { useUiSound } from "@/hooks/use-ui-sound"

type ErrorViewProps = {
  onRetry?: () => void
}

export function ErrorView({ onRetry }: ErrorViewProps) {
  const { playSound } = useUiSound()

  function handleGoHome() {
    playSound("click-soft")
    setTimeout(() => {
      window.location.href = "/"
    }, 100)
  }

  function handleRetry() {
    playSound("click-soft")
    if (onRetry) {
      onRetry()
    }
  }

  return (
    <FallbackScreen
      title="Something went wrong."
      description="An unexpected error interrupted the page."
      action={
        <div className="flex flex-wrap items-center gap-2">
          {onRetry ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 px-3"
              onClick={handleRetry}
            >
              Try again
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 px-3"
            onClick={handleGoHome}
          >
            Go home
          </Button>
        </div>
      }
    />
  )
}
