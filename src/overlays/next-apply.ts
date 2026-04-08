import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GenerationContext } from "../types.js";
import { getNextOverlayFiles } from "./next/files.js";
import { patchButtonComponent, patchGlobalsCss } from "./next/patches.js";

async function removeLegacyRootFiles(projectDirectory: string): Promise<void> {
  await Promise.all([
    rm(path.join(projectDirectory, "app", "layout.tsx"), { force: true }),
    rm(path.join(projectDirectory, "app", "page.tsx"), { force: true })
  ]);
}

async function writeOverlayFiles(fileWrites: Map<string, string>): Promise<void> {
  for (const [filePath, fileContents] of fileWrites) {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, fileContents, "utf8");
  }
}

export async function applyNextOverlay(
  context: GenerationContext,
  projectDirectory: string
): Promise<void> {
  await writeOverlayFiles(getNextOverlayFiles(context, projectDirectory));

  await Promise.all([
    patchGlobalsCss(projectDirectory),
    patchButtonComponent(projectDirectory),
    removeLegacyRootFiles(projectDirectory)
  ]);
}
