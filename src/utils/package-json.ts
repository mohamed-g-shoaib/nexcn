import { readFile, writeFile } from "node:fs/promises";

type PackageJsonShape = {
  name?: string;
  version?: string;
  private?: boolean;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export async function readPackageJson(packageJsonPath: string): Promise<PackageJsonShape> {
  const packageJson = await readFile(packageJsonPath, "utf8");
  return JSON.parse(packageJson) as PackageJsonShape;
}

export async function writePackageJson(
  packageJsonPath: string,
  packageJson: PackageJsonShape
): Promise<void> {
  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");
}
