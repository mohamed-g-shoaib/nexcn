import type { PackageManager } from "../../types.js";

function getScriptCommandLine(packageManager: PackageManager, scriptName: string): string {
  return `${packageManager} run ${scriptName}`;
}

export function getThemeToggleTemplate(): string {
  return `import { MoonStarIcon, SunMediumIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";
import { useUiSound } from "@/hooks/use-ui-sound";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { messages } = useLocale();
  const { mounted, resolvedTheme, setTheme } = useTheme();
  const { playSound } = useUiSound();

  const isDark = resolvedTheme === "dark";
  const nextThemeLabel = !mounted
    ? messages.themeToggleFallbackLabel
    : isDark
      ? messages.themeToggleToLightLabel
      : messages.themeToggleToDarkLabel;

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
            mounted && !isDark ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]",
          ].join(" ")}
        >
          <SunMediumIcon aria-hidden="true" />
        </span>
        <span
          className={[
            "absolute inset-0 flex items-center justify-center transition-[opacity,filter,scale] duration-300 ease-out",
            mounted && isDark ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]",
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
  return `import { LanguagesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";
import { useUiSound } from "@/hooks/use-ui-sound";

export function LanguageToggle() {
  const { messages, switchLocale } = useLocale();
  const { playSound } = useUiSound();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={messages.languageLabel}
      className="h-9 rounded-full px-3"
      onClick={() => {
        playSound("click-soft");
        switchLocale();
      }}
    >
      <LanguagesIcon data-icon="inline-start" aria-hidden="true" />
      {messages.languageLabel}
    </Button>
  );
}
`;
}

export function getStarterShellTemplate(rtl: boolean): string {
  const languageImport = rtl ? 'import { LanguageToggle } from "@/components/language-toggle";\n' : "";
  const languageControl = rtl ? "\n            <LanguageToggle />" : "";

  return `${languageImport}import { ThemeToggle } from "@/components/theme-toggle";
import { useLocale } from "@/hooks/use-locale";

export function StarterShell() {
  const { direction, messages } = useLocale();

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-10">
      <section className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {messages.eyebrow}
            </p>
            <h1 className="max-w-sm text-balance text-xl font-medium tracking-tight text-foreground">
              {messages.heading}
            </h1>
            <p className="max-w-sm text-pretty text-sm leading-6 text-muted-foreground">
              {messages.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2" dir={direction}>
            <ThemeToggle />${languageControl}
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

type FallbackScreenProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function FallbackScreen({
  title,
  description,
  action
}: FallbackScreenProps) {
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
  );
}
`;
}

export function getRouteErrorTemplate(): string {
  return `import { useLocation, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { FallbackScreen } from "@/components/fallback-screen";
import { useUiSound } from "@/hooks/use-ui-sound";

type RouteErrorProps = {
  onRetry?: () => void;
};

export function RouteError({ onRetry }: RouteErrorProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { playSound } = useUiSound();
  const copy =
    location.pathname.split("/").filter(Boolean)[0] === "ar"
      ? {
          title: "حدث خطأ ما.",
          description: "حدث خطأ غير متوقع أثناء تحميل الواجهة المولدة.",
          backLabel: "الرجوع",
          homeLabel: "العودة للرئيسية",
          retryLabel: "أعد المحاولة"
        }
      : {
          title: "Something went wrong.",
          description: "An unexpected error interrupted the generated starter.",
          backLabel: "Go back",
          homeLabel: "Go home",
          retryLabel: "Try again"
        };
  const segments = location.pathname.split("/").filter(Boolean);
  const homeHref = segments.length > 0 && (segments[0] === "en" || segments[0] === "ar") ? \`/\${segments[0]}\` : "/";

  return (
    <FallbackScreen
      title={copy.title}
      description={copy.description}
      action={
        onRetry ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-full px-3"
              onClick={() => {
                playSound("click-soft");
                window.history.back();
              }}
            >
              {copy.backLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-full px-3"
              onClick={() => {
                playSound("click-soft");
                navigate({ to: homeHref });
              }}
            >
              {copy.homeLabel}
            </Button>
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
              {copy.retryLabel}
            </Button>
          </>
        ) : null
      }
    />
  );
}
`;
}

export function getSoundAssetTemplate(soundName: "click-soft" | "switch-on" | "switch-off"): string {
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
  packageManager: PackageManager
): string {
  if (!rtl) {
    return `# ${projectName}

This project was generated by Forge.

## Start editing

- Update \`src/routes/index.tsx\` for the starter page
- Update \`src/routes/__root.tsx\` for document metadata and root shell behavior
- Update \`src/components/app-providers.tsx\` for theme and provider composition
- Update \`src/components/\` for UI pieces

## Included by default

- TanStack Start + React + TypeScript
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

- Update \`src/routes/$locale/index.tsx\` for the starter page
- Update \`src/routes/__root.tsx\` for document metadata and root shell behavior
- Update \`src/components/app-providers.tsx\` for theme, language, and provider composition
- Update \`src/components/\` for UI pieces

## Included by default

- TanStack Start + React + TypeScript
- shadcn preset: \`luma\` (\`b1VlIwYS\`)
- route-based English/Arabic starter paths: \`/en\` and \`/ar\`
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
