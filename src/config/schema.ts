import { z } from "zod";

export const frameworkSchema = z.enum(["next", "vite", "start"]);
export const baseLibrarySchema = z.enum(["base", "radix"]);
export const packageManagerSchema = z.enum(["pnpm", "npm", "yarn", "bun"]);
export const codeQualityToolingSchema = z.enum(["biome", "eslint-prettier", "oxlint-oxfmt"]);

export const forgeConfigInputSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .refine(
      (value) => value === "." || /^[a-z0-9-]+$/.test(value),
      'Project name must use lowercase kebab-case or "." for the current directory'
    ),
  framework: frameworkSchema,
  base: baseLibrarySchema,
  rtl: z.boolean(),
  packageManager: packageManagerSchema.optional(),
  codeQuality: codeQualityToolingSchema.optional()
});
