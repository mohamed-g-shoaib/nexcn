/**
 * RTL Language Utility
 *
 * Centralized configuration for right-to-left language support.
 * Add or remove language codes as needed.
 */

// List of right-to-left language codes
const RTL_LANGUAGES = ["ar", "he", "fa", "ur", "yi"];

/**
 * Determines if a locale uses right-to-left text direction
 * @param locale - Language/locale code (e.g., 'en', 'ar', 'he')
 * @returns true if the locale is RTL
 */
export function isRTLLocale(locale: string): boolean {
  return RTL_LANGUAGES.includes(locale.toLowerCase());
}

/**
 * Get the text direction attribute for HTML
 * @param locale - Language/locale code
 * @returns "rtl" or "ltr"
 */
export function getTextDirection(locale: string): "rtl" | "ltr" {
  return isRTLLocale(locale) ? "rtl" : "ltr";
}

/**
 * RTL language metadata
 * Useful for font selection and other locale-specific settings
 */
export const RTL_LANGUAGE_CONFIG: Record<
  string,
  { font?: string; name: string }
> = {
  ar: { font: "cairo", name: "Arabic" },
  he: { name: "Hebrew" }, // Add font if needed
  fa: { name: "Persian" }, // Add font if needed
  ur: { name: "Urdu" }, // Add font if needed
  yi: { name: "Yiddish" }, // Add font if needed
};
