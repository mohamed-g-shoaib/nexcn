export function getI18nTemplate(rtl: boolean): string {
  if (!rtl) {
    return `export const locales = ["en"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];
export type Direction = "ltr" | "rtl";

export function isLocale(value: string | undefined): value is Locale {
  return value === "en";
}

export function getDirectionForLocale(_locale: Locale): Direction {
  return "ltr";
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale;
}

export function getLocaleHref(pathname: string, _locale: Locale): string {
  return pathname;
}

export function getLocaleFromPathname(_pathname: string): Locale {
  return "en";
}
`;
  }

  return `export const locales = ["en", "ar"] as const;
export const defaultLocale = "en";

export type Locale = (typeof locales)[number];
export type Direction = "ltr" | "rtl";

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ar";
}

export function getDirectionForLocale(locale: Locale): Direction {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

export function getLocaleHref(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = locale;
    return \`/\${segments.join("/")}\`;
  }

  return pathname === "/" ? \`/\${locale}\` : \`/\${locale}\${pathname}\`;
}

export function getLocaleFromPathname(pathname: string): Locale {
  const localeSegment = pathname.split("/").filter(Boolean)[0];

  return isLocale(localeSegment) ? localeSegment : defaultLocale;
}
`;
}

export function getAppTemplate(rtl: boolean): string {
  if (!rtl) {
    return `import { Route, Routes } from "react-router";

import { NotFoundScreen } from "@/routes/not-found-screen";
import { StarterShell } from "@/components/starter-shell";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StarterShell />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}
`;
  }

  return `import { Navigate, Route, Routes } from "react-router";

import { defaultLocale } from "@/lib/i18n";
import { LocaleStarterPage } from "@/routes/locale-starter-page";
import { NotFoundScreen } from "@/routes/not-found-screen";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to={\`/\${defaultLocale}\`} />} />
      <Route path="/:locale" element={<LocaleStarterPage />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}
`;
}

export function getRouteLocaleHookTemplate(): string {
  return `"use client";

import { useLocation } from "react-router";

import { getDirectionForLocale, getLocaleFromPathname } from "@/lib/i18n";

export function useRouteLocale() {
  const location = useLocation();
  const locale = getLocaleFromPathname(location.pathname);
  const direction = getDirectionForLocale(locale);

  return {
    locale,
    direction,
    pathname: location.pathname,
  };
}
`;
}

export function getI18nConfigTemplate(): string {
  return `import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import { defaultLocale, getLocaleFromPathname, locales } from "@/lib/i18n";

const initialLanguage =
  typeof window === "undefined"
    ? defaultLocale
    : getLocaleFromPathname(window.location.pathname);

void i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
    fallbackLng: defaultLocale,
    supportedLngs: [...locales],
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;
`;
}

export function getTranslationFileTemplate(locale: "en" | "ar"): string {
  if (locale === "en") {
    return `{
  "StarterShell": {
    "eyebrow": "Forge",
    "heading": "Your starter is ready to customize.",
    "description": "Replace this screen in src/App.tsx. Edit src/components/ for UI pieces, src/routes/ for route surfaces, or public/locales/ for translated copy."
  },
  "ThemeToggle": {
    "toLightLabel": "Light",
    "toDarkLabel": "Dark"
  },
  "LanguageToggle": {
    "label": "Arabic"
  },
  "Fallback": {
    "eyebrow": "Forge",
    "notFoundTitle": "Page not found.",
    "notFoundDescription": "This route does not exist yet.",
    "errorTitle": "Something went wrong.",
    "errorDescription": "An unexpected error occurred. Please try again.",
    "homeLabel": "Go home",
    "retryLabel": "Try again"
  }
}
`;
  }

  return `{
  "StarterShell": {
    "eyebrow": "فورج",
    "heading": "الواجهة جاهزة لتبدأ التعديل.",
    "description": "استبدل هذه الشاشة من src/App.tsx. عدل src/components/ لعناصر الواجهة، أو src/routes/ لأسطح المسارات، أو public/locales/ للنصوص المترجمة."
  },
  "ThemeToggle": {
    "toLightLabel": "فاتح",
    "toDarkLabel": "داكن"
  },
  "LanguageToggle": {
    "label": "English"
  },
  "Fallback": {
    "eyebrow": "فورج",
    "notFoundTitle": "الصفحة غير موجودة.",
    "notFoundDescription": "هذا المسار غير موجود بعد.",
    "errorTitle": "حدث خطأ ما.",
    "errorDescription": "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    "homeLabel": "العودة للرئيسية",
    "retryLabel": "أعد المحاولة"
  }
}
`;
}

export function getLocaleStarterPageTemplate(): string {
  return `import { Navigate, useParams } from "react-router";

import { StarterShell } from "@/components/starter-shell";
import { defaultLocale, isLocale } from "@/lib/i18n";

export function LocaleStarterPage() {
  const params = useParams();

  if (!isLocale(params.locale)) {
    return <Navigate replace to={\`/\${defaultLocale}\`} />;
  }

  return <StarterShell />;
}
`;
}

export function getNotFoundScreenTemplate(rtl: boolean): string {
  if (!rtl) {
    return `import { FallbackActions } from "@/components/fallback-actions";
import { FallbackScreen } from "@/components/fallback-screen";

export function NotFoundScreen() {
  return (
    <FallbackScreen
      title="Page not found."
      description="This route does not exist yet."
      action={<FallbackActions homeHref="/" homeLabel="Go home" />}
    />
  );
}
`;
  }

  return `import { useTranslation } from "react-i18next";

import { FallbackActions } from "@/components/fallback-actions";
import { FallbackScreen } from "@/components/fallback-screen";
import { defaultLocale, getLocaleHref } from "@/lib/i18n";
import { useRouteLocale } from "@/hooks/use-route-locale";

export function NotFoundScreen() {
  const { t } = useTranslation();
  const { direction, locale, pathname } = useRouteLocale();
  const homeHref = pathname === "/" ? \`/\${defaultLocale}\` : getLocaleHref("/", locale);

  return (
    <FallbackScreen
      eyebrow={t("Fallback.eyebrow")}
      locale={locale}
      direction={direction}
      title={t("Fallback.notFoundTitle")}
      description={t("Fallback.notFoundDescription")}
      action={<FallbackActions homeHref={homeHref} homeLabel={t("Fallback.homeLabel")} />}
    />
  );
}
`;
}
