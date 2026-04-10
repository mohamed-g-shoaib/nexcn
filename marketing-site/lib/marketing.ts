export type PackageManager = "pnpm" | "npm" | "yarn" | "bun"
export type StackVisual =
  | "base"
  | "biome"
  | "bun"
  | "eslint"
  | "next"
  | "npm"
  | "oxc"
  | "pnpm"
  | "prettier"
  | "radix"
  | "tanstack"
  | "vite"
  | "yarn"

export type MarketingOptions = {
  framework: "next" | "vite" | "start"
  base: "base" | "radix"
  direction: "ltr" | "rtl"
  codeQuality: "oxlint-oxfmt" | "biome" | "eslint-prettier"
}

export const DEFAULT_OPTIONS: MarketingOptions = {
  framework: "next",
  base: "base",
  direction: "ltr",
  codeQuality: "oxlint-oxfmt",
}

type OptionWithIcon<Value extends string> = {
  value: Value
  label: string
  icons?: readonly StackVisual[]
}

export const PACKAGE_MANAGERS = [
  { value: "pnpm", label: "pnpm", icons: ["pnpm"] },
  { value: "npm", label: "npm", icons: ["npm"] },
  { value: "yarn", label: "yarn", icons: ["yarn"] },
  { value: "bun", label: "bun", icons: ["bun"] },
] as const satisfies readonly OptionWithIcon<PackageManager>[]

export const MARKETING_STACK = [
  { label: "Next.js", icons: ["next"] },
  { label: "Vite", icons: ["vite"] },
  { label: "TanStack Start", icons: ["tanstack"] },
  { label: "Base UI", icons: ["base"] },
  { label: "Radix UI", icons: ["radix"] },
] as const satisfies readonly {
  label: string
  icons: readonly StackVisual[]
}[]

export const OPTION_GROUPS = [
  {
    key: "framework",
    label: "Framework",
    options: [
      { value: "next", label: "Next.js", icons: ["next"] },
      { value: "vite", label: "Vite", icons: ["vite"] },
      { value: "start", label: "TanStack Start", icons: ["tanstack"] },
    ],
  },
  {
    key: "base",
    label: "UI primitives",
    options: [
      { value: "base", label: "Base UI", icons: ["base"] },
      { value: "radix", label: "Radix UI", icons: ["radix"] },
    ],
  },
  {
    key: "direction",
    label: "RTL & Arabic support",
    options: [
      { value: "ltr", label: "No, English only" },
      { value: "rtl", label: "English + Arabic (RTL ready)" },
    ],
  },
  {
    key: "codeQuality",
    label: "Linter & formatter",
    options: [
      { value: "oxlint-oxfmt", label: "Oxlint + Oxfmt", icons: ["oxc"] },
      { value: "biome", label: "Biome", icons: ["biome"] },
      { value: "eslint-prettier", label: "ESLint + Prettier", icons: ["eslint", "prettier"] },
    ],
  },
] as const

function getPrefix(packageManager: PackageManager): string {
  if (packageManager === "pnpm") {
    return "pnpm dlx"
  }

  if (packageManager === "npm") {
    return "npx"
  }

  if (packageManager === "yarn") {
    return "yarn dlx"
  }

  return "bunx --bun"
}

export function buildCommand(
  packageManager: PackageManager,
  options: MarketingOptions,
  projectName: string,
): string {
  const parts = [
    getPrefix(packageManager),
    "create-use-forge@latest",
    "generate",
    "--name",
    projectName,
    "--framework",
    options.framework,
    "--base",
    options.base,
    options.direction === "rtl" ? "--rtl" : "--ltr",
    "--code-quality",
    options.codeQuality,
  ]

  return parts.join(" ")
}

export function buildCreateCommand(packageManager: PackageManager): string {
  if (packageManager === "npm") {
    return "npm create use-forge@latest"
  }

  return `${packageManager} create use-forge`
}
