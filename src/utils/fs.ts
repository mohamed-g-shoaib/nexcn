import { access, mkdir, readdir, rm } from "node:fs/promises";
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

export async function isDirectoryEmpty(targetDirectory: string): Promise<boolean> {
  const entries = await readdir(targetDirectory);
  return entries.length === 0;
}

export async function pruneFixtureArtifacts(projectDirectory: string): Promise<void> {
  await Promise.all([
    rm(path.join(projectDirectory, ".git"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, "node_modules"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, ".next"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, ".output"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, ".tanstack"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, "dist"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, "coverage"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, "tsconfig.tsbuildinfo"), { force: true })
  ]);
}

export async function resetProjectInstallArtifacts(projectDirectory: string): Promise<void> {
  await Promise.all([
    rm(path.join(projectDirectory, "node_modules"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, ".pnp.cjs"), { force: true }),
    rm(path.join(projectDirectory, ".pnp.loader.mjs"), { force: true }),
    rm(path.join(projectDirectory, "package-lock.json"), { force: true }),
    rm(path.join(projectDirectory, "pnpm-lock.yaml"), { force: true }),
    rm(path.join(projectDirectory, "yarn.lock"), { force: true }),
    rm(path.join(projectDirectory, "bun.lock"), { force: true }),
    rm(path.join(projectDirectory, "bun.lockb"), { force: true })
  ]);
}
