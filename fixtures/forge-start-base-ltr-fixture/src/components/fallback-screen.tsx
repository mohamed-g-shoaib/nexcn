import type * as React from "react"

type FallbackScreenProps = {
  title: string
  description: string
  action?: React.ReactNode
}

export function FallbackScreen({ title, description, action }: FallbackScreenProps) {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Forge
            </p>
            <h1 className="max-w-sm text-balance text-xl font-medium tracking-tight text-foreground">
              {title}
            </h1>
            <p className="max-w-sm text-pretty text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>

          {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
        </div>
      </section>
    </main>
  )
}
