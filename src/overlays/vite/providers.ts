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
${getDirectionProviderImport(base)}

import { ThemeProvider } from "@/components/theme-provider";
import { LocaleProvider } from "@/hooks/use-locale";

function AppShellProviders({
  children,
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
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AppShellProviders>{children}</AppShellProviders>
      </LocaleProvider>
    </ThemeProvider>
  );
}
`;
  }

  return `"use client";

import * as React from "react";
${getDirectionProviderImport(base)}

import { ThemeProvider } from "@/components/theme-provider";
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
  children,
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
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AppShellProviders>{children}</AppShellProviders>
      </LocaleProvider>
    </ThemeProvider>
  );
}
`;
}

export function getLocaleHookTemplate(rtl: boolean): string {
  if (!rtl) {
    return `"use client";

/* eslint-disable react-refresh/only-export-components */

import * as React from "react";

type LocaleMessages = {
  eyebrow: string;
  heading: string;
  description: string;
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
    "Replace this screen in src/App.tsx. Edit src/components/ for UI pieces, or app-providers.tsx for theme and shared app behavior.",
  themeToggleToLightLabel: "Light",
  themeToggleToDarkLabel: "Dark"
};

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
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

/* eslint-disable react-refresh/only-export-components */

import * as React from "react";
import { useLocation, useNavigate } from "react-router";

import {
  type Direction,
  type Locale,
  defaultLocale,
  getAlternateLocale,
  getDirectionForLocale,
  getLocaleHref,
  isLocale,
} from "@/lib/i18n";

type LocaleMessages = {
  eyebrow: string;
  heading: string;
  description: string;
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
      "Replace this screen in src/App.tsx. Edit src/components/ for UI pieces, or app-providers.tsx for theme, language, and shared app behavior.",
    themeToggleToLightLabel: "Light",
    themeToggleToDarkLabel: "Dark",
    languageLabel: "Arabic",
  },
  ar: {
    eyebrow: "فورج",
    heading: "الواجهة جاهزة لتبدأ التعديل.",
    description:
      "استبدل هذه الشاشة من src/App.tsx. عدل src/components/ لعناصر الواجهة، أو app-providers.tsx للمظهر واللغة والسلوك العام.",
    themeToggleToLightLabel: "فاتح",
    themeToggleToDarkLabel: "داكن",
    languageLabel: "English",
  },
};

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const localeSegment = location.pathname.split("/").filter(Boolean)[0];
  const locale = isLocale(localeSegment) ? localeSegment : defaultLocale;
  const nextLocale = getAlternateLocale(locale);
  const direction = getDirectionForLocale(locale);

  const value = React.useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction,
      messages: MESSAGES[locale],
      nextLocale,
      switchLocale: () => {
        navigate(getLocaleHref(location.pathname, nextLocale), { replace: true });
      },
    }),
    [direction, locale, location.pathname, navigate, nextLocale],
  );

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

/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import { useEffectEvent } from "react";

import { useUiSound } from "@/hooks/use-ui-sound";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const THEME_VALUES: Theme[] = ["dark", "light", "system"];

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined);

function isTheme(value: string | null): value is Theme {
  if (value === null) {
    return false;
  }

  return THEME_VALUES.includes(value as Theme);
}

function getSystemTheme(): ResolvedTheme {
  if (window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark";
  }

  return "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style");
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}",
    ),
  );
  document.head.appendChild(style);

  return () => {
    window.getComputedStyle(document.body);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove();
      });
    });
  };
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const editableParent = target.closest("input, textarea, select, [contenteditable='true']");
  return editableParent !== null;
}

function ThemeHotkey({ storageKey }: { storageKey: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { playSound } = useUiSound();

  const toggleTheme = useEffectEvent(() => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    window.localStorage.setItem(storageKey, nextTheme);
    setTheme(nextTheme);
    playSound(nextTheme === "dark" ? "switch-off" : "switch-on");
  });

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.key.toLowerCase() !== "d") {
        return;
      }

      toggleTheme();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey);
    if (isTheme(storedTheme)) {
      return storedTheme;
    }

    return defaultTheme;
  });

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme);
      setThemeState(nextTheme);
    },
    [storageKey],
  );

  const applyTheme = React.useCallback(
    (nextTheme: Theme) => {
      const root = document.documentElement;
      const resolvedTheme = resolveTheme(nextTheme);
      const restoreTransitions = disableTransitionOnChange
        ? disableTransitionsTemporarily()
        : null;

      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);

      if (restoreTransitions) {
        restoreTransitions();
      }
    },
    [disableTransitionOnChange],
  );

  React.useEffect(() => {
    applyTheme(theme);

    if (theme !== "system") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);
    const handleChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, applyTheme]);

  React.useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.storageArea !== localStorage || event.key !== storageKey) {
        return;
      }

      if (isTheme(event.newValue)) {
        setThemeState(event.newValue);
        return;
      }

      setThemeState(defaultTheme);
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [defaultTheme, storageKey]);

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme: resolveTheme(theme),
      setTheme,
    }),
    [theme, setTheme],
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      <ThemeHotkey storageKey={storageKey} />
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
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
    soundEnabled,
  });
  const [playSwitchOff] = useSound(switchOffSound, {
    volume: 0.28,
    interrupt: true,
    soundEnabled,
  });
  const [playSwitchOn] = useSound(switchOnSound, {
    volume: 0.28,
    interrupt: true,
    soundEnabled,
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
    [playClickSoft, playSwitchOff, playSwitchOn],
  );

  return {
    playSound,
    soundEnabled,
  };
}
`;
}
