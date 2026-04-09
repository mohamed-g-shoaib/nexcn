"use client"

import { CheckIcon, CopyIcon } from "lucide-react"
import * as React from "react"

import { StackMarks } from "@/components/marketing/stack-pill"
import { Button } from "@/components/ui/button"
import { useUiSound } from "@/hooks/use-ui-sound"
import {
  DEFAULT_OPTIONS,
  OPTION_GROUPS,
  PACKAGE_MANAGERS,
  type MarketingOptions,
  type PackageManager,
  type StackVisual,
  buildCommand,
} from "@/lib/marketing"

/**
 * A group of option toggles — ghost at rest, outline when selected.
 * Stack icons appear before labels where available.
 */
function OptionRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly { value: string; label: string; icons?: readonly StackVisual[] }[]
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <Button
            key={option.value}
            type="button"
            size="sm"
            variant={option.value === value ? "outline" : "ghost"}
            className="gap-2"
            onClick={() => onChange(option.value)}
          >
            {option.icons && option.icons.length > 0 ? (
              <StackMarks icons={option.icons} className="shrink-0" />
            ) : null}
            <span>{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

export function InstallHelper() {
  const [packageManager, setPackageManager] = React.useState<PackageManager>("pnpm")
  const [options, setOptions] = React.useState<MarketingOptions>(DEFAULT_OPTIONS)
  const [copied, setCopied] = React.useState(false)
  const { playSound } = useUiSound()

  const activePackageManager =
    PACKAGE_MANAGERS.find((option) => option.value === packageManager) ?? PACKAGE_MANAGERS[0]

  const command = React.useMemo(
    () => buildCommand(packageManager, options),
    [options, packageManager],
  )

  async function handleCopy() {
    await navigator.clipboard.writeText(command)
    setCopied(true)
    playSound("click-soft")
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <section className="flex flex-col gap-8">
      {/* Section label */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Install helper
        </p>
        <h2 className="text-lg font-medium tracking-tight text-foreground">
          Pick the starter, then copy the command.
        </h2>
      </div>

      <div className="flex flex-col gap-10">
        {/* Option groups — all options laid out in labeled rows */}
        <div className="flex flex-col gap-6 sm:gap-5">
          {OPTION_GROUPS.map((group) => (
            <OptionRow
              key={group.key}
              label={group.label}
              value={options[group.key]}
              options={
                group.options as readonly {
                  value: string
                  label: string
                  icons?: readonly StackVisual[]
                }[]
              }
              onChange={(value) => {
                setOptions((current) => ({
                  ...current,
                  [group.key]: value as MarketingOptions[typeof group.key],
                }))
                playSound("click-soft")
              }}
            />
          ))}
        </div>

        {/* Command surface */}
        <div className="marketing-command-surface">
          {/* Tab bar with PM icons */}
          <div className="marketing-command-header">
            {/* Active PM icon */}
            <div className="flex h-11 shrink-0 items-center">
              {activePackageManager.icons ? (
                <StackMarks icons={activePackageManager.icons} />
              ) : null}
            </div>

            {/* PM tabs */}
            <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
              {PACKAGE_MANAGERS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="marketing-command-tab"
                  data-active={option.value === packageManager}
                  onClick={() => {
                    setPackageManager(option.value as PackageManager)
                    playSound("click-soft")
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Copy button */}
            <button type="button" className="marketing-command-copy" onClick={handleCopy}>
              {copied ? (
                <CheckIcon aria-hidden="true" className="size-4" />
              ) : (
                <CopyIcon aria-hidden="true" className="size-4" />
              )}
              <span className="sr-only">{copied ? "Copied" : "Copy command"}</span>
            </button>
          </div>

          {/* Command output */}
          <pre className="marketing-command-code">
            <code className="font-mono">
              <span className="marketing-command-prompt">$</span>
              {command}
            </code>
          </pre>
        </div>
      </div>
    </section>
  )
}
