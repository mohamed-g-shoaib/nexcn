import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GenerationContext } from "../types.js";
import { getStartOverlayFiles } from "./start/files.js";
import {
  patchButtonComponent,
  patchStartPackageJson,
  patchStylesCss,
  removeStartDemoArtifacts,
} from "./start/patches.js";

async function writeOverlayFiles(fileWrites: Map<string, string>): Promise<void> {
  for (const [filePath, fileContents] of fileWrites) {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, fileContents, "utf8");
  }
}

export async function applyStartOverlay(
  context: GenerationContext,
  projectDirectory: string,
): Promise<void> {
  await writeOverlayFiles(getStartOverlayFiles(context, projectDirectory));

  if (!context.config.rtl) {
    await Promise.all([
      rm(path.join(projectDirectory, "src", "routes", "$locale"), { recursive: true, force: true }),
      rm(path.join(projectDirectory, "src", "components", "language-toggle.tsx"), { force: true }),
    ]);
  }

  await Promise.all([
    patchStylesCss(projectDirectory),
    patchButtonComponent(projectDirectory),
    removeStartDemoArtifacts(projectDirectory),
    patchStartPackageJson(projectDirectory),
  ]);
}
