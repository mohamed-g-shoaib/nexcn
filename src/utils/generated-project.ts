import path from "node:path";
import type { GenerationContext, ResolvedGenerationPaths } from "../types.js";
import { pathExists } from "./fs.js";

export async function resolveGeneratedProjectPaths(
  context: GenerationContext
): Promise<ResolvedGenerationPaths> {
  const nestedProjectDirectory = path.join(context.targetDirectory, context.config.projectName);
  const nestedPackageJson = path.join(nestedProjectDirectory, "package.json");
  const directPackageJson = path.join(context.targetDirectory, "package.json");

  if (await pathExists(nestedPackageJson)) {
    return {
      requestedTargetDirectory: context.targetDirectory,
      projectDirectory: nestedProjectDirectory
    };
  }

  if (await pathExists(directPackageJson)) {
    return {
      requestedTargetDirectory: context.targetDirectory,
      projectDirectory: context.targetDirectory
    };
  }

  throw new Error(
    `Could not resolve the generated project directory inside ${context.targetDirectory}.`
  );
}
