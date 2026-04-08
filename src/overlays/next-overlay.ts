import type { GenerationContext, OverlayPlan } from "../types.js";
import type { FrameworkOverlay } from "./types.js";

export class NextFrameworkOverlay implements FrameworkOverlay {
  readonly framework = "next";

  plan(context: GenerationContext): OverlayPlan[] {
    return [
      {
        name: "next-root-shell",
        description:
          "Wire layout.tsx for dynamic html lang/dir, theme provider, tooltip provider, and direction handling."
      },
      {
        name: "next-starter-page",
        description:
          "Replace the scaffold landing page with the minimal Forge starter surface."
      },
      {
        name: "next-readme",
        description: `Generate a framework-specific README for ${context.config.frameworkLabel}.`
      }
    ];
  }
}
