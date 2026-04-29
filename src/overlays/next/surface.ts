import type { BaseLibrary, PackageManager } from "../../types.js";

function getScriptCommandLine(packageManager: PackageManager, scriptName: string): string {
  return `${packageManager} run ${scriptName}`;
}

function getBaseLabel(base: BaseLibrary): string {
  return base === "base" ? "Base UI primitives" : "Radix UI primitives";
}

export function getSoundAssetTemplate(
  soundName: "click-soft" | "switch-on" | "switch-off",
): string {
  const exportName =
    soundName === "click-soft"
      ? "clickSoftSound"
      : soundName === "switch-on"
        ? "switchOnSound"
        : "switchOffSound";

  return `export { ${exportName} } from "@/lib/${soundName}";
`;
}

export function getThemeToggleTemplate(rtl: boolean): string {
  if (!rtl) {
    return `"use client";

import * as React from "react";
import { MoonStarIcon, SunMediumIcon } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useUiSound } from "@/hooks/use-ui-sound";

const COPY = {
  fallbackLabel: "Theme",
  toLightLabel: "Light",
  toDarkLabel: "Dark"
} as const;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { playSound } = useUiSound();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const nextThemeLabel = !mounted
    ? COPY.fallbackLabel
    : isDark
      ? COPY.toLightLabel
      : COPY.toDarkLabel;

  function handleToggle() {
    if (!mounted) {
      return;
    }

    const nextTheme = isDark ? "light" : "dark";

    setTheme(nextTheme);
    playSound(nextTheme === "dark" ? "switch-off" : "switch-on");
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={nextThemeLabel}
      className="h-9 rounded-full px-3"
      onClick={handleToggle}
    >
      <span className="relative me-1.5 size-4">
        <span
          className={[
            "absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-out",
            !mounted || !isDark ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]"
          ].join(" ")}
        >
          <SunMediumIcon aria-hidden="true" />
        </span>
        <span
          className={[
            "absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-out",
            mounted && isDark ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]"
          ].join(" ")}
        >
          <MoonStarIcon aria-hidden="true" />
        </span>
      </span>
      {nextThemeLabel}
    </Button>
  );
}
`;
  }

  return `"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { MoonStarIcon, SunMediumIcon } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useUiSound } from "@/hooks/use-ui-sound";

export function ThemeToggle() {
  const t = useTranslations("ThemeToggle");
  const { resolvedTheme, setTheme } = useTheme();
  const { playSound } = useUiSound();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const nextThemeLabel = !mounted
    ? t("fallbackLabel")
    : isDark
      ? t("toLightLabel")
      : t("toDarkLabel");

  function handleToggle() {
    if (!mounted) {
      return;
    }

    const nextTheme = isDark ? "light" : "dark";

    setTheme(nextTheme);
    playSound(nextTheme === "dark" ? "switch-off" : "switch-on");
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={nextThemeLabel}
      className="h-9 rounded-full px-3"
      onClick={handleToggle}
    >
      <span className="relative me-1.5 size-4">
        <span
          className={[
            "absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-out",
            !mounted || !isDark ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]"
          ].join(" ")}
        >
          <SunMediumIcon aria-hidden="true" />
        </span>
        <span
          className={[
            "absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-out",
            mounted && isDark ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]"
          ].join(" ")}
        >
          <MoonStarIcon aria-hidden="true" />
        </span>
      </span>
      {nextThemeLabel}
    </Button>
  );
}
`;
}

export function getFallbackScreenTemplate(): string {
  return `import type * as React from "react";

import type { Direction } from "@/lib/i18n";

type FallbackScreenProps = {
  eyebrow?: string;
  locale?: string;
  direction?: Direction;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function FallbackScreen({
  eyebrow = "Forge",
  locale,
  direction,
  title,
  description,
  action
}: FallbackScreenProps) {
  return (
    <main
      className="flex min-h-svh items-center justify-center px-6 py-10"
      lang={locale}
      dir={direction}
    >
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-start">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
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
  );
}
`;
}

export function getErrorViewTemplate(): string {
  return `"use client";

import type { Direction } from "@/lib/i18n";

import { FallbackScreen } from "@/components/fallback-screen";

type ErrorViewProps = {
  eyebrow?: string;
  locale?: string;
  direction?: Direction;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

export function ErrorView({
  eyebrow,
  locale,
  direction,
  title = "Something went wrong.",
  description = "An unexpected error occurred. Please try again.",
  action
}: ErrorViewProps) {
  return (
    <FallbackScreen
      eyebrow={eyebrow}
      locale={locale}
      direction={direction}
      title={title}
      description={description}
      action={action}
    />
  );
}
`;
}

