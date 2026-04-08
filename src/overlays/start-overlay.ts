import type { GenerationContext, OverlayPlan } from "../types.js";
import type { FrameworkOverlay } from "./types.js";

export class TanStackStartFrameworkOverlay implements FrameworkOverlay {
  readonly framework = "start";

  plan(_context: GenerationContext): OverlayPlan[] {
    return [
      {
        name: "start-root-shell",
        description:
          "Wire the TanStack Start document/app shell for runtime lang/dir and provider composition."
      },
      {
        name: "start-starter-page",
        description:
          "Replace the starter route output with the minimal Forge starter surface."
      }
    ];
  }
}
