import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { GenerationContext } from "../types.js";
import {
  getInstallDependenciesCommand,
  getRemoveDependenciesCommand,
  readPackageJson,
  runCommand,
} from "../utils/index.js";
import { removeDeprecatedBaseUrl } from "./shared/tsconfig.js";
import { getViteOverlayFiles } from "./vite/files.js";
import {
  patchButtonComponent,
  patchIndexCss,
  removeViteDemoArtifacts,
} from "./vite/patches.js";

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
  const baseDependencies = ["react-router"];
  const rtlDependencies = ["i18next", "react-i18next", "i18next-http-backend"];

  await runCommand(
    getInstallDependenciesCommand(
      context.config.packageManager,
      context.config.rtl
        ? [...baseDependencies, ...rtlDependencies]
        : baseDependencies,
    ),
    projectDirectory,
  );

  await writeOverlayFiles(getViteOverlayFiles(context, projectDirectory));

  if (!context.config.rtl) {
    await Promise.all([
      rm(path.join(projectDirectory, "src", "components", "language-toggle.tsx"), {
        force: true,
      }),
      rm(path.join(projectDirectory, "src", "i18n"), {
        recursive: true,
        force: true,
      }),
      rm(path.join(projectDirectory, "src", "hooks", "use-route-locale.ts"), {
        force: true,
      }),
      rm(path.join(projectDirectory, "src", "hooks", "use-locale.tsx"), {
        force: true,
      }),
      rm(path.join(projectDirectory, "src", "routes", "locale-starter-page.tsx"), {
        force: true,
      }),
      rm(path.join(projectDirectory, "public", "locales"), {
        recursive: true,
        force: true,
      }),
    ]);

    const packageJson = await readPackageJson(path.join(projectDirectory, "package.json"));
    const installedDependencyNames = new Set([
      ...Object.keys(packageJson.dependencies ?? {}),
      ...Object.keys(packageJson.devDependencies ?? {}),
    ]);
    const removableDependencies = rtlDependencies.filter((dependency) =>
      installedDependencyNames.has(dependency),
    );

    if (removableDependencies.length > 0) {
      await runCommand(
        getRemoveDependenciesCommand(context.config.packageManager, removableDependencies),
        projectDirectory,
      );
    }
  } else {
    await rm(path.join(projectDirectory, "src", "hooks", "use-locale.tsx"), {
      force: true,
    });
  }

  await Promise.all([
    patchIndexCss(projectDirectory),
    patchButtonComponent(projectDirectory),
    removeDeprecatedBaseUrl(path.join(projectDirectory, "tsconfig.json")),
    removeDeprecatedBaseUrl(path.join(projectDirectory, "tsconfig.app.json")),
    removeViteDemoArtifacts(projectDirectory),
  ]);
}
