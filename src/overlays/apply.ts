import type { GenerationContext } from "../types.js";
import { applyNextOverlay } from "./next-apply.js";

export async function applyFrameworkOverlay(
  context: GenerationContext,
  projectDirectory: string
): Promise<void> {
  if (context.config.framework === "next") {
    await applyNextOverlay(context, projectDirectory);
    return;
  }

  throw new Error(`No overlay application is implemented yet for "${context.config.framework}".`);
}
