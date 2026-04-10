"use client"

import { AlertCircleIcon, CheckCircle2Icon, CheckIcon, CopyIcon } from "lucide-react"
import * as React from "react"

import { StackMarks } from "@/components/marketing/stack-pill"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUiSound } from "@/hooks/use-ui-sound"
import {
  DEFAULT_OPTIONS,
  OPTION_GROUPS,
  PACKAGE_MANAGERS,
  type MarketingOptions,
  type PackageManager,
  type StackVisual,
  buildCommand,
  buildCreateCommand,
} from "@/lib/marketing"
import { validateProjectName } from "@/lib/project-name"

type CreateFlowLine = {
  kind: "command" | "prompt" | "status"
  text: string
  prefix?: string
  answer?: string
}

function getCreateFlowLines(createCommand: string): readonly CreateFlowLine[] {
  return [
    { kind: "command", prefix: "$", text: createCommand },
    { kind: "prompt", prefix: "?", text: "What should the project be called?", answer: "my-app" },
    {
      kind: "prompt",
      prefix: "?",
      text: "Which framework do you want to use?",
      answer: "Next.js",
    },
    {
      kind: "prompt",
      prefix: "?",
      text: "Which UI Primitives library do you want to use?",
      answer: "Base UI",
    },
    { kind: "prompt", prefix: "?", text: "Do you want RTL + Arabic support?", answer: "No" },
    {
      kind: "prompt",
      prefix: "?",
      text: "Which linter & formatter setup do you want to use?",
      answer: "Biome",
    },
    { kind: "status", prefix: "✓", text: "Scaffolded and ready to verify" },
  ] as const
}

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

