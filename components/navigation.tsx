/**
 * Navigation Component
 *
 * Main navigation menu with dropdown for resources.
 *
 * To customize:
 * - Update navigation links and labels in messages/en.json and messages/ar.json
 * - Add or remove menu items in the NavigationMenuList below
 * - Update resource links in the Resources dropdown
 * - Remove the "Resources" dropdown if not needed for your project
 */

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
        {/* Home Link - Update or add more top-level links here */}
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link href="/" />}
          >
            {t("navigation.home")}
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Resources Dropdown - Update links below or remove this section */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            {t("navigation.resources")}
          </NavigationMenuTrigger>
          <NavigationMenuContent
            className={dir === "rtl" ? "text-right" : "text-left"}
          >
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                {/* Featured Card - Update or remove this promotional card */}
                <NavigationMenuLink
                  render={
                    <Link
                      className={`flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 p-6 no-underline transition-all outline-none select-none hover:from-amber-500/15 hover:via-orange-500/15 hover:to-rose-500/15 focus:shadow-md ${
                        dir === "rtl"
                          ? "items-end text-right"
                          : "items-start text-left"
                      }`}
                      href="/docs" // Update this link
                    />
                  }
                >
                  <div className="mb-2 w-full text-lg font-medium">Nexcn</div>{" "}
                  {/* Update brand name */}
                  <p className="text-muted-foreground w-full text-sm leading-tight">
                    {t("navigation.nexcnDescription")}
                  </p>
                </NavigationMenuLink>
              </li>
              {/* Resource Links - Update these to match your project's documentation */}
              <ListItem
                dir={dir}
                href="https://nextjs.org"
                title={t("navigation.nextjs")}
              >
                {t("navigation.nextjsDescription")}
              </ListItem>
              <ListItem
                dir={dir}
                href="https://base-ui.com"
                title={t("navigation.baseUi")}
              >
                {t("navigation.baseUiDescription")}
              </ListItem>
              <ListItem
                dir={dir}
                href="https://ui.shadcn.com/docs/components"
                title={t("navigation.shadcn")}
              >
                {t("navigation.shadcnDescription")}
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
  dir,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link
            href={href}
            className={`group/link hover:bg-accent focus:bg-accent flex flex-col rounded-md p-3 leading-none no-underline transition-colors outline-none select-none ${
              dir === "rtl" ? "items-end text-right" : "items-start text-left"
            }`}
          />
        }
      >
        <div className="text-foreground w-full text-sm leading-none font-medium transition-colors group-hover/link:!text-white dark:group-hover/link:!text-black">
          {title}
        </div>
        <p className="text-muted-foreground line-clamp-2 w-full text-sm leading-snug transition-colors group-hover/link:!text-white dark:group-hover/link:!text-black">
          {children}
        </p>
      </NavigationMenuLink>
    </li>
  );
}
