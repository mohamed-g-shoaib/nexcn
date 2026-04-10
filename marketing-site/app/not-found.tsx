"use client"

import { Button } from "@/components/ui/button"
import { FallbackScreen } from "@/components/fallback-screen"
import { useUiSound } from "@/hooks/use-ui-sound"

export default function NotFound() {
  const { playSound } = useUiSound()

  function handleGoHome() {
    playSound("click-soft")
    setTimeout(() => {
      window.location.href = "/"
    }, 100)
  }

  return (
    <FallbackScreen
      title="Page not found."
      description="This route does not exist yet."
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 px-3"
          onClick={handleGoHome}
        >
          Go home
        </Button>
      }
    />
  )
}