function CreateFlowPreview({
  active,
  createCommand,
}: {
  active: boolean
  createCommand: string
}) {
  const lines = React.useMemo(() => getCreateFlowLines(createCommand), [createCommand])
  const [reduceMotion, setReduceMotion] = React.useState(false)
  const [shouldAnimate, setShouldAnimate] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReduceMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener("change", updatePreference)

    return () => {
      mediaQuery.removeEventListener("change", updatePreference)
    }
  }, [])

  React.useEffect(() => {
    if (!active || !containerRef.current) {
      setShouldAnimate(false)
      return
    }

    if (reduceMotion) {
      setShouldAnimate(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldAnimate(true)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "-100px 0px",
      },
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [active, reduceMotion])

  return (
    <div ref={containerRef} className="marketing-terminal-container">
      <div className="marketing-terminal-shell" aria-hidden="true">
        <div className="marketing-terminal-header">
          <div className="marketing-terminal-controls">
            <span className="marketing-terminal-control" data-color="red" />
            <span className="marketing-terminal-control" data-color="yellow" />
            <span className="marketing-terminal-control" data-color="green" />
          </div>
          <div className="marketing-terminal-title">forge setup mock</div>
          <div className="marketing-terminal-controls-spacer" />
        </div>

        <div className="marketing-terminal-content">
          {lines.map((line, index) => (
            <div
              key={`${line.kind}-${index}`}
              className="marketing-terminal-line"
              style={
                shouldAnimate
                  ? {
                      animationDelay: `${index * 80}ms`,
                    }
                  : undefined
              }
              data-animate={shouldAnimate ? "true" : undefined}
            >
              {line.prefix ? (
                <span className="marketing-terminal-prefix" data-kind={line.kind}>
                  {line.prefix}
                </span>
              ) : null}
              <span className="marketing-terminal-text" data-kind={line.kind}>
                {line.text}
                {line.answer ? (
                  <span className="marketing-terminal-answer">{line.answer}</span>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CommandSurface({
  command,
  copied,
  onCopy,
  copyLabel,
  packageManager,
  onPackageManagerChange,
  copyDisabled = false,
}: {
  command: string
  copied: boolean
  onCopy: () => void
  copyLabel: string
  packageManager: PackageManager
  onPackageManagerChange: (value: PackageManager) => void
  copyDisabled?: boolean
}) {
  const activePackageManager =
    PACKAGE_MANAGERS.find((option) => option.value === packageManager) ?? PACKAGE_MANAGERS[0]

  return (
    <div className="marketing-command-surface">
      <div className="marketing-command-header">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-11 shrink-0 items-center">
            {activePackageManager.icons ? <StackMarks icons={activePackageManager.icons} /> : null}
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {PACKAGE_MANAGERS.map((option) => (
              <button
                key={option.value}
                type="button"
                className="marketing-command-tab"
                data-active={option.value === packageManager}
                onClick={() => onPackageManagerChange(option.value as PackageManager)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="marketing-command-copy"
          onClick={onCopy}
          disabled={copyDisabled}
          aria-disabled={copyDisabled}
        >
          {copied ? (
            <CheckIcon aria-hidden="true" className="size-4" />
          ) : (
            <CopyIcon aria-hidden="true" className="size-4" />
          )}
          <span className="sr-only">{copied ? "Copied" : copyLabel}</span>
        </button>
      </div>
      <pre className="marketing-command-code">
        <code className="font-mono tracking-[-0.01em]">
          <span className="marketing-command-prompt">$</span>
          {command}
        </code>
      </pre>
    </div>
  )
}

export function InstallHelper() {
  const [mode, setMode] = React.useState<"create" | "forge">("create")
  const [packageManager, setPackageManager] = React.useState<PackageManager>("pnpm")
  const [options, setOptions] = React.useState<MarketingOptions>(DEFAULT_OPTIONS)
  const [projectName, setProjectName] = React.useState("my-app")
  const [copiedMode, setCopiedMode] = React.useState<"create" | "forge" | null>(null)
  const { playSound } = useUiSound()

  const projectNameValidation = React.useMemo(
    () => validateProjectName(projectName),
    [projectName],
  )

  const commandProjectName = projectNameValidation.normalized || "my-app"
  const command = React.useMemo(
    () => buildCommand(packageManager, options, commandProjectName),
    [commandProjectName, options, packageManager],
  )
  const createCommand = React.useMemo(() => buildCreateCommand(packageManager), [packageManager])

  async function handleCopy(target: "create" | "forge") {
    if (target === "forge" && !projectNameValidation.valid) {
      return
    }

    await navigator.clipboard.writeText(target === "create" ? createCommand : command)
    setCopiedMode(target)
    playSound("click-soft")
    window.setTimeout(() => setCopiedMode(null), 1400)
  }

  function handlePackageManagerChange(value: PackageManager) {
    setPackageManager(value)
    setCopiedMode(null)
    playSound("click-soft")
  }

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Install helper
        </p>
        <h2 className="text-lg font-medium tracking-tight text-foreground">
          How do you want to forge your app?
        </h2>
      </div>

      <Tabs
        value={mode}
        onValueChange={(value) => {
          setMode(value as "create" | "forge")
          setCopiedMode(null)
          playSound("click-soft")
        }}
        className="gap-6"
      >
        <TabsList variant="line" className="gap-6 p-0">
          <TabsTrigger value="create" className="px-0 text-sm data-active:border-transparent">
            CLI create
          </TabsTrigger>
          <TabsTrigger value="forge" className="px-0 text-sm data-active:border-transparent">
            Forge command
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="flex flex-col gap-4">
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Start with the initializer and let Forge guide the setup in your terminal.
          </p>

          <CommandSurface
            command={createCommand}
            copied={copiedMode === "create"}
            onCopy={() => handleCopy("create")}
            copyLabel="Copy create command"
            packageManager={packageManager}
            onPackageManagerChange={handlePackageManagerChange}
          />

          <CreateFlowPreview active={mode === "create"} createCommand={createCommand} />
        </TabsContent>

        <TabsContent value="forge" className="flex flex-col gap-4">
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Build the full command up front when you want explicit framework, UI primitives, RTL
            support, and formatter or linter choices.
          </p>

          <div className="flex flex-col gap-3">
            <label
              htmlFor="marketing-project-name"
              className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
            >
              App name
            </label>
            <div className="flex flex-col gap-2.5">
              <input
                id="marketing-project-name"
                name="projectName"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={projectName}
                onChange={(event) => {
                  setProjectName(event.target.value)
                  setCopiedMode(null)
                }}
                aria-invalid={!projectNameValidation.valid}
                className={[
                  "h-12 w-full rounded-xl border bg-card px-4 font-mono text-[0.95rem] tracking-[-0.01em] text-foreground outline-none",
                  "shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-[border-color,box-shadow,background-color]",
                  "placeholder:text-muted-foreground/70 focus-visible:ring-0",
                  projectNameValidation.valid
                    ? "border-border/90 focus-visible:border-ring focus-visible:shadow-[0_0_0_1px_color-mix(in_oklch,var(--ring)_50%,transparent),0_1px_2px_rgba(0,0,0,0.05)]"
                    : "border-destructive/55 focus-visible:border-destructive focus-visible:shadow-[0_0_0_1px_color-mix(in_oklch,var(--destructive)_40%,transparent),0_1px_2px_rgba(0,0,0,0.05)]",
                ].join(" ")}
                placeholder="my-app"
              />
              <div
                className={[
                  "inline-flex min-h-5 items-start gap-2 text-xs leading-5",
                  projectNameValidation.valid ? "text-primary/90" : "text-destructive",
                ].join(" ")}
              >
                {projectNameValidation.valid ? (
                  <CheckCircle2Icon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <AlertCircleIcon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
                )}
                <span>
                  {projectNameValidation.valid
                    ? "Safe for Windows, macOS, Linux, and npm package naming."
                    : projectNameValidation.error}
                </span>
              </div>
            </div>
          </div>

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
                  setCopiedMode(null)
                  playSound("click-soft")
                }}
              />
            ))}
          </div>

          <CommandSurface
            command={command}
            copied={copiedMode === "forge"}
            onCopy={() => handleCopy("forge")}
            copyLabel="Copy Forge command"
            packageManager={packageManager}
            onPackageManagerChange={handlePackageManagerChange}
            copyDisabled={!projectNameValidation.valid}
          />
        </TabsContent>
      </Tabs>
    </section>
  )
}
