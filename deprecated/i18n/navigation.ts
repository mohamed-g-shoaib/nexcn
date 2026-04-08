import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation helpers for next-intl
 *
 * This module creates navigation components and hooks that automatically
 * handle locale prefixes in URLs. Use these instead of Next.js's default
 * Link, usePathname, useRouter, etc. for internal navigation.
 *
 * Usage:
 * - Use `Link` for all internal navigation (automatically includes locale prefix)
 * - Use `usePathname` to get the current path without locale prefix
 * - Use `useRouter` for programmatic navigation with locale support
 * - Use `redirect` for server-side redirects with locale support
 */
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
