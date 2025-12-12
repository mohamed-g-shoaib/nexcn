"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Extend DropdownMenu to accept dir prop
declare module "@/components/ui/dropdown-menu" {
  interface DropdownMenuProps {
    dir?: "ltr" | "rtl";
  }
}

interface ModeToggleProps {
  translations: {
    light: string;
    dark: string;
    system: string;
    toggleLabel: string;
  };
  dir?: "ltr" | "rtl";
}

export function ModeToggle({ translations, dir }: ModeToggleProps) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" suppressHydrationWarning={true}>
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">{translations.toggleLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {translations.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {translations.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {translations.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
