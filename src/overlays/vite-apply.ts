import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GenerationContext } from "../types.js";
import { getViteOverlayFiles } from "./vite/files.js";
import { patchButtonComponent, patchIndexCss, removeViteDemoArtifacts } from "./vite/patches.js";

async function writeOverlayFiles(fileWrites: Map<string, string>): Promise<void> {
  for (const [filePath, fileContents] of fileWrites) {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, fileContents, "utf8");
  }
}

export async function applyViteOverlay(
  context: GenerationContext,
  projectDirectory: string,
): Promise<void> {
  await writeOverlayFiles(getViteOverlayFiles(context, projectDirectory));

  await Promise.all([
    patchIndexCss(projectDirectory),
    patchButtonComponent(projectDirectory),
    removeViteDemoArtifacts(projectDirectory),
  ]);
}
