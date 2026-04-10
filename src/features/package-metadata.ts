import path from "node:path";
import type { FeaturePlan, GenerationContext } from "../types.js";
import type { FeaturePack } from "./types.js";
import { readPackageJson, writePackageJson } from "../utils/index.js";

export class PackageMetadataFeaturePack implements FeaturePack {
  readonly name = "package-metadata";

  applies(): boolean {
    return true;
  }

  plan(context: GenerationContext): FeaturePlan {
    return {
      name: this.name,
      description: `Normalize package.json metadata to match user-provided project name: ${context.config.projectName}.`
    };
  }

  async apply(context: GenerationContext, projectDirectory: string): Promise<void> {
    const packageJsonPath = path.join(projectDirectory, "package.json");
    const packageJson = await readPackageJson(packageJsonPath);

    packageJson.name = context.config.projectName;

    await writePackageJson(packageJsonPath, packageJson);
  }
}
