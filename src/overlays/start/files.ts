import path from "node:path";
import type { GenerationContext } from "../../types.js";
import { getCssImportDeclarationsTemplate } from "../shared/types.js";
import {
  getAppProvidersTemplate,
  getLocaleHookTemplate,
  getThemeProviderTemplate,
  getUiSoundHookTemplate,
} from "./providers.js";
import {
  getI18nTemplate,
  getIndexRouteTemplate,
  getLocaleIndexRouteTemplate,
  getLocaleLayoutRouteTemplate,
  getRootRouteTemplate,
  getViteConfigTemplate,
} from "./routing.js";
import {
  getLanguageToggleTemplate,
  getReadmeTemplate,
  getSoundAssetTemplate,
  getStarterShellTemplate,
  getThemeToggleTemplate,
} from "./surface.js";

export function getStartOverlayFiles(
  context: GenerationContext,
  projectDirectory: string,
): Map<string, string> {
  const files = new Map<string, string>([
    [
      path.join(projectDirectory, "src", "css.d.ts"),
      getCssImportDeclarationsTemplate(),
    ],
    [
      path.join(projectDirectory, "src", "routes", "__root.tsx"),
      getRootRouteTemplate(context.config.projectName, context.config.rtl),
    ],
    [
      path.join(projectDirectory, "src", "routes", "index.tsx"),
      getIndexRouteTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "src", "components", "app-providers.tsx"),
      getAppProvidersTemplate(context.config.base, context.config.rtl),
    ],
    [
      path.join(projectDirectory, "src", "components", "theme-provider.tsx"),
      getThemeProviderTemplate(),
    ],
    [
      path.join(projectDirectory, "src", "components", "theme-toggle.tsx"),
      getThemeToggleTemplate(),
    ],
    [
      path.join(projectDirectory, "src", "components", "starter-shell.tsx"),
      getStarterShellTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "src", "hooks", "use-locale.tsx"),
      getLocaleHookTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "src", "hooks", "use-ui-sound.ts"),
      getUiSoundHookTemplate(),
    ],
    [
      path.join(projectDirectory, "src", "lib", "i18n.ts"),
      getI18nTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "src", "sounds", "click-soft.ts"),
      getSoundAssetTemplate("click-soft"),
    ],
    [
      path.join(projectDirectory, "src", "sounds", "switch-on.ts"),
      getSoundAssetTemplate("switch-on"),
    ],
    [
      path.join(projectDirectory, "src", "sounds", "switch-off.ts"),
      getSoundAssetTemplate("switch-off"),
    ],
    [path.join(projectDirectory, "vite.config.ts"), getViteConfigTemplate()],
    [
      path.join(projectDirectory, "README.md"),
      getReadmeTemplate(
        context.config.projectName,
        context.config.codeQualityLabel,
        context.config.rtl,
        context.config.packageManager,
      ),
    ],
  ]);

  if (context.config.rtl) {
    files.set(
      path.join(projectDirectory, "src", "routes", "$locale", "route.tsx"),
      getLocaleLayoutRouteTemplate(),
    );
    files.set(
      path.join(projectDirectory, "src", "routes", "$locale", "index.tsx"),
      getLocaleIndexRouteTemplate(),
    );
    files.set(
      path.join(projectDirectory, "src", "components", "language-toggle.tsx"),
      getLanguageToggleTemplate(),
    );
    return files;
  }

  return files;
}
