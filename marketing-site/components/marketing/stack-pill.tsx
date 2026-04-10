import { BaseUI } from "@/components/marketing/icons/base"
import { Biomejs } from "@/components/marketing/icons/biome"
import { Bun } from "@/components/marketing/icons/bun"
import { ESLint } from "@/components/marketing/icons/eslint"
import { Nextjs } from "@/components/marketing/icons/next"
import { NPM } from "@/components/marketing/icons/npm"
import { Oxc } from "@/components/marketing/icons/oxc"
import { Pnpm } from "@/components/marketing/icons/pnpm"
import { Prettier } from "@/components/marketing/icons/prettier"
import { RadixUI } from "@/components/marketing/icons/radix"
import { TanStack } from "@/components/marketing/icons/tanstack"
import { Vite } from "@/components/marketing/icons/vite"
import { Yarn } from "@/components/marketing/icons/yarn"
import { type StackVisual } from "@/lib/marketing"
import { cn } from "@/lib/utils"

const STACK_ICONS = {
  base: BaseUI,
  biome: Biomejs,
  bun: Bun,
  eslint: ESLint,
  next: Nextjs,
  npm: NPM,
  oxc: Oxc,
  pnpm: Pnpm,
  prettier: Prettier,
  radix: RadixUI,
  tanstack: TanStack,
  vite: Vite,
  yarn: Yarn,
} as const

function StackGlyph({ icon, className }: { icon: StackVisual; className?: string }) {
  const Icon = STACK_ICONS[icon]

  return <Icon aria-hidden="true" className={cn("size-4 shrink-0", className)} />
}

export function StackMarks({
  icons,
  className,
}: {
  icons: readonly StackVisual[]
  className?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-foreground/85", className)}>
      {icons.map((icon) => (
        <StackGlyph key={icon} icon={icon} />
      ))}
    </span>
  )
}

export function StackPill({
  label,
  icons,
  className,
}: {
  label: string
  icons: readonly StackVisual[]
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-sm tracking-[-0.01em] text-muted-foreground",
        className,
      )}
    >
      <StackMarks icons={icons} />
      <span className="text-foreground/82">{label}</span>
    </span>
  )
}
