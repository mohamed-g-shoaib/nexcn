import { LanguagesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-locale"
import { useUiSound } from "@/hooks/use-ui-sound"

export function LanguageToggle() {
  const { messages, switchLocale } = useLocale()
  const { playSound } = useUiSound()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={messages.languageLabel}
      className="h-9 rounded-full px-3"
      onClick={() => {
        playSound("click-soft")
        switchLocale()
      }}
    >
      <LanguagesIcon data-icon="inline-start" aria-hidden="true" />
      {messages.languageLabel}
    </Button>
  )
}
