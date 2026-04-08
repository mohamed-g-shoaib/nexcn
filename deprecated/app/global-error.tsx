"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html suppressHydrationWarning>
      <body>
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

              {/* Error Icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                <svg
                  className="h-10 w-10 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-semibold text-black dark:text-white">
                Something went wrong!
              </h1>

              {/* Description */}
              <p className="text-zinc-600 dark:text-zinc-400">
                An unexpected error occurred. Please try again.
              </p>

              {/* Buttons */}
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <Button
                  onClick={reset}
                  className="w-full cursor-pointer sm:flex-1"
                  size="lg"
                >
                  Try Again
                </Button>
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
                  variant="outline"
                  className="w-full cursor-pointer sm:flex-1"
                  size="lg"
                >
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
