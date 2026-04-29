import type { PackageManager } from "../../types.js";

function getScriptCommandLine(
  packageManager: PackageManager,
  scriptName: string,
): string {
  return `${packageManager} run ${scriptName}`;
}

export function getThemeToggleTemplate(rtl: boolean): string {
  if (!rtl) {
    return `"use client";

import { MoonStarIcon, SunMediumIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useUiSound } from "@/hooks/use-ui-sound";

const COPY = {
  toLightLabel: "Light",
  toDarkLabel: "Dark",
} as const;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { playSound } = useUiSound();

  const isDark = resolvedTheme === "dark";
  const nextThemeLabel = isDark ? COPY.toLightLabel : COPY.toDarkLabel;

  function handleToggle() {
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
            !isDark ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]",
          ].join(" ")}
        >
          <SunMediumIcon aria-hidden="true" />
        </span>
        <span
          className={[
            "absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-out",
            isDark ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]",
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

import { useTranslation } from "react-i18next";
import { MoonStarIcon, SunMediumIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useUiSound } from "@/hooks/use-ui-sound";

export function ThemeToggle() {
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const { playSound } = useUiSound();

  const isDark = resolvedTheme === "dark";
  const nextThemeLabel = isDark
    ? t("ThemeToggle.toLightLabel")
    : t("ThemeToggle.toDarkLabel");

  function handleToggle() {
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
            !isDark ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]",
          ].join(" ")}
        >
          <SunMediumIcon aria-hidden="true" />
        </span>
        <span
          className={[
            "absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-out",
            isDark ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]",
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

export function getLanguageToggleTemplate(): string {
  return `"use client";

import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { LanguagesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouteLocale } from "@/hooks/use-route-locale";
import { getAlternateLocale, getLocaleHref } from "@/lib/i18n";
import { useUiSound } from "@/hooks/use-ui-sound";

export function LanguageToggle() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locale, pathname } = useRouteLocale();
  const { playSound } = useUiSound();
  const nextLocale = getAlternateLocale(locale);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={t("LanguageToggle.label")}
      className="h-9 rounded-full px-3"
      onClick={() => {
        playSound("click-soft");
        window.setTimeout(() => {
          navigate(getLocaleHref(pathname, nextLocale), { replace: true });
        }, 100);
      }}
    >
      <LanguagesIcon data-icon="inline-start" aria-hidden="true" />
      {t("LanguageToggle.label")}
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
    "Replace this screen in src/App.tsx. Edit src/components/ for UI pieces, or app-providers.tsx for theme and shared app behavior.",
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

          <div className="flex flex-wrap items-center gap-2" dir="ltr">
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

import { useTranslation } from "react-i18next";

import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouteLocale } from "@/hooks/use-route-locale";

export function StarterShell() {
  const { t } = useTranslation();
  const { direction } = useRouteLocale();

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-start">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {t("StarterShell.eyebrow")}
            </p>
            <h1 className="max-w-sm text-balance text-xl font-medium tracking-tight text-foreground">
              {t("StarterShell.heading")}
            </h1>
            <p className="max-w-sm text-pretty text-sm leading-6 text-muted-foreground">
              {t("StarterShell.description")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2" dir={direction}>
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
  action,
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
  onRetry,
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

export function getAppErrorBoundaryTemplate(rtl: boolean): string {
  if (!rtl) {
    return `import * as React from "react";

import { FallbackActions } from "@/components/fallback-actions";
import { FallbackScreen } from "@/components/fallback-screen";

type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.assign(window.location.href);
  };

  render() {
    if (this.state.hasError) {
      return (
        <FallbackScreen
          title="Something went wrong."
          description="An unexpected error occurred. Please try again."
          action={
            <FallbackActions
              homeHref="/"
              homeLabel="Go home"
              retryLabel="Try again"
              onRetry={this.handleRetry}
            />
          }
        />
      );
    }

    return this.props.children;
  }
}
`;
  }

  return `import * as React from "react";
import { useTranslation } from "react-i18next";

import { FallbackActions } from "@/components/fallback-actions";
import { FallbackScreen } from "@/components/fallback-screen";
import { getLocaleHref } from "@/lib/i18n";
import { useRouteLocale } from "@/hooks/use-route-locale";

type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.assign(window.location.href);
  };

  render() {
    if (this.state.hasError) {
      return <AppErrorFallback onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

function AppErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  const { direction, locale } = useRouteLocale();

  return (
    <FallbackScreen
      eyebrow={t("Fallback.eyebrow")}
      locale={locale}
      direction={direction}
      title={t("Fallback.errorTitle")}
      description={t("Fallback.errorDescription")}
      action={
        <FallbackActions
          homeHref={getLocaleHref("/", locale)}
          homeLabel={t("Fallback.homeLabel")}
          retryLabel={t("Fallback.retryLabel")}
          onRetry={onRetry}
        />
      }
    />
  );
}
`;
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

export function getWebManifestTemplate(projectName: string): string {
  return JSON.stringify(
    {
      name: projectName,
      short_name: projectName,
      icons: [
        {
          src: "/favicon.ico",
          sizes: "any",
          type: "image/x-icon",
        },
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    },
    null,
    2,
  );
}

export function getReadmeTemplate(
  projectName: string,
  codeQualityLabel: string,
  rtl: boolean,
  packageManager: PackageManager,
): string {
  if (!rtl) {
    return `# ${projectName}

This project was generated by Forge.

## Start editing

- Update \`src/App.tsx\` for the starter page
- Update \`src/components/app-providers.tsx\` for theme and root provider composition
- Update \`src/components/\` for UI pieces
- Update \`index.html\` for initial document language, direction, and metadata

## Included by default

- Vite + React + TypeScript
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

- Update \`src/App.tsx\` for the starter route wiring
- Update \`src/routes/\` for localized route surfaces
- Update \`src/i18n/config.ts\` for i18n setup
- Update \`public/locales/en/translation.json\` and \`public/locales/ar/translation.json\` for translated copy
- Update \`src/components/app-providers.tsx\` for theme and root provider composition
- Update \`index.html\` for initial document language, direction, and metadata

## Included by default

- Vite + React + TypeScript
- \`react-i18next\` + \`i18next\`
- shadcn preset: \`luma\` (\`b1VlIwYS\`)
- locale-prefixed starter paths: \`/en\` and \`/ar\`
- light/dark theme toggle
- React Router declarative routing for locale switching
- centralized sound-ready hook surface
- code quality: \`${codeQualityLabel}\`
- customized text selection and scrollbar styling

## Deployment note

If you deploy the built app as static assets, configure your host to serve \`index.html\` for unknown routes so locale paths like \`/ar\` can load correctly.

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
