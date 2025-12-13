"use client";

import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      storageKey="nexcn-theme"
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-black">
        <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
          {/* Logo */}
          <Image
            className="dark:invert"
            src="/nexcn.svg"
            alt="Nexcn logo"
            width={64}
            height={64}
            style={{ width: "64px", height: "64px" }}
          />

          {/* 404 */}
          <div className="text-8xl font-bold text-zinc-900 dark:text-zinc-50">
            404
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-zinc-600 dark:text-zinc-400">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          {/* Button */}
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="w-full cursor-pointer sm:flex-1"
              size="lg"
            >
              Go Back
            </Button>
            <Button
              render={<Link href="/" />}
              className="w-full cursor-pointer sm:flex-1"
              size="lg"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
