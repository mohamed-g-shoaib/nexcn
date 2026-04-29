import { Button } from "@/components/ui/button"
import { useUiSound } from "@/hooks/use-ui-sound"

type FallbackActionsProps = {
  homeHref: string
  homeLabel: string
  retryLabel?: string
  onRetry?: () => void
}

export function FallbackActions({
  homeHref,
  homeLabel,
  retryLabel,
  onRetry,
}: FallbackActionsProps) {
  const { playSound } = useUiSound()

  return (
    <>
      {onRetry && retryLabel ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-full px-3"
          onClick={() => {
            playSound("click-soft")
            onRetry()
          }}
        >
          {retryLabel}
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-full px-3"
        onClick={() => {
          playSound("click-soft")
          window.setTimeout(() => {
            window.location.assign(homeHref)
          }, 100)
        }}
      >
        {homeLabel}
      </Button>
    </>
  )
}
