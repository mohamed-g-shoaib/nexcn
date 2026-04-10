import type { BaseLibrary, CodeQualityTooling, Framework } from "../types.js";

export const ASCII_BANNER = `███████╗ ██████╗ ██████╗  ██████╗ ███████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
█████╗  ██║   ██║██████╔╝██║  ███╗█████╗
██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝
██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝`;

export const frameworkLabels: Record<Framework, string> = {
  next: "Next.js",
  vite: "Vite",
  start: "TanStack Start"
};

export const baseLabels: Record<BaseLibrary, string> = {
  base: "Base UI",
  radix: "Radix UI"
};

export const codeQualityLabels: Record<CodeQualityTooling, string> = {
  biome: "Biome",
  "eslint-prettier": "ESLint + Prettier",
  "oxlint-oxfmt": "Oxlint + Oxfmt"
};
