import { rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FeaturePlan, ForgeConfig, GenerationContext } from "../types.js";
import type { FeaturePack } from "./types.js";
import {
  getInstallDevDependenciesCommand,
  getRemoveDependenciesCommand,
  readPackageJson,
  runCommand,
  writePackageJson
} from "../utils/index.js";

const DEFAULT_SCAFFOLD_TOOLING_DEPENDENCIES = [
  "@eslint/eslintrc",
  "@eslint/js",
  "@tanstack/eslint-config",
  "eslint",
  "eslint-config-next",
  "eslint-plugin-react-hooks",
  "eslint-plugin-react-refresh",
  "globals",
  "prettier",
  "prettier-plugin-tailwindcss",
  "typescript-eslint"
] as const;

function getBiomeConfigTemplate(): string {
  return `{
  "$schema": "https://biomejs.dev/schemas/latest/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": true,
    "includes": ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs", "**/*.json", "**/*.jsonc", "!src/routeTree.gen.ts"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "jsxQuoteStyle": "double",
      "trailingCommas": "all",
      "semicolons": "asNeeded"
    }
  }
}
`;
}

function getPrettierConfigTemplate(): string {
  return `{
  "plugins": ["prettier-plugin-tailwindcss"]
}
`;
}

function getOxlintConfigTemplate(config: ForgeConfig): string {
  const plugins = config.framework === "next" ? ["typescript", "react", "nextjs", "import", "jsx-a11y"] : ["typescript", "react", "import", "jsx-a11y"];

  return `{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ${JSON.stringify(plugins)},
  "categories": {
    "correctness": "error",
    "suspicious": "warn"
  },
  "ignorePatterns": ["node_modules", ".next", "build", "dist", "coverage"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "import/no-unassigned-import": "off"
  }
}
`;
}

function getOxfmtConfigTemplate(): string {
  return `{
  "$schema": "./node_modules/oxfmt/configuration_schema.json",
  "printWidth": 100,
  "semi": false,
  "trailingComma": "all",
  "singleQuote": false,
  "jsxSingleQuote": false,
  "sortImports": {
    "partitionByNewline": true,
    "newlinesBetween": false
  }
}
`;
}

function getEslintConfigTemplate(): string {
  return `import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"])
]);

export default eslintConfig;
`;
}

function getViteEslintConfigTemplate(): string {
  return `import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    }
  }
]);
`;
}

function getStartEslintConfigTemplate(): string {
  return `// @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [{ ignores: ["src/routeTree.gen.ts"] }, ...tanstackConfig];
`;
}

async function removeIfExists(filePath: string): Promise<void> {
  await rm(filePath, { force: true });
}

async function synchronizeToolingDependencies(
  context: GenerationContext,
  projectDirectory: string,
  packageJsonPath: string
): Promise<void> {
  const packageJson = await readPackageJson(packageJsonPath);
  const currentDeps = new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {})
  ]);

  const removableDependencies = DEFAULT_SCAFFOLD_TOOLING_DEPENDENCIES.filter((dependency) =>
    currentDeps.has(dependency)
  );

  if (context.config.codeQuality !== "eslint-prettier" && removableDependencies.length > 0) {
    await runCommand(
      getRemoveDependenciesCommand(context.config.packageManager, removableDependencies.slice()),
      projectDirectory
    );
  }

  const installDependencies =
    context.config.codeQuality === "biome"
      ? ["@biomejs/biome"]
      : context.config.codeQuality === "oxlint-oxfmt"
        ? ["oxlint", "oxfmt"]
        : [];

  if (installDependencies.length > 0) {
    await runCommand(
      getInstallDevDependenciesCommand(context.config.packageManager, installDependencies),
      projectDirectory
    );
  }
}

async function updatePackageScripts(
  context: GenerationContext,
  projectDirectory: string,
  packageJsonPath: string
): Promise<void> {
  const packageJson = await readPackageJson(packageJsonPath);

  packageJson.scripts = {
    ...packageJson.scripts,
    lint:
      context.config.codeQuality === "biome"
        ? "biome lint ."
        : context.config.codeQuality === "oxlint-oxfmt"
          ? "oxlint ."
          : "eslint .",
    "lint:fix":
      context.config.codeQuality === "biome"
        ? "biome lint --write ."
        : context.config.codeQuality === "oxlint-oxfmt"
          ? "oxlint . --fix"
          : "eslint . --fix",
    format:
      context.config.codeQuality === "biome"
        ? "biome format --write ."
        : context.config.codeQuality === "oxlint-oxfmt"
          ? "oxfmt"
          : "prettier --write .",
    "format:check":
      context.config.codeQuality === "biome"
        ? "biome format ."
        : context.config.codeQuality === "oxlint-oxfmt"
          ? "oxfmt --check"
          : "prettier --check ."
  };

  await writePackageJson(packageJsonPath, packageJson);
}

async function writeToolingFiles(context: GenerationContext, projectDirectory: string): Promise<void> {
  const eslintConfigPath = path.join(
    projectDirectory,
    context.config.framework === "next" ? "eslint.config.mjs" : "eslint.config.js"
  );
  const legacyEslintConfigPath = path.join(
    projectDirectory,
    context.config.framework === "next" ? "eslint.config.js" : "eslint.config.mjs"
  );
  const prettierConfigPath = path.join(projectDirectory, ".prettierrc");
  const prettierIgnorePath = path.join(projectDirectory, ".prettierignore");
  const biomeConfigPath = path.join(projectDirectory, "biome.json");
  const oxlintConfigPath = path.join(projectDirectory, ".oxlintrc.json");
  const oxfmtConfigPath = path.join(projectDirectory, ".oxfmtrc.json");

  await removeIfExists(legacyEslintConfigPath);
  await removeIfExists(biomeConfigPath);
  await removeIfExists(oxlintConfigPath);
  await removeIfExists(oxfmtConfigPath);

  if (context.config.codeQuality === "biome") {
    await removeIfExists(eslintConfigPath);
    await removeIfExists(prettierConfigPath);
    await removeIfExists(prettierIgnorePath);
    await writeFile(biomeConfigPath, getBiomeConfigTemplate(), "utf8");
    return;
  }

  if (context.config.codeQuality === "oxlint-oxfmt") {
    await removeIfExists(eslintConfigPath);
    await removeIfExists(prettierConfigPath);
    await removeIfExists(prettierIgnorePath);
    await writeFile(oxlintConfigPath, getOxlintConfigTemplate(context.config), "utf8");
    await writeFile(oxfmtConfigPath, getOxfmtConfigTemplate(), "utf8");
    return;
  }

  await writeFile(
    eslintConfigPath,
    context.config.framework === "next"
      ? getEslintConfigTemplate()
      : context.config.framework === "start"
        ? getStartEslintConfigTemplate()
        : getViteEslintConfigTemplate(),
    "utf8"
  );
  await writeFile(prettierConfigPath, getPrettierConfigTemplate(), "utf8");
}

export class CodeQualityFeaturePack implements FeaturePack {
  readonly name = "code-quality";

  applies(): boolean {
    return true;
  }

  plan(context: GenerationContext): FeaturePlan {
    return {
      name: this.name,
      description: `Configure ${context.config.codeQualityLabel} as the generated app lint/format stack.`
    };
  }

  async apply(context: GenerationContext, projectDirectory: string): Promise<void> {
    const packageJsonPath = path.join(projectDirectory, "package.json");

    await synchronizeToolingDependencies(context, projectDirectory, packageJsonPath);
    await updatePackageScripts(context, projectDirectory, packageJsonPath);
    await writeToolingFiles(context, projectDirectory);
  }
}
