"use client"

import * as React from "react"
import { PackageIcon, SlidersHorizontalIcon, LanguagesIcon, ExternalLinkIcon } from "lucide-react"

import { StackPill } from "@/components/marketing/stack-pill"
import { MARKETING_STACK } from "@/lib/marketing"
import { useUiSound } from "@/hooks/use-ui-sound"

export function Header() {
  const { playSound } = useUiSound()

  function handleExampleClick(url: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      playSound("click-soft")
      setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer")
      }, 100)
    }
  }

  return (
    <section className="flex flex-col gap-8">
      {/* Hero copy: one headline, one supporting line */}
      <div className="flex flex-col gap-4">
        <h1 className="max-w-xl text-balance text-3xl font-medium tracking-tight text-foreground sm:text-[2.35rem]">
          Start building without the cleanup tax.
        </h1>
        <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground">
          Forge generates minimal starters with theme support, click interaction sounds, and
          pre-configured linters and formatters. The structure stays easy to own after the first
          commit.
        </p>
        <ul className="flex flex-col gap-3.5 text-sm leading-relaxed">
          <li className="flex items-start gap-3">
            <PackageIcon
              aria-hidden="true"
              className="mt-[0.2rem] size-4 shrink-0 text-muted-foreground"
            />
            <span className="text-pretty text-muted-foreground">
              Clean up in under a minute. No demo-heavy sections to remove.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <SlidersHorizontalIcon
              aria-hidden="true"
              className="mt-[0.2rem] size-4 shrink-0 text-muted-foreground"
            />
            <span className="text-pretty text-muted-foreground">
              Choose Base UI or Radix UI. Pick Biome, ESLint + Prettier, or Oxlint + Oxfmt.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <LanguagesIcon
              aria-hidden="true"
              className="mt-[0.2rem] size-4 shrink-0 text-muted-foreground"
            />
            <span className="text-pretty text-muted-foreground">
              RTL and Arabic support when you need it. Single-language English when you don't.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <ExternalLinkIcon
              aria-hidden="true"
              className="mt-[0.2rem] size-4 shrink-0 text-muted-foreground"
            />
            <span className="text-pretty text-muted-foreground">
              See how it looks at:{" "}
              <a
                href="https://forge-example-rtl.vercel.app/"
                onClick={handleExampleClick("https://forge-example-rtl.vercel.app/")}
                className="text-foreground underline decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"
              >
                RTL Example
              </a>
              {" · "}
              <a
                href="https://forge-example.vercel.app/"
                onClick={handleExampleClick("https://forge-example.vercel.app/")}
                className="text-foreground underline decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Example
              </a>
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
