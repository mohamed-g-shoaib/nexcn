import { access, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { constants } from "node:fs";

export async function ensureParentDirectory(targetDirectory: string): Promise<void> {
  const parentDirectory = path.dirname(targetDirectory);
  await mkdir(parentDirectory, { recursive: true });
}

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function pruneFixtureArtifacts(projectDirectory: string): Promise<void> {
  await Promise.all([
    rm(path.join(projectDirectory, "node_modules"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, ".next"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, "dist"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, "coverage"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, "tsconfig.tsbuildinfo"), { force: true })
  ]);
}
