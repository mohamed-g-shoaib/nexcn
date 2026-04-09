import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GenerationContext } from "../types.js";
import { getInstallDependenciesCommand, runCommand } from "../utils/index.js";
import { removeDeprecatedBaseUrl } from "./shared/tsconfig.js";
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
  if (context.config.rtl) {
    await runCommand(
      getInstallDependenciesCommand(context.config.packageManager, ["react-router"]),
      projectDirectory,
    );
  }

  await writeOverlayFiles(getViteOverlayFiles(context, projectDirectory));

  if (!context.config.rtl) {
    await Promise.all([
      rm(path.join(projectDirectory, "src", "components", "language-toggle.tsx"), { force: true }),
      rm(path.join(projectDirectory, "src", "lib", "i18n.ts"), { force: true }),
    ]);
  }

  await Promise.all([
    patchIndexCss(projectDirectory),
    patchButtonComponent(projectDirectory),
    removeDeprecatedBaseUrl(path.join(projectDirectory, "tsconfig.json")),
    removeDeprecatedBaseUrl(path.join(projectDirectory, "tsconfig.app.json")),
    removeViteDemoArtifacts(projectDirectory),
  ]);
}
