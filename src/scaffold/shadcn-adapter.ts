import type { GenerationContext, ScaffoldCommand } from "../types.js";
import type { ScaffoldAdapter } from "./types.js";

export class ShadcnScaffoldAdapter implements ScaffoldAdapter {
  readonly name = "shadcn";

  supports(_context: GenerationContext): boolean {
    return true;
  }

  buildCommand(context: GenerationContext): ScaffoldCommand {
    const args = [
      "dlx",
      "shadcn@latest",
      "init",
      "--yes",
      "--preset",
      context.config.presetCode,
      "--template",
      context.config.framework,
      "--name",
      context.config.projectName,
      "--cwd",
      context.targetDirectory
    ];

    if (context.config.base === "base") {
      args.push("--base", "base");
    }

    if (context.config.rtl) {
      args.push("--rtl");
    }

    return {
      command: context.config.packageManager,
      args
    };
  }
}
