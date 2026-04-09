import type { GenerationContext, ScaffoldCommand } from "../types.js";
import type { ScaffoldAdapter } from "./types.js";
import { getTemporaryPackageCommand } from "../utils/package-manager.js";
import { getScaffoldProjectName } from "../utils/paths.js";

export class ShadcnScaffoldAdapter implements ScaffoldAdapter {
  readonly name = "shadcn";

  supports(_context: GenerationContext): boolean {
    return true;
  }

  buildCommand(context: GenerationContext): ScaffoldCommand {
    const scaffoldProjectName = getScaffoldProjectName(
      context.config.projectName,
      context.cwd,
      context.targetDirectory
    );
    const args = [
      "init",
      "--yes",
      "--preset",
      context.config.presetCode,
      "--template",
      context.config.framework,
      "--name",
      scaffoldProjectName,
      "--cwd",
      context.targetDirectory
    ];

    if (context.config.base === "base") {
      args.push("--base", "base");
    }

    if (context.config.rtl) {
      args.push("--rtl");
    }

    return getTemporaryPackageCommand(context.config.packageManager, "shadcn@latest", args);
  }
}
