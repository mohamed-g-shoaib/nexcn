import type { BaseLibrary } from "../../types.js";

function getDirectionProviderImport(base: BaseLibrary): string {
  if (base === "base") {
    return 'import { DirectionProvider } from "@base-ui/react/direction-provider";\nimport { Tooltip } from "@base-ui/react/tooltip";';
  }

  return 'import { Direction, Tooltip } from "radix-ui";';
}

function getDirectionProviderOpen(base: BaseLibrary): string {
  return base === "base"
    ? "<DirectionProvider direction={direction}>"
    : "<Direction.Provider dir={direction}>";
}

function getDirectionProviderClose(base: BaseLibrary): string {
  return base === "base" ? "</DirectionProvider>" : "</Direction.Provider>";
}

function getTooltipProviderOpen(base: BaseLibrary): string {
  return base === "base"
    ? "<Tooltip.Provider delay={400} closeDelay={150} timeout={500}>"
    : "<Tooltip.Provider delayDuration={400} skipDelayDuration={150}>";
}

export function getAppProvidersTemplate(
  base: BaseLibrary,
  rtl: boolean,
): string {
  if (!rtl) {
    return `"use client";

import type * as React from "react";
${base === "base" ? 'import { DirectionProvider } from "@base-ui/react/direction-provider";\nimport { Tooltip } from "@base-ui/react/tooltip";' : 'import { Direction, Tooltip } from "radix-ui";'}

import { LocaleProvider } from "@/hooks/use-locale";

function AppShellProviders({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    ${base === "base" ? '<DirectionProvider direction="ltr">' : '<Direction.Provider dir="ltr">'}
      ${getTooltipProviderOpen(base)}
        {children}
      </Tooltip.Provider>
    ${base === "base" ? "</DirectionProvider>" : "</Direction.Provider>"}
  );
}

export function AppProviders({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider>
      <AppShellProviders>{children}</AppShellProviders>
    </LocaleProvider>
  );
}
`;
  }

  return `"use client";

import * as React from "react";
${getDirectionProviderImport(base)}

import { LocaleProvider, useLocale } from "@/hooks/use-locale";

function DocumentRootSync() {
  const { direction, locale } = useLocale();

  React.useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [direction, locale]);

  return null;
}

function AppShellProviders({
  children
}: {
  children: React.ReactNode;
}) {
  const { direction } = useLocale();

  return (
    ${getDirectionProviderOpen(base)}
      ${getTooltipProviderOpen(base)}
        <DocumentRootSync />
        {children}
      </Tooltip.Provider>
    ${getDirectionProviderClose(base)}
  );
}

export function AppProviders({
  locale,
  children
}: {
  locale: "en" | "ar";
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider locale={locale}>
      <AppShellProviders>{children}</AppShellProviders>
    </LocaleProvider>
  );
}
`;
}

export function getLocaleHookTemplate(rtl: boolean): string {
  if (!rtl) {
    return `"use client";

import * as React from "react";

type LocaleMessages = {
  eyebrow: string;
  heading: string;
  description: string;
  themeToggleFallbackLabel: string;
  themeToggleToLightLabel: string;
  themeToggleToDarkLabel: string;
};

type LocaleContextValue = {
  locale: "en";
  direction: "ltr";
  messages: LocaleMessages;
};

const MESSAGES: LocaleMessages = {
  eyebrow: "Forge",
  heading: "Your starter is ready to customize.",
  description:
    "Replace this screen in app/page.tsx. Edit components/ for UI pieces, or app-providers.tsx for theme and shared app behavior.",
  themeToggleFallbackLabel: "Theme",
  themeToggleToLightLabel: "Light",
  themeToggleToDarkLabel: "Dark"
};

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const value: LocaleContextValue = {
    locale: "en",
    direction: "ltr",
    messages: MESSAGES
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = React.useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider.");
  }

  return context;
}
`;
  }

  return `"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  type Direction,
  type Locale,
  getAlternateLocale,
  getDirectionForLocale,
  getLocaleHref
} from "@/lib/i18n";

type LocaleMessages = {
  eyebrow: string;
  heading: string;
  description: string;
  themeToggleFallbackLabel: string;
  themeToggleToLightLabel: string;
  themeToggleToDarkLabel: string;
  languageLabel: string;
};

type LocaleContextValue = {
  locale: Locale;
  direction: Direction;
  messages: LocaleMessages;
  nextLocale: Locale;
  switchLocale: () => void;
};

const MESSAGES: Record<Locale, LocaleMessages> = {
  en: {
    eyebrow: "Forge",
    heading: "Your starter is ready to customize.",
    description:
      "Replace this screen in app/[locale]/page.tsx. Edit components/ for UI pieces, or app-providers.tsx for theme, language, and shared app behavior.",
    themeToggleFallbackLabel: "Theme",
    themeToggleToLightLabel: "Light",
    themeToggleToDarkLabel: "Dark",
    languageLabel: "Arabic"
  },
  ar: {
    eyebrow: "فورج",
    heading: "الواجهة جاهزة لتبدأ التعديل.",
    description:
      "استبدل هذه الشاشة من app/[locale]/page.tsx. عدل components/ لعناصر الواجهة، أو app-providers.tsx للمظهر واللغة والسلوك العام.",
    themeToggleFallbackLabel: "المظهر",
    themeToggleToLightLabel: "فاتح",
    themeToggleToDarkLabel: "داكن",
    languageLabel: "English"
  }
};

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const direction = getDirectionForLocale(locale);
  const nextLocale = getAlternateLocale(locale);

  const value: LocaleContextValue = {
    locale,
    direction,
    messages: MESSAGES[locale],
    nextLocale,
    switchLocale: () => {
      React.startTransition(() => {
        router.push(getLocaleHref(pathname, nextLocale));
      });
    }
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = React.useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider.");
  }

  return context;
}
`;
}

export function getThemeProviderTemplate(): string {
  return `"use client";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export { useTheme };

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="forge-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
`;
}

export function getUiSoundHookTemplate(): string {
  return `"use client";

import * as React from "react";

import { useSound } from "@/hooks/use-sound";
import { clickSoftSound } from "@/sounds/click-soft";
import { switchOffSound } from "@/sounds/switch-off";
import { switchOnSound } from "@/sounds/switch-on";

export type UiSoundName = "click-soft" | "switch-on" | "switch-off";

type UiSoundApi = {
  playSound: (sound: UiSoundName) => void;
  soundEnabled: boolean;
};

const DEFAULT_SOUND_ENABLED = true;

export function useUiSound(): UiSoundApi {
  const [soundEnabled] = React.useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SOUND_ENABLED;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }

    return DEFAULT_SOUND_ENABLED;
  });

  const [playClickSoft] = useSound(clickSoftSound, {
    volume: 0.26,
    interrupt: true,
    soundEnabled
  });
  const [playSwitchOff] = useSound(switchOffSound, {
    volume: 0.28,
    interrupt: true,
    soundEnabled
  });
  const [playSwitchOn] = useSound(switchOnSound, {
    volume: 0.28,
    interrupt: true,
    soundEnabled
  });

  const playSound = React.useCallback(
    (sound: UiSoundName) => {
      if (sound === "click-soft") {
        playClickSoft();
        return;
      }

      if (sound === "switch-on") {
        playSwitchOn();
        return;
      }

      playSwitchOff();
    },
    [playClickSoft, playSwitchOff, playSwitchOn]
  );

  return {
    playSound,
    soundEnabled
  };
}
`;
}
