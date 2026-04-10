"use client"

import { PackageIcon, LayersIcon, WrenchIcon } from "lucide-react"

import { StackPill } from "@/components/marketing/stack-pill"
import { MARKETING_STACK } from "@/lib/marketing"

export function Header() {
  return (
    <section className="flex flex-col gap-8">
      {/* Hero copy: one headline, one supporting line */}
      <div className="flex flex-col gap-4">
        <h1 className="max-w-xl text-balance text-3xl font-medium tracking-tight text-foreground sm:text-[2.35rem]">
          Ship the starter you actually want to open.
        </h1>
        <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground">
          Forge generates minimal starters with real theme support, sound-ready wiring, and a
          structure that stays easy to own after the first commit.
        </p>
        <ul className="flex flex-col gap-3.5 text-sm leading-relaxed">
          <li className="flex items-start gap-3">
            <PackageIcon
              aria-hidden="true"
              className="mt-[0.2rem] size-4 shrink-0 text-muted-foreground"
            />
            <span className="text-pretty text-muted-foreground">
              Keep the starter intentionally small, no demo-heavy sections to remove.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <LayersIcon
              aria-hidden="true"
              className="mt-[0.2rem] size-4 shrink-0 text-muted-foreground"
            />
            <span className="text-pretty text-muted-foreground">
              Use the stack you already want: Next.js, Vite, or TanStack Start.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <WrenchIcon
              aria-hidden="true"
              className="mt-[0.2rem] size-4 shrink-0 text-muted-foreground"
            />
            <span className="text-pretty text-muted-foreground">
              Get the real app shell with theme, providers, and tooling wired.
            </span>
          </li>
        </ul>
      </div>

      {/* Stack signals */}
      <div className="flex flex-wrap gap-x-5 gap-y-2.5">
        {MARKETING_STACK.map((item) => (
          <StackPill key={item.label} label={item.label} icons={item.icons} />
        ))}
      </div>
    </section>
  )
}
