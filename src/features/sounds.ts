import type { FeaturePlan, GenerationContext } from "../types.js";
import type { FeaturePack } from "./types.js";
import { runCommand } from "../utils/index.js";

export class SoundsFeaturePack implements FeaturePack {
  readonly name = "sounds";

  applies(): boolean {
    return true;
  }

  plan(_context: GenerationContext): FeaturePlan {
    return {
      name: this.name,
      description:
        "Add centralized soundcn wiring with click-soft, switch-on, and switch-off assets."
    };
  }

  async apply(context: GenerationContext, projectDirectory: string): Promise<void> {
    await runCommand(
      {
        command: context.config.packageManager,
        args: [
          "dlx",
          "shadcn@latest",
          "add",
          "@soundcn/use-sound",
          "@soundcn/click-soft",
          "@soundcn/switch-off",
          "@soundcn/switch-on"
        ]
      },
      projectDirectory
    );
  }
}
