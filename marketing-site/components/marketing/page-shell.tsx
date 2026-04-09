"use client"

import { Header } from "@/components/marketing/header"
import { InstallHelper } from "@/components/marketing/install-helper"

export function PageShell() {
  return (
    <main className="min-h-svh px-6 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-16 sm:gap-20">
        <Header />
        <InstallHelper />
      </div>
    </main>
  )
}
