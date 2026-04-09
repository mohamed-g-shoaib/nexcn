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
    return `import * as React from "react";
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

  return `import * as React from "react";
${getDirectionProviderImport(base)}

import type { Locale } from "@/lib/i18n";
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
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <LocaleProvider locale={locale}>
        <AppShellProviders>{children}</AppShellProviders>
      </LocaleProvider>
    </ThemeProvider>
  );
}
`;
}

export function getLocaleHookTemplate(rtl: boolean): string {
  if (!rtl) {
    return `import * as React from "react";

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
    "Replace this screen in src/routes/index.tsx. Edit src/components/ for UI pieces, or app-providers.tsx for theme and root provider composition.",
  themeToggleFallbackLabel: "Theme",
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

  return `import * as React from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

import {
  type Direction,
  type Locale,
  getAlternateLocale,
  getDirectionForLocale,
  getLocaleHref,
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
      "Replace this screen in src/routes/$locale/index.tsx. Edit src/components/ for UI pieces, or app-providers.tsx for theme, language, and root provider composition.",
    themeToggleFallbackLabel: "Theme",
    themeToggleToLightLabel: "Light",
    themeToggleToDarkLabel: "Dark",
    languageLabel: "Arabic",
  },
  ar: {
    eyebrow: "فورج",
    heading: "الواجهة جاهزة لتبدأ التعديل.",
    description:
      "استبدل هذه الشاشة من src/routes/$locale/index.tsx. عدل src/components/ لعناصر الواجهة، أو app-providers.tsx للمظهر واللغة وبنية المزودات العامة.",
    themeToggleFallbackLabel: "المظهر",
    themeToggleToLightLabel: "فاتح",
    themeToggleToDarkLabel: "داكن",
    languageLabel: "English",
  },
};

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const direction = getDirectionForLocale(locale);
  const nextLocale = getAlternateLocale(locale);

  const value = React.useMemo<LocaleContextValue>(
    () => ({
      locale,
      direction,
      messages: MESSAGES[locale],
      nextLocale,
      switchLocale: () => {
        React.startTransition(() => {
          navigate({
            to: getLocaleHref(location.pathname, nextLocale),
          });
        });
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
  return `import * as React from "react";
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
  mounted: boolean;
  setTheme: (theme: Theme) => void;
};

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";
const THEME_VALUES: Array<Theme> = ["dark", "light", "system"];

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined);

function isTheme(value: string | null): value is Theme {
  if (value === null) {
    return false;
  }

  return THEME_VALUES.includes(value as Theme);
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

function getSystemTheme(): ResolvedTheme {
  if (typeof window !== "undefined" && window.matchMedia(COLOR_SCHEME_QUERY).matches) {
    return "dark";
  }

  return "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

function ThemeHotkey({ mounted }: { mounted: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { playSound } = useUiSound();

  const toggleTheme = useEffectEvent(() => {
    if (!mounted) {
      return;
    }

    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    playSound(nextTheme === "dark" ? "switch-off" : "switch-on");
  });

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!mounted || event.defaultPrevented || event.repeat) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key.toLowerCase() !== "d") {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      toggleTheme();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mounted]);

  return null;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  disableTransitionOnChange = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      if (typeof window === "undefined") {
        return;
      }

      window.localStorage.setItem(storageKey, nextTheme);
      setThemeState(nextTheme);
    },
    [storageKey],
  );

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey);
    const nextTheme = isTheme(storedTheme) ? storedTheme : defaultTheme;

    setThemeState(nextTheme);
    setMounted(true);
  }, [defaultTheme, storageKey]);

  React.useEffect(() => {
    const root = document.documentElement;
    const cleanup = disableTransitionOnChange ? disableTransitionsTemporarily() : null;
    const resolvedTheme = resolveTheme(theme);

    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;

    return () => {
      cleanup?.();
    };
  }, [disableTransitionOnChange, theme]);

  React.useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);
    const onChange = () => {
      setThemeState((currentTheme) => (currentTheme === "system" ? "system" : currentTheme));
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(getSystemTheme());
      document.documentElement.style.colorScheme = getSystemTheme();
    };

    mediaQuery.addEventListener("change", onChange);

    return () => {
      mediaQuery.removeEventListener("change", onChange);
    };
  }, [theme]);

  const value = React.useMemo<ThemeProviderState>(
    () => ({
      theme,
      resolvedTheme: resolveTheme(theme),
      mounted,
      setTheme,
    }),
    [mounted, setTheme, theme],
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      <ThemeHotkey mounted={mounted} />
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme(): ThemeProviderState {
  const context = React.useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}
`;
}

export function getUiSoundHookTemplate(): string {
  return `import * as React from "react";

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
