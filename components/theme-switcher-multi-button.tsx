/**
 * Theme Switcher Multi-Button Component
 *
 * A compact multi-button theme switcher that displays all three theme options
 * (System, Light, Dark) in a single integrated button group.
 *
 * Features:
 * - Three theme options: System, Light, Dark
 * - Visual indicator for active theme with animated background
 * - Icon-based UI with accessibility labels and tooltips
 * - Responsive loading state with skeleton buttons
 * - Used in mobile drawer navigation
 *
 * Usage:
 * <ThemeSwitcherMultiButton />
 *
 * To customize:
 * - Change theme options in the themes array
 * - Adjust button size by modifying the h-8 class (currently 32px)
 * - Customize spacing with px-1 and space-x-0 classes
 * - Update icons from lucide-react if needed
 */

"use client";

import * as React from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeSwitcherMultiButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function ThemeSwitcherMultiButton({
  className,
  ...props
}: ThemeSwitcherMultiButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative isolate inline-flex h-8 items-center rounded-full border border-dotted px-1",
          className
        )}
        {...props}
      >
        <div className="flex space-x-0">
          <div className="bg-input size-6 animate-pulse rounded-full" />
          <div className="bg-input size-6 animate-pulse rounded-full" />
          <div className="bg-input size-6 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  type ThemeValue = "system" | "light" | "dark";

  const themes: {
    value: ThemeValue;
    label: string;
    icon: typeof MonitorIcon;
  }[] = [
    { value: "system", label: "Switch to system theme", icon: MonitorIcon },
    { value: "light", label: "Switch to light theme", icon: SunIcon },
    { value: "dark", label: "Switch to dark theme", icon: MoonIcon },
  ];

  return (
    <div
      className={cn(
        "relative isolate inline-flex h-8 items-center rounded-full border border-dotted px-1",
        className
      )}
      {...props}
    >
      {themes.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value;

        return (
          <button
            key={value}
            aria-label={label}
            title={label}
            type="button"
            onClick={() => setTheme(value)}
            className="group relative flex size-6 items-center justify-center rounded-full transition-all duration-200 ease-out"
          >
            {isActive && (
              <div className="bg-muted absolute inset-0 rounded-full transition-all duration-200" />
            )}
            <Icon
              size={14}
              className={cn(
                "relative m-auto transition-all duration-200 ease-out",
                isActive
                  ? "text-foreground scale-100 opacity-100"
                  : "text-secondary-foreground group-hover:text-foreground group-focus-visible:text-foreground scale-90 opacity-70"
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