export function getFallbackActionsTemplate(): string {
  return `"use client";

import { Button } from "@/components/ui/button";
import { useUiSound } from "@/hooks/use-ui-sound";

type FallbackActionsProps = {
  homeHref: string;
  homeLabel: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function FallbackActions({
  homeHref,
  homeLabel,
  retryLabel,
  onRetry
}: FallbackActionsProps) {
  const { playSound } = useUiSound();

  return (
    <>
      {onRetry && retryLabel ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-full px-3"
          onClick={() => {
            playSound("click-soft");
            onRetry();
          }}
        >
          {retryLabel}
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 rounded-full px-3"
        onClick={() => {
          playSound("click-soft");
          window.setTimeout(() => window.location.assign(homeHref), 100);
        }}
      >
        {homeLabel}
      </Button>
    </>
  );
}
`;
}

export function getLanguageToggleTemplate(): string {
  return `"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { LanguagesIcon } from "lucide-react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, getAlternateLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useUiSound } from "@/hooks/use-ui-sound";

export function LanguageToggle() {
  const t = useTranslations("LanguageToggle");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const { playSound } = useUiSound();
  const nextLocale = getAlternateLocale(locale);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={t("label")}
      className="h-9 rounded-full px-3"
      onClick={() => {
        playSound("click-soft");
        window.setTimeout(() => {
          React.startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
          });
        }, 100);
      }}
    >
      <LanguagesIcon data-icon="inline-start" aria-hidden="true" />
      {t("label")}
    </Button>
  );
}
`;
}

export function getStarterShellTemplate(rtl: boolean): string {
  if (!rtl) {
    return `"use client";

import { ThemeToggle } from "@/components/theme-toggle";

const COPY = {
  eyebrow: "Forge",
  heading: "Your starter is ready to customize.",
  description:
    "Replace this screen in app/page.tsx. Edit components/ for UI pieces, or app-providers.tsx for theme and shared app behavior."
} as const;

export function StarterShell() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-start">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {COPY.eyebrow}
            </p>
            <h1 className="max-w-sm text-balance text-xl font-medium tracking-tight text-foreground">
              {COPY.heading}
            </h1>
            <p className="max-w-sm text-pretty text-sm leading-6 text-muted-foreground">
              {COPY.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </section>
    </main>
  );
}
`;
  }

  return `"use client";

import { useLocale, useTranslations } from "next-intl";

import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { type Locale, getDirectionForLocale } from "@/lib/i18n";

export function StarterShell() {
  const t = useTranslations("StarterShell");
  const locale = useLocale() as Locale;
  const direction = getDirectionForLocale(locale);

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-start">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h1 className="max-w-sm text-balance text-xl font-medium tracking-tight text-foreground">
              {t("heading")}
            </h1>
            <p className="max-w-sm text-pretty text-sm leading-6 text-muted-foreground">
              {t("description")}
            </p>
          </div>

          <div
            className="flex flex-wrap items-center gap-2"
            dir={direction}
          >
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </section>
    </main>
  );
}
`;
}

export function getReadmeTemplate(
  projectName: string,
  codeQualityLabel: string,
  rtl: boolean,
  packageManager: PackageManager,
  base: BaseLibrary,
): string {
  if (!rtl) {
    return `# ${projectName}

This project was generated by Forge.

## Start editing

- Update \`app/page.tsx\` for the starter page
- Update \`app/layout.tsx\` for document language, theme bootstrap, and root shell behavior
- Update \`components/\` for UI pieces
- Update \`components/app-providers.tsx\` for shared provider composition

## Included by default

- Next.js App Router
- shadcn preset: \`luma\` (\`b1VlIwYS\`)
- single-language LTR starter
- light/dark theme toggle
- centralized sound-ready hook surface
- code quality: \`${codeQualityLabel}\`
- customized text selection and scrollbar styling

## Commands

\`\`\`bash
${getScriptCommandLine(packageManager, "dev")}
${getScriptCommandLine(packageManager, "build")}
${getScriptCommandLine(packageManager, "typecheck")}
${getScriptCommandLine(packageManager, "lint")}
${getScriptCommandLine(packageManager, "format")}
\`\`\`
`;
  }

  return `# ${projectName}

This project was generated by Forge.

## Start editing

- Update \`app/[locale]/page.tsx\` for the starter page
- Update \`app/[locale]/layout.tsx\` for locale-scoped app wiring
- Update \`messages/en.json\` and \`messages/ar.json\` for translated copy
- Update \`i18n/routing.ts\` and \`proxy.ts\` if you want to change locale routing behavior
- Update \`components/\` for UI pieces
- Update \`components/app-providers.tsx\` for shared provider composition

## Included by default

- Next.js App Router
- \`next-intl\` with locale-prefixed routes
- shadcn preset: \`luma\` (\`b1VlIwYS\`)
- ${getBaseLabel(base)}
- light/dark theme toggle
- English/Arabic runtime direction support
- centralized sound-ready hook surface
- code quality: \`${codeQualityLabel}\`
- customized text selection and scrollbar styling

## Commands

\`\`\`bash
${getScriptCommandLine(packageManager, "dev")}
${getScriptCommandLine(packageManager, "build")}
${getScriptCommandLine(packageManager, "typecheck")}
${getScriptCommandLine(packageManager, "lint")}
${getScriptCommandLine(packageManager, "format")}
\`\`\`
`;
}
