import path from "node:path";
import { cliDefaultInput } from "../config/defaults.js";
import type {
  BaseLibrary,
  CodeQualityTooling,
  ForgeConfigInput,
  Framework,
  PackageManager
} from "../types.js";

export type CliCommand = "generate" | "plan";

export type ParsedCliArgs = {
  command: CliCommand;
  input: Partial<ForgeConfigInput>;
  dryRun: boolean;
  outputRoot?: string;
  helpRequested: boolean;
  detectedPackageManager?: PackageManager;
};

export function detectDefaultPackageManager(
  userAgent = process.env.npm_config_user_agent ?? ""
): PackageManager | undefined {
  if (userAgent.startsWith("pnpm/")) {
    return "pnpm";
  }

  if (userAgent.startsWith("npm/")) {
    return "npm";
  }

  if (userAgent.startsWith("yarn/")) {
    return "yarn";
  }

  if (userAgent.startsWith("bun/")) {
    return "bun";
  }

  return undefined;
}

export function getCliDefaults(userAgent?: string): ForgeConfigInput {
  return {
    ...cliDefaultInput,
    packageManager: detectDefaultPackageManager(userAgent) ?? "pnpm"
  };
}

function isCliCommand(value: string | undefined): value is CliCommand {
  return value === "generate" || value === "plan";
}

function isSupportedFramework(value: string): value is Framework {
  return value === "next" || value === "vite" || value === "start";
}

function isSupportedBase(value: string): value is BaseLibrary {
  return value === "base" || value === "radix";
}

function isSupportedPackageManager(value: string): value is PackageManager {
  return value === "pnpm" || value === "npm" || value === "yarn" || value === "bun";
}

function isSupportedCodeQuality(value: string): value is CodeQualityTooling {
  return value === "biome" || value === "eslint-prettier" || value === "oxlint-oxfmt";
}

export function parseCliArgs(
  args: string[],
  cwd: string,
  userAgent = process.env.npm_config_user_agent ?? ""
): ParsedCliArgs {
  const input: Partial<ForgeConfigInput> = {};
  const detectedPackageManager = detectDefaultPackageManager(userAgent);
  let outputRoot: string | undefined;
  let command: CliCommand = "generate";
  let argumentIndex = 0;
  let dryRun = false;
  let helpRequested = false;

  if (isCliCommand(args[0])) {
    command = args[0];
    argumentIndex = 1;
  } else if (args[0] === "--help" || args[0] === "-h") {
    helpRequested = true;
  }

  for (let index = argumentIndex; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--") {
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      helpRequested = true;
      continue;
    }

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (arg === "--name") {
      const nextValue = args[index + 1];
      if (!nextValue) {
        throw new Error(`Missing value for "${arg}".`);
      }

      input.projectName = nextValue;
      index += 1;
      continue;
    }

    if (arg === "--code-quality") {
      const nextValue = args[index + 1];
      if (!nextValue) {
        throw new Error(`Missing value for "${arg}".`);
      }

      if (!isSupportedCodeQuality(nextValue)) {
        throw new Error(`Unsupported code quality option "${nextValue}".`);
      }

      input.codeQuality = nextValue;
      index += 1;
      continue;
    }

    if (arg === "--package-manager") {
      const nextValue = args[index + 1];
      if (!nextValue) {
        throw new Error(`Missing value for "${arg}".`);
      }

      if (!isSupportedPackageManager(nextValue)) {
        throw new Error(`Unsupported package manager "${nextValue}".`);
      }

      input.packageManager = nextValue;
      index += 1;
      continue;
    }

    if (arg === "--framework") {
      const nextValue = args[index + 1];
      if (!nextValue) {
        throw new Error(`Missing value for "${arg}".`);
      }

      if (!isSupportedFramework(nextValue)) {
        throw new Error(`Unsupported framework "${nextValue}".`);
      }

      input.framework = nextValue;
      index += 1;
      continue;
    }

    if (arg === "--base") {
      const nextValue = args[index + 1];
      if (!nextValue) {
        throw new Error(`Missing value for "${arg}".`);
      }

      if (!isSupportedBase(nextValue)) {
        throw new Error(`Unsupported base "${nextValue}".`);
      }

      input.base = nextValue;
      index += 1;
      continue;
    }

    if (arg === "--rtl") {
      input.rtl = true;
      continue;
    }

    if (arg === "--ltr") {
      input.rtl = false;
      continue;
    }

    if (arg === "--fixture") {
      outputRoot = path.join(cwd, "fixtures");
      continue;
    }

    throw new Error(`Unknown argument "${arg}". Try "forge --help".`);
  }

  return { command, input, dryRun, outputRoot, helpRequested, detectedPackageManager };
}
