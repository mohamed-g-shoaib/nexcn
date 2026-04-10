import { Header } from "@/components/marketing/header"
import { InstallHelper } from "@/components/marketing/install-helper"
import { SiteHeader } from "@/components/marketing/site-header"

export function PageShell() {
  return (
    <main className="min-h-svh px-6 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-16 sm:gap-20">
        <div className="flex flex-col gap-12">
          <div className="marketing-page-item" data-ready="true" style={{ animationDelay: "0ms" }}>
            <SiteHeader />
          </div>
          <div className="marketing-page-item" data-ready="true" style={{ animationDelay: "50ms" }}>
            <Header />
          </div>
        </div>
        <div className="marketing-page-item" data-ready="true" style={{ animationDelay: "100ms" }}>
          <InstallHelper />
        </div>
      </div>
    </main>
  )
}
