import { FallbackScreen } from "@/components/fallback-screen"

export default function NotFound() {
  return (
    <FallbackScreen
      title="Page not found."
      description="This route does not exist yet."
    />
  )
}
