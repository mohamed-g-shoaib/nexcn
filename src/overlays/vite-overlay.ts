import type { GenerationContext, OverlayPlan } from "../types.js";
import type { FrameworkOverlay } from "./types.js";

export class ViteFrameworkOverlay implements FrameworkOverlay {
  readonly framework = "vite";

  plan(_context: GenerationContext): OverlayPlan[] {
    return [
      {
        name: "vite-document-shell",
        description:
          "Wire index.html and root app entry for dynamic lang/dir and provider composition."
      },
      {
        name: "vite-starter-page",
        description: "Replace the default Vite starter with the minimal Forge starter surface."
      }
    ];
  }
}
