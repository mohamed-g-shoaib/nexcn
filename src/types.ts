export type Framework = "next" | "vite" | "start";
export type BaseLibrary = "base" | "radix";
export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";
export type LocalePair = "en-ar";
export type CodeQualityTooling = "biome" | "eslint-prettier" | "oxlint-oxfmt";

export type DirectionMode = "rtl" | "ltr";

export type ForgeConfig = {
  projectName: string;
  framework: Framework;
  frameworkLabel: "Next.js" | "Vite" | "TanStack Start";
  base: BaseLibrary;
  rtl: boolean;
  direction: DirectionMode;
  localePair: LocalePair;
  packageManager: PackageManager;
  presetCode: "b1VlIwYS";
  presetFamily: "luma";
  codeQuality: CodeQualityTooling;
  codeQualityLabel: "Biome" | "ESLint + Prettier" | "Oxlint + Oxfmt";
  starterLocales: {
    ltr: "en";
    rtl: "ar";
  };
};

export type ForgeConfigInput = {
  projectName: string;
  framework: Framework;
  base: BaseLibrary;
  rtl: boolean;
  packageManager?: PackageManager;
  codeQuality?: CodeQualityTooling;
};

export type ScaffoldCommand = {
  command: string;
  args: string[];
};

export type GenerationContext = {
  cwd: string;
  config: ForgeConfig;
  targetDirectory: string;
};

export type ResolvedGenerationPaths = {
  requestedTargetDirectory: string;
  projectDirectory: string;
};

export type GenerateOptions = {
  dryRun: boolean;
  outputRoot?: string;
};

export type OverlayPlan = {
  name: string;
  description: string;
};

export type FeaturePlan = {
  name: string;
  description: string;
};

export type VerificationStep = {
  name: string;
  command: string;
  args: string[];
};
