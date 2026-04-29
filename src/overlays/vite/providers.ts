import type { BaseLibrary } from "../../types.js";

function getDirectionProviderImport(base: BaseLibrary): string {
  if (base === "base") {
    return 'import { DirectionProvider } from "@base-ui/react/direction-provider";\nimport { Tooltip } from "@base-ui/react/tooltip";';
  }

  return 'import { Direction, Tooltip } from "radix-ui";';
}

function getDirectionProviderOpen(base: BaseLibrary, directionExpression: string): string {
  return base === "base"
    ? `<DirectionProvider direction={${directionExpression}}>`
    : `<Direction.Provider dir={${directionExpression}}>`;
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

function AppShellProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    ${getDirectionProviderOpen(base, '"ltr"')}
      ${getTooltipProviderOpen(base)}
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
      <AppShellProviders>{children}</AppShellProviders>
    </ThemeProvider>
  );
}
`;
  }

  return `"use client";

import * as React from "react";
import { useLocation } from "react-router";
${getDirectionProviderImport(base)}

import { ThemeProvider } from "@/components/theme-provider";
import i18n from "@/i18n/config";
import { getDirectionForLocale, getLocaleFromPathname } from "@/lib/i18n";

function RouteLocaleSync() {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  const direction = getDirectionForLocale(locale);

  React.useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    void i18n.changeLanguage(locale);
  }, [direction, locale]);

  return null;
}

function AppShellProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  const direction = getDirectionForLocale(locale);

  return (
    ${getDirectionProviderOpen(base, "direction")}
      ${getTooltipProviderOpen(base)}
        <RouteLocaleSync />
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
      <AppShellProviders>{children}</AppShellProviders>
    </ThemeProvider>
  );
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
