import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FeaturePlan, GenerationContext } from "../types.js";
import type { FeaturePack } from "./types.js";
import { pathExists, runCommand } from "../utils/index.js";

async function patchGeneratedUseSound(projectDirectory: string, framework: GenerationContext["config"]["framework"]): Promise<void> {
  const hookPath =
    framework === "next"
      ? path.join(projectDirectory, "hooks", "use-sound.ts")
      : path.join(projectDirectory, "src", "hooks", "use-sound.ts");

  if (!(await pathExists(hookPath))) {
    return;
  }

  const currentHook = await readFile(hookPath, "utf8");
  const nextHook = currentHook
    .replace(
      /import \{ getAudioContext, decodeAudioData \} from "@\/lib\/sound-engine";\s*import type \{\s*SoundAsset,\s*UseSoundOptions,\s*UseSoundReturn,\s*\} from "@\/lib\/sound-types";/s,
      `import type {
  SoundAsset,
  UseSoundOptions,
  UseSoundReturn,
} from "@/lib/sound-types";
import { decodeAudioData, getAudioContext } from "@/lib/sound-engine";`,
    )
    .replace(
      /sound\.duration \?\? null,/,
      'typeof sound.duration === "number" ? sound.duration : null,',
    );

  if (nextHook !== currentHook) {
    await writeFile(hookPath, nextHook, "utf8");
  }
}

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

    await patchGeneratedUseSound(projectDirectory, context.config.framework);
  }
}
