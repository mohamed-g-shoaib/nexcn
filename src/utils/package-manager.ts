import type { PackageManager, ScaffoldCommand } from "../types.js";

export function getInstallDevDependenciesCommand(
  packageManager: PackageManager,
  dependencies: string[]
): ScaffoldCommand {
  if (dependencies.length === 0) {
    throw new Error("Expected at least one dependency to install.");
  }

  switch (packageManager) {
    case "pnpm":
      return { command: "pnpm", args: ["add", "-D", ...dependencies] };
    case "npm":
      return { command: "npm", args: ["install", "-D", ...dependencies] };
    case "yarn":
      return { command: "yarn", args: ["add", "-D", ...dependencies] };
    case "bun":
      return { command: "bun", args: ["add", "-d", ...dependencies] };
  }
}

export function getRemoveDependenciesCommand(
  packageManager: PackageManager,
  dependencies: string[]
): ScaffoldCommand {
  if (dependencies.length === 0) {
    throw new Error("Expected at least one dependency to remove.");
  }

  switch (packageManager) {
    case "pnpm":
      return { command: "pnpm", args: ["remove", ...dependencies] };
    case "npm":
      return { command: "npm", args: ["uninstall", ...dependencies] };
    case "yarn":
      return { command: "yarn", args: ["remove", ...dependencies] };
    case "bun":
      return { command: "bun", args: ["remove", ...dependencies] };
  }
}
