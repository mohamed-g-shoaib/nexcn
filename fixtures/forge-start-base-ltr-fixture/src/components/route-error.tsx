import { useLocation, useNavigate } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { FallbackScreen } from "@/components/fallback-screen"
import { useUiSound } from "@/hooks/use-ui-sound"

type RouteErrorProps = {
  onRetry?: () => void
}

export function RouteError({ onRetry }: RouteErrorProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { playSound } = useUiSound()
  const copy =
    location.pathname.split("/").filter(Boolean)[0] === "ar"
      ? {
          title: "حدث خطأ ما.",
          description: "حدث خطأ غير متوقع أثناء تحميل الواجهة المولدة.",
          backLabel: "الرجوع",
          homeLabel: "العودة للرئيسية",
          retryLabel: "أعد المحاولة",
        }
      : {
          title: "Something went wrong.",
          description: "An unexpected error interrupted the generated starter.",
          backLabel: "Go back",
          homeLabel: "Go home",
          retryLabel: "Try again",
        }
  const segments = location.pathname.split("/").filter(Boolean)
  const homeHref =
    segments.length > 0 && (segments[0] === "en" || segments[0] === "ar") ? `/${segments[0]}` : "/"

  return (
    <FallbackScreen
      title={copy.title}
      description={copy.description}
      action={
        onRetry ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-full px-3"
              onClick={() => {
                playSound("click-soft")
                window.history.back()
              }}
            >
              {copy.backLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-full px-3"
              onClick={() => {
                playSound("click-soft")
                navigate({ to: homeHref })
              }}
            >
              {copy.homeLabel}
            </Button>
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
              {copy.retryLabel}
            </Button>
          </>
        ) : null
      }
    />
  )
}
