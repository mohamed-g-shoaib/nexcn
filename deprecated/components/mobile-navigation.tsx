/**
 * Mobile Navigation Component
 *
 * Mobile-friendly drawer navigation using Base UI Drawer component.
 * Appears on screens below md (768px) breakpoint.
 * Displays navigation items, language switcher, and theme switcher in a drawer.
 *
 * Features:
 * - Drawer slides up from bottom with swipe-to-close gesture
 * - RTL support for Arabic with proper text direction
 * - Multi-button language switcher (EN / ع) with locale routing
 * - Multi-button theme switcher (System / Light / Dark)
 * - Auto-closes drawer when navigation item is clicked
 * - Accessible with keyboard navigation and ARIA labels
 * - Icon + text button [icon | word] layout with consistent gap-2 spacing
 *
 * Layout Structure:
 * - Header: Navigation title and description
 * - Navigation links: Home and resource links
 * - Switchers section: Language and theme multi-button controls
 *
 * To customize:
 * - Update navigation items in the nav section
 * - Add or remove resource links
 * - Modify drawer trigger button styling and labels
 * - Adjust spacing and colors as needed
 */

"use client";

import * as React from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcherMultiButton } from "@/components/theme-switcher-multi-button";
import { LanguageSwitcherMultiButton } from "@/components/language-switcher-multi-button";

interface MobileNavigationProps {
  dir?: "ltr" | "rtl";
}

export function MobileNavigation({ dir }: MobileNavigationProps) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);

  // Close drawer when navigation item is clicked
  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="bottom">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
          <span className="text-sm font-medium">{t("navigation.menu")}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className={dir === "rtl" ? "text-right" : "text-left"}>
          <DrawerTitle>{t("navigation.resources")}</DrawerTitle>
          <DrawerDescription>
            {t("navigation.nexcnDescription")}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 p-4">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                className={`justify-start ${dir === "rtl" ? "text-right" : "text-left"}`}
                render={<Link href="/" />}
                onClick={handleNavClick}
              >
                {t("navigation.home")}
              </Button>
            </DrawerClose>

            <Separator />

            {/* Resources Section */}
            <div className="flex flex-col gap-2">
              <p
                className={`text-muted-foreground px-2 text-sm font-medium ${dir === "rtl" ? "text-right" : "text-left"}`}
              >
                {t("navigation.resources")}
              </p>

              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  className={`justify-start ${dir === "rtl" ? "text-right" : "text-left"}`}
                  render={
                    <a
                      href="https://nextjs.org"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  onClick={handleNavClick}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium">
                      {t("navigation.nextjs")}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {t("navigation.nextjsDescription")}
                    </span>
                  </div>
                </Button>
              </DrawerClose>

              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  className={`justify-start ${dir === "rtl" ? "text-right" : "text-left"}`}
                  render={
                    <a
                      href="https://base-ui.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  onClick={handleNavClick}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium">
                      {t("navigation.baseUi")}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {t("navigation.baseUiDescription")}
                    </span>
                  </div>
                </Button>
              </DrawerClose>

              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  className={`justify-start ${dir === "rtl" ? "text-right" : "text-left"}`}
                  render={
                    <a
                      href="https://ui.shadcn.com/docs/components"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  onClick={handleNavClick}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium">
                      {t("navigation.shadcn")}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {t("navigation.shadcnDescription")}
                    </span>
                  </div>
                </Button>
              </DrawerClose>
            </div>
          </nav>

          <Separator />

          {/* Settings */}
          <div className="flex flex-col gap-3">
            <p
              className={`text-muted-foreground px-2 text-sm font-medium ${dir === "rtl" ? "text-right" : "text-left"}`}
            >
              {t("navigation.settings")}
            </p>

            {/* Language Switcher */}
            <div className="flex items-center justify-between px-2">
              <span className="text-sm">{t("navigation.language")}</span>
              <LanguageSwitcherMultiButton />
            </div>

            {/* Theme Switcher */}
            <div className="flex items-center justify-between px-2">
              <span className="text-sm">{t("navigation.theme")}</span>
              <ThemeSwitcherMultiButton />
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
