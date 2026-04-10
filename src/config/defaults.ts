import type { ForgeConfigInput } from "../types.js";

export const cliDefaultInput: ForgeConfigInput = {
  projectName: "my-app",
  framework: "next",
  base: "base",
  rtl: false,
  packageManager: "pnpm",
  codeQuality: "biome"
};

export const firstHappyPathInput: ForgeConfigInput = cliDefaultInput;
