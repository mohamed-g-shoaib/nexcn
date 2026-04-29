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

function AppShellProviders({
  children
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
  children
}: {
  children: React.ReactNode;
}) {
  return <AppShellProviders>{children}</AppShellProviders>;
}
`;
  }

  return `"use client";

import * as React from "react";
import { useLocale } from "next-intl";
${getDirectionProviderImport(base)}

import { type Locale, getDirectionForLocale } from "@/lib/i18n";

function DocumentRootSync() {
  const locale = useLocale() as Locale;
  const direction = getDirectionForLocale(locale);

  React.useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [direction, locale]);

  return null;
}

function AppShellProviders({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale() as Locale;
  const direction = getDirectionForLocale(locale);

  return (
    ${getDirectionProviderOpen(base, "direction")}
      ${getTooltipProviderOpen(base)}
        <DocumentRootSync />
        {children}
      </Tooltip.Provider>
    ${getDirectionProviderClose(base)}
  );
}

export function AppProviders({
  children
}: {
  children: React.ReactNode;
}) {
  return <AppShellProviders>{children}</AppShellProviders>;
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
