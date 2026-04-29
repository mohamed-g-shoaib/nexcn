import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GenerationContext } from "../types.js";
import { readPackageJson, writePackageJson } from "../utils/index.js";
import { removeDeprecatedBaseUrl } from "./shared/tsconfig.js";
import { getNextOverlayFiles } from "./next/files.js";
import { patchButtonComponent, patchGlobalsCss } from "./next/patches.js";

async function removeLegacyRootFiles(projectDirectory: string): Promise<void> {
  await Promise.all([
    rm(path.join(projectDirectory, "app", "page.tsx"), { force: true }),
    rm(path.join(projectDirectory, "hooks", "use-locale.tsx"), { force: true }),
  ]);
}

async function removeLegacyLocaleFiles(projectDirectory: string): Promise<void> {
  await Promise.all([
    rm(path.join(projectDirectory, "app", "[locale]"), {
      recursive: true,
      force: true,
    }),
    rm(path.join(projectDirectory, "proxy.ts"), { force: true }),
    rm(path.join(projectDirectory, "components", "language-toggle.tsx"), {
      force: true,
    }),
    rm(path.join(projectDirectory, "hooks", "use-locale.tsx"), { force: true }),
    rm(path.join(projectDirectory, "i18n"), { recursive: true, force: true }),
    rm(path.join(projectDirectory, "messages"), { recursive: true, force: true }),
  ]);
}

async function writeOverlayFiles(fileWrites: Map<string, string>): Promise<void> {
  for (const [filePath, fileContents] of fileWrites) {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, fileContents, "utf8");
  }
}

async function patchNextPackageJson(
  context: GenerationContext,
  projectDirectory: string,
): Promise<void> {
  const packageJsonPath = path.join(projectDirectory, "package.json");
  const packageJson = await readPackageJson(packageJsonPath);

  if (context.config.rtl) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      "next-intl": packageJson.dependencies?.["next-intl"] ?? "^4.0.0",
    };
  } else if (packageJson.dependencies?.["next-intl"]) {
    delete packageJson.dependencies["next-intl"];
  }

  await writePackageJson(packageJsonPath, packageJson);
}

export async function applyNextOverlay(
  context: GenerationContext,
  projectDirectory: string,
): Promise<void> {
  await writeOverlayFiles(getNextOverlayFiles(context, projectDirectory));

  await Promise.all([
    patchGlobalsCss(projectDirectory),
    patchButtonComponent(projectDirectory),
    patchNextPackageJson(context, projectDirectory),
    removeDeprecatedBaseUrl(path.join(projectDirectory, "tsconfig.json")),
    context.config.rtl
      ? removeLegacyRootFiles(projectDirectory)
      : removeLegacyLocaleFiles(projectDirectory),
  ]);
}
