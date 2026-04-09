"use client"

import * as React from "react"

import { useSound } from "@/hooks/use-sound"
import { clickSoftSound } from "@/sounds/click-soft"
import { switchOffSound } from "@/sounds/switch-off"
import { switchOnSound } from "@/sounds/switch-on"

export type UiSoundName = "click-soft" | "switch-on" | "switch-off"

type UiSoundApi = {
  playSound: (sound: UiSoundName) => void
  soundEnabled: boolean
}

const DEFAULT_SOUND_ENABLED = true

export function useUiSound(): UiSoundApi {
  const soundEnabled = React.useMemo(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SOUND_ENABLED
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false
    }

    return DEFAULT_SOUND_ENABLED
  }, [])

  const [playClickSoft] = useSound(clickSoftSound, {
    volume: 0.26,
    interrupt: true,
    soundEnabled,
  })
  const [playSwitchOff] = useSound(switchOffSound, {
    volume: 0.28,
    interrupt: true,
    soundEnabled,
  })
  const [playSwitchOn] = useSound(switchOnSound, {
    volume: 0.28,
    interrupt: true,
    soundEnabled,
  })

  const playSound = React.useCallback(
    (sound: UiSoundName) => {
      if (sound === "click-soft") {
        playClickSoft()
        return
      }

      if (sound === "switch-on") {
        playSwitchOn()
        return
      }

      playSwitchOff()
    },
    [playClickSoft, playSwitchOff, playSwitchOn],
  )

  return {
    playSound,
    soundEnabled,
  }
}
