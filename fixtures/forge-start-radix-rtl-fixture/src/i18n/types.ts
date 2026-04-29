import { resources } from "@/i18n/resources"

export type TranslationResources = typeof resources
export type TranslationNamespace = keyof TranslationResources["en"]
export type TranslationLocale = keyof TranslationResources
