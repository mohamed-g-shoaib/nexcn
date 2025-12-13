/**
 * Footer Component
 *
 * Site footer with logo, description, resource links, and social media.
 *
 * To customize:
 * - Update footer text in messages/en.json and messages/ar.json
 * - Replace logo in public/nexcn.svg
 * - Update social media links (GitHub, X/Twitter)
 * - Add or remove resource links as needed
 */

"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { siGithub, siX } from "simple-icons";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FooterProps {
  dir?: "ltr" | "rtl";
}

export function Footer({ dir }: FooterProps) {
  const t = useTranslations();

  return (
    <footer
      className="mt-auto w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
      dir={dir}
    >
      <div className="flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col gap-8 sm:gap-12">
            {/* Top Row: Logo and Links */}
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              {/* Logo and Description - Update logo and brand name */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    className="dark:invert"
                    src="/nexcn.svg" // Replace with your logo
                    alt="Nexcn logo" // Update alt text
                    width={32}
                    height={32}
                    style={{ width: "32px", height: "32px" }}
                  />
                  <span className="text-lg font-semibold text-black dark:text-white">
                    Nexcn {/* Replace with your brand name */}
                  </span>
                </div>
                <p className="max-w-xs text-sm text-zinc-600 dark:text-zinc-400">
                  {t("footer.description")}
                </p>
              </div>

              {/* Resource Links - Update or remove these links */}
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold text-black dark:text-white">
                    {t("footer.links.resources")}
                  </h3>
                  <a
                    href="https://nextjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                  >
                    {t("navigation.nextjs")}
                  </a>
                  <a
                    href="https://base-ui.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                  >
                    {t("navigation.baseUi")}
                  </a>
                  <a
                    href="https://ui.shadcn.com/docs/components"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                  >
                    {t("navigation.shadcn")}
                  </a>
                </div>
              </div>

              {/* Social Links - Update URLs to your social media profiles */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-black dark:text-white">
                  {t("footer.links.social")}
                </h3>
                <div className="flex gap-4">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <a
                          href="https://github.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                          aria-label="GitHub"
                        />
                      }
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `<svg class="size-5" fill="currentColor" viewBox="0 0 24 24">${siGithub.svg}</svg>`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("footer.links.github")}</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <a
                          href="https://twitter.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
                          aria-label="X"
                        />
                      }
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `<svg class="size-5" fill="currentColor" viewBox="0 0 24 24">${siX.svg}</svg>`,
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("footer.links.x")}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Bottom Row: Copyright */}
            <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <p className="text-start text-sm text-zinc-600 dark:text-zinc-400">
                {t("footer.copyright")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
