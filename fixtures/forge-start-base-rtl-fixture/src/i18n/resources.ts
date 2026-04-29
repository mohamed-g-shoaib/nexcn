export const resources = {
  en: {
    translation: {
      StarterShell: {
        eyebrow: "Forge",
        heading: "Your starter is ready to customize.",
        description:
          "Replace this screen in src/routes/$locale/index.tsx. Edit src/components/ for UI pieces, or src/i18n/resources.ts for translated copy.",
      },
      ThemeToggle: {
        fallbackLabel: "Theme",
        toLightLabel: "Light",
        toDarkLabel: "Dark",
      },
      LanguageToggle: {
        label: "Arabic",
      },
      Fallback: {
        eyebrow: "Forge",
        notFoundTitle: "Page not found.",
        notFoundDescription: "This route does not exist yet.",
        errorTitle: "Something went wrong.",
        errorDescription: "An unexpected error occurred. Please try again.",
        homeLabel: "Go home",
        retryLabel: "Try again",
      },
    },
  },
  ar: {
    translation: {
      StarterShell: {
        eyebrow: "فورج",
        heading: "الواجهة جاهزة لتبدأ التعديل.",
        description:
          "استبدل هذه الشاشة من src/routes/$locale/index.tsx. عدل src/components/ لعناصر الواجهة، أو src/i18n/resources.ts للنصوص المترجمة.",
      },
      ThemeToggle: {
        fallbackLabel: "المظهر",
        toLightLabel: "فاتح",
        toDarkLabel: "داكن",
      },
      LanguageToggle: {
        label: "English",
      },
      Fallback: {
        eyebrow: "فورج",
        notFoundTitle: "الصفحة غير موجودة.",
        notFoundDescription: "هذا المسار غير موجود بعد.",
        errorTitle: "حدث خطأ ما.",
        errorDescription: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        homeLabel: "العودة للرئيسية",
        retryLabel: "أعد المحاولة",
      },
    },
  },
} as const
