"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations();

  return (
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
          {t("notFound.title")}
        </h1>

        {/* Description */}
        <p className="text-zinc-600 dark:text-zinc-400">
          {t("notFound.description")}
        </p>

        {/* Button */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full cursor-pointer sm:flex-1"
            size="lg"
          >
            {t("notFound.back")}
          </Button>
          <Button
            render={<Link href="/" />}
            className="w-full cursor-pointer sm:flex-1"
            size="lg"
          >
            {t("notFound.home")}
          </Button>
        </div>
      </div>
    </div>
  );
}
