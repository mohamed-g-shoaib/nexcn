"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Extend NavigationMenu to accept dir prop
declare module "@/components/ui/navigation-menu" {
  interface NavigationMenuProps {
    dir?: "ltr" | "rtl";
  }
}

interface NavigationProps {
  dir?: "ltr" | "rtl";
}

export function Navigation({ dir }: NavigationProps) {
  const t = useTranslations();

  return (
    <NavigationMenu dir={dir}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">{t("navigation.home")}</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {t("navigation.resources")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 p-6 no-underline transition-all outline-none select-none hover:from-amber-500/15 hover:via-orange-500/15 hover:to-rose-500/15 focus:shadow-md"
                    href="/docs"
                  >
                    <div className="mb-2 text-lg font-medium">Nexcn</div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      {t("navigation.nexcnDescription")}
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="https://nextjs.org"
                title={t("navigation.nextjs")}
              >
                {t("navigation.nextjsDescription")}
              </ListItem>
              <ListItem
                href="https://ui.shadcn.com"
                title={t("navigation.shadcn")}
              >
                {t("navigation.shadcnDescription")}
              </ListItem>
              <ListItem
                href="https://next-intl.dev/docs/getting-started/app-router"
                title={t("navigation.nextIntl")}
              >
                {t("navigation.nextIntlDescription")}
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
