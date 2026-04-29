"use client"

import type { Direction } from "@/lib/i18n"

import { FallbackScreen } from "@/components/fallback-screen"

type ErrorViewProps = {
  eyebrow?: string
  locale?: string
  direction?: Direction
  title?: string
  description?: string
  action?: React.ReactNode
}

export function ErrorView({
  eyebrow,
  locale,
  direction,
  title = "Something went wrong.",
  description = "An unexpected error occurred. Please try again.",
  action,
}: ErrorViewProps) {
  return (
    <FallbackScreen
      eyebrow={eyebrow}
      locale={locale}
      direction={direction}
      title={title}
      description={description}
      action={action}
    />
  )
}
