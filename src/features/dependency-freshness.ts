import path from "node:path";
import type { FeaturePlan, GenerationContext } from "../types.js";
import type { FeaturePack } from "./types.js";
import { fetchLatestPackageVersion, readPackageJson, writePackageJson } from "../utils/index.js";

const RANGE_PREFIX = "^";
const NON_REGISTRY_PROTOCOLS = ["workspace:", "file:", "link:", "git+", "github:", "http:", "https:"];

function isRegistryDependency(version: string): boolean {
  return !NON_REGISTRY_PROTOCOLS.some((prefix) => version.startsWith(prefix));
}

async function normalizeDependencyBlock(
  dependencies: Record<string, string> | undefined
): Promise<Record<string, string> | undefined> {
  if (!dependencies) {
    return dependencies;
  }

  const normalizedEntries = await Promise.all(
    Object.entries(dependencies).map(async ([packageName, version]) => {
      if (!isRegistryDependency(version)) {
        return [packageName, version] as const;
      }

      const latestVersion = await fetchLatestPackageVersion(packageName);
      return [packageName, `${RANGE_PREFIX}${latestVersion}`] as const;
    })
  );

  return Object.fromEntries(normalizedEntries);
}

export class DependencyFreshnessFeaturePack implements FeaturePack {
  readonly name = "dependency-freshness";

  applies(): boolean {
    return true;
  }

  plan(context: GenerationContext): FeaturePlan {
    return {
      name: this.name,
      description: `Normalize direct dependencies to current npm latest versions for ${context.config.frameworkLabel}.`
    };
  }

  async apply(_: GenerationContext, projectDirectory: string): Promise<void> {
    const packageJsonPath = path.join(projectDirectory, "package.json");
    const packageJson = await readPackageJson(packageJsonPath);

    packageJson.dependencies = await normalizeDependencyBlock(packageJson.dependencies);
    packageJson.devDependencies = await normalizeDependencyBlock(packageJson.devDependencies);

    await writePackageJson(packageJsonPath, packageJson);
  }
}
