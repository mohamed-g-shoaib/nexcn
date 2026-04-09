import type { PackageManager, ScaffoldCommand } from "../types.js";

export function getRunScriptCommand(
  packageManager: PackageManager,
  scriptName: string,
  scriptArgs: string[] = []
): ScaffoldCommand {
  switch (packageManager) {
    case "pnpm":
      return { command: "pnpm", args: ["run", scriptName, ...scriptArgs] };
    case "npm":
      return {
        command: "npm",
        args: ["run", scriptName, ...(scriptArgs.length > 0 ? ["--", ...scriptArgs] : [])]
      };
    case "yarn":
      return { command: "corepack", args: ["yarn@stable", "run", scriptName, ...scriptArgs] };
    case "bun":
      return { command: "bun", args: ["run", scriptName, ...scriptArgs] };
  }
}

export function getTemporaryPackageCommand(
  packageManager: PackageManager,
  packageSpecifier: string,
  args: string[]
): ScaffoldCommand {
  switch (packageManager) {
    case "pnpm":
      return { command: "pnpm", args: ["dlx", packageSpecifier, ...args] };
    case "npm":
      return { command: "npx", args: ["--yes", packageSpecifier, ...args] };
    case "yarn":
      return { command: "npx", args: ["--yes", packageSpecifier, ...args] };
    case "bun":
      return { command: "bunx", args: ["--bun", packageSpecifier, ...args] };
  }
}

export function getInstallDependenciesCommand(
  packageManager: PackageManager,
  dependencies: string[]
): ScaffoldCommand {
  if (dependencies.length === 0) {
    throw new Error("Expected at least one dependency to install.");
  }

  switch (packageManager) {
    case "pnpm":
      return { command: "pnpm", args: ["add", ...dependencies] };
    case "npm":
      return { command: "npm", args: ["install", ...dependencies] };
    case "yarn":
      return { command: "corepack", args: ["yarn@stable", "add", ...dependencies] };
    case "bun":
      return { command: "bun", args: ["add", ...dependencies] };
  }
}

export function getInstallProjectCommand(packageManager: PackageManager): ScaffoldCommand {
  switch (packageManager) {
    case "pnpm":
      return { command: "pnpm", args: ["install"] };
    case "npm":
      return { command: "npm", args: ["install"] };
    case "yarn":
      return { command: "corepack", args: ["yarn@stable", "install"] };
    case "bun":
      return { command: "bun", args: ["install"] };
  }
}

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
      return { command: "corepack", args: ["yarn@stable", "add", "-D", ...dependencies] };
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
      return { command: "corepack", args: ["yarn@stable", "remove", ...dependencies] };
    case "bun":
      return { command: "bun", args: ["remove", ...dependencies] };
  }
}
