import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { siGithub, siX } from "simple-icons";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { Navigation } from "@/components/navigation";

export default function Home() {
  const locale = useLocale();
  const t = useTranslations();
  const isRTL = locale === "ar";

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* Navbar */}
      <nav
        className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl flex items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center gap-2">
              <Image
                className="dark:invert"
                src="/mg-8bit.svg"
                alt="Nexshad logo"
                width={32}
                height={18}
              />
              <span className="text-lg font-semibold text-black dark:text-white">
                Nexshad
              </span>
            </div>

            {/* Navigation Menu - Center */}
            <div className="hidden md:flex md:flex-1 md:justify-center">
              <Navigation dir={isRTL ? "rtl" : "ltr"} />
            </div>

            {/* Switchers - Right/Left */}
            <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <LanguageToggle dir={isRTL ? "rtl" : "ltr"} />
              <ModeToggle dir={isRTL ? "rtl" : "ltr"} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div
            className="flex flex-col items-start gap-12 text-start sm:gap-16"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Logo Section */}
            <div className="flex justify-start">
              <Image
                className="dark:invert"
                src="/mg-8bit.svg"
                alt="Nexshad logo"
                width={100}
                height={46}
                priority
              />
            </div>

            {/* Content Section */}
            <div
              className="flex flex-col gap-6 text-start"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
                {t("content.title")}
              </h1>
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                {t("content.description.start")}
                <a
                  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-semibold text-zinc-950 dark:text-zinc-50"
                >
                  {t("content.description.templates")}
                </a>
                {t("content.description.middle")}
                <a
                  href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-semibold text-zinc-950 dark:text-zinc-50"
                >
                  {t("content.description.learning")}
                </a>
                {t("content.description.end")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col gap-4 sm:flex-row ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              <a
                className="flex h-12 items-center justify-center gap-2 rounded-lg bg-black px-6 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 sm:w-auto"
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <Image
                  className="dark:invert"
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={18}
                  height={16}
                />
                {t("cta.deploy")}
              </a>
              <a
                className="flex h-12 items-center justify-center rounded-lg border border-zinc-300 px-6 text-black transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-600 dark:hover:bg-zinc-900 sm:w-auto"
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("cta.documentation")}
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 mt-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl">
            <div className="flex flex-col gap-8 sm:gap-12">
              {/* Top Row: Logo and Links */}
              <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                {/* Logo and Description */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Image
                      className="dark:invert"
                      src="/mg-8bit.svg"
                      alt="Nexshad logo"
                      width={32}
                      height={18}
                    />
                    <span className="text-lg font-semibold text-black dark:text-white">
                      Nexshad
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xs">
                    {t("footer.description")}
                  </p>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-black dark:text-white">
                      {t("footer.links.product")}
                    </h3>
                    <a
                      href="#"
                      className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                      {t("footer.links.features")}
                    </a>
                    <a
                      href="#"
                      className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                      {t("footer.links.documentation")}
                    </a>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-black dark:text-white">
                      {t("footer.links.company")}
                    </h3>
                    <a
                      href="#"
                      className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                      {t("footer.links.about")}
                    </a>
                    <a
                      href="#"
                      className="text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                    >
                      {t("footer.links.contact")}
                    </a>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold text-black dark:text-white">
                    {t("footer.links.social")}
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                      aria-label="GitHub"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `<svg class="size-5" fill="currentColor" viewBox="0 0 24 24">${siGithub.svg}</svg>`,
                        }}
                      />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
                      aria-label="X"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `<svg class="size-5" fill="currentColor" viewBox="0 0 24 24">${siX.svg}</svg>`,
                        }}
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Copyright */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 text-start">
                  {t("footer.copyright")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
