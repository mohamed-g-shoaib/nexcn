import { forgeConfigInputSchema } from "./schema.js";
import type { CodeQualityTooling, ForgeConfig, ForgeConfigInput, Framework } from "../types.js";

const frameworkLabels: Record<Framework, ForgeConfig["frameworkLabel"]> = {
  next: "Next.js",
  vite: "Vite",
  start: "TanStack Start"
};

const codeQualityLabels: Record<CodeQualityTooling, ForgeConfig["codeQualityLabel"]> = {
  biome: "Biome",
  "eslint-prettier": "ESLint + Prettier",
  "oxlint-oxfmt": "Oxlint + Oxfmt"
};

export function normalizeConfig(input: ForgeConfigInput): ForgeConfig {
  const parsed = forgeConfigInputSchema.parse(input);

  return {
    projectName: parsed.projectName,
    framework: parsed.framework,
    frameworkLabel: frameworkLabels[parsed.framework],
    base: parsed.base,
    rtl: parsed.rtl,
    direction: parsed.rtl ? "rtl" : "ltr",
    localePair: "en-ar",
    packageManager: parsed.packageManager ?? "pnpm",
    presetCode: "b1VlIwYS",
    presetFamily: "luma",
    codeQuality: parsed.codeQuality ?? "biome",
    codeQualityLabel: codeQualityLabels[parsed.codeQuality ?? "biome"],
    starterLocales: {
      ltr: "en",
      rtl: "ar"
    }
  };
}
