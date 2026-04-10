import { z } from "zod";
import { validateProjectName } from "./project-name.js";

export const frameworkSchema = z.enum(["next", "vite", "start"]);
export const baseLibrarySchema = z.enum(["base", "radix"]);
export const packageManagerSchema = z.enum(["pnpm", "npm", "yarn", "bun"]);
export const codeQualityToolingSchema = z.enum(["biome", "eslint-prettier", "oxlint-oxfmt"]);

export const forgeConfigInputSchema = z.object({
  projectName: z
    .string()
    .trim()
    .superRefine((value, context) => {
      const result = validateProjectName(value, { allowCurrentDirectory: true });

      if (!result.valid) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error ?? 'Project name must use lowercase kebab-case or "." for the current directory',
        });
      }
    }),
  framework: frameworkSchema,
  base: baseLibrarySchema,
  rtl: z.boolean(),
  packageManager: packageManagerSchema.optional(),
  codeQuality: codeQualityToolingSchema.optional()
});
