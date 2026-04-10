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
`;
}

export function getAppTemplate(rtl: boolean): string {
  if (!rtl) {
    return `import { Route, Routes, useLocation, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { FallbackScreen } from "@/components/fallback-screen";
import { useUiSound } from "@/hooks/use-ui-sound";
import { StarterShell } from "@/components/starter-shell";

function NotFoundScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { playSound } = useUiSound();
  const routeLocale = location.pathname.split("/").filter(Boolean)[0];
  const copy =
    routeLocale === "ar"
      ? {
          title: "الصفحة غير موجودة.",
          description: "هذا المسار غير موجود بعد في الواجهة المولدة.",
          backLabel: "الرجوع",
          homeLabel: "العودة للرئيسية"
        }
      : {
          title: "Page not found.",
          description: "This route does not exist in the generated starter yet.",
          backLabel: "Go back",
          homeLabel: "Go home"
        };
  const segments = location.pathname.split("/").filter(Boolean);
  const homeHref = segments.length > 0 && (segments[0] === "en" || segments[0] === "ar") ? \`/\${segments[0]}\` : "/";

  return (
    <FallbackScreen
      title={copy.title}
      description={copy.description}
      action={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full px-3"
            onClick={() => {
              playSound("click-soft");
              window.history.back();
            }}
          >
            {copy.backLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full px-3"
            onClick={() => {
              playSound("click-soft");
              navigate(homeHref);
            }}
          >
            {copy.homeLabel}
          </Button>
        </>
      }
    />
  );
}

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

  return `import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { FallbackScreen } from "@/components/fallback-screen";
import { useUiSound } from "@/hooks/use-ui-sound";
import { StarterShell } from "@/components/starter-shell";
import { defaultLocale, isLocale } from "@/lib/i18n";

function LocaleStarterPage() {
  const params = useParams();

  if (!isLocale(params.locale)) {
    return <Navigate replace to={\`/\${defaultLocale}\`} />;
  }

  return <StarterShell />;
}

function NotFoundScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { playSound } = useUiSound();
  const routeLocale = location.pathname.split("/").filter(Boolean)[0];
  const copy =
    routeLocale === "ar"
      ? {
          title: "الصفحة غير موجودة.",
          description: "هذا المسار غير موجود بعد في الواجهة المولدة.",
          backLabel: "الرجوع",
          homeLabel: "العودة للرئيسية"
        }
      : {
          title: "Page not found.",
          description: "This route does not exist in the generated starter yet.",
          backLabel: "Go back",
          homeLabel: "Go home"
        };
  const segments = location.pathname.split("/").filter(Boolean);
  const homeHref = segments.length > 0 && (segments[0] === "en" || segments[0] === "ar") ? \`/\${segments[0]}\` : "/";

  return (
    <FallbackScreen
      title={copy.title}
      description={copy.description}
      action={
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full px-3"
            onClick={() => {
              playSound("click-soft");
              window.history.back();
            }}
          >
            {copy.backLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-full px-3"
            onClick={() => {
              playSound("click-soft");
              navigate(homeHref);
            }}
          >
            {copy.homeLabel}
          </Button>
        </>
      }
    />
  );
}

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
