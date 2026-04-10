import { access, copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GenerationContext } from "../types.js";
import { applyNextOverlay } from "./next-apply.js";
import { applyStartOverlay } from "./start-apply.js";
import { applyViteOverlay } from "./vite-apply.js";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

async function findBrandFaviconPath(): Promise<string | undefined> {
  const moduleDirectory = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.join(packageRoot, "assets", "branding", "favicon.ico"),
    path.join(moduleDirectory, "..", "assets", "branding", "favicon.ico"),
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next package layout. Source runs from src/, published CLI runs from dist/.
    }
  }

  return undefined;
}

async function copyBrandFavicon(
  context: GenerationContext,
  projectDirectory: string,
): Promise<void> {
  const sourceFaviconPath = await findBrandFaviconPath();

  if (!sourceFaviconPath) {
    return;
  }

  const targetPath =
    context.config.framework === "next"
      ? path.join(projectDirectory, "app", "favicon.ico")
      : path.join(projectDirectory, "public", "favicon.ico");

  await mkdir(path.dirname(targetPath), { recursive: true });
  await copyFile(sourceFaviconPath, targetPath);
}

export async function applyFrameworkOverlay(
  context: GenerationContext,
  projectDirectory: string,
): Promise<void> {
  if (context.config.framework === "next") {
    await applyNextOverlay(context, projectDirectory);
    await copyBrandFavicon(context, projectDirectory);
    return;
  }

  if (context.config.framework === "vite") {
    await applyViteOverlay(context, projectDirectory);
    await copyBrandFavicon(context, projectDirectory);
    return;
  }

  if (context.config.framework === "start") {
    await applyStartOverlay(context, projectDirectory);
    await copyBrandFavicon(context, projectDirectory);
    return;
  }

  throw new Error(
    `No overlay application is implemented yet for "${context.config.framework}".`,
  );
}
