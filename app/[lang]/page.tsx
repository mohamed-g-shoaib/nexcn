import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { getDictionary, hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main
        className={`flex min-h-screen w-full max-w-6xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start ${
          lang === "ar" ? "sm:items-end" : ""
        }`}
      >
        <div
          className={`absolute top-4 ${
            lang === "ar" ? "left-4" : "right-4"
          } flex gap-2 ${lang === "ar" ? "flex-row-reverse" : ""}`}
        >
          <LanguageToggle
            translations={dict.languages}
            dir={lang === "ar" ? "rtl" : "ltr"}
          />
          <ModeToggle
            translations={dict.theme}
            dir={lang === "ar" ? "rtl" : "ltr"}
          />
        </div>
        <Image
          className="dark:invert"
          src="/mg-8bit.svg"
          alt="MG 8-bit logo"
          width={100}
          height={46}
          priority
        />
        <div
          className={`flex flex-col items-center gap-6 text-center sm:items-start ${
            lang === "ar" ? "sm:text-right sm:items-end" : "sm:text-left"
          }`}
        >
          <h1 className="max-w-lg text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {dict.content.title}
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {dict.content.description.start}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              {dict.content.description.templates}
            </a>
            {dict.content.description.middle}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              {dict.content.description.learning}
            </a>
            {dict.content.description.end}
          </p>
        </div>
        <div
          className={`flex flex-col gap-4 text-base font-medium sm:flex-row ${
            lang === "ar" ? "sm:flex-row-reverse" : ""
          }`}
        >
          <a
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px] ${
              lang === "ar" ? "flex-row-reverse" : ""
            }`}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            {dict.navigation.deploy}
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            {dict.navigation.documentation}
          </a>
        </div>
      </main>
    </div>
  );
}
