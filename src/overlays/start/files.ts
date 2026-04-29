import path from "node:path";
import type { GenerationContext } from "../../types.js";
import { getCssImportDeclarationsTemplate } from "../shared/types.js";
import {
  getAppProvidersTemplate,
  getThemeProviderTemplate,
  getUiSoundHookTemplate,
} from "./providers.js";
import {
  getI18nConfigTemplate,
  getI18nTemplate,
  getI18nTypesTemplate,
  getIndexRouteTemplate,
  getLocaleIndexRouteTemplate,
  getLocaleLayoutRouteTemplate,
  getResourceStoreTemplate,
  getRootRouteTemplate,
  getRouteLocaleHookTemplate,
  getViteConfigTemplate,
} from "./routing.js";
import {
  getFallbackActionsTemplate,
  getFallbackScreenTemplate,
  getLanguageToggleTemplate,
  getReadmeTemplate,
  getRouteErrorTemplate,
  getSoundAssetTemplate,
  getStarterShellTemplate,
  getThemeToggleTemplate,
  getWebManifestTemplate,
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
      getThemeToggleTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "src", "components", "starter-shell.tsx"),
      getStarterShellTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "src", "components", "fallback-screen.tsx"),
      getFallbackScreenTemplate(),
    ],
    [
      path.join(projectDirectory, "src", "components", "fallback-actions.tsx"),
      getFallbackActionsTemplate(),
    ],
    [
      path.join(projectDirectory, "src", "components", "route-error.tsx"),
      getRouteErrorTemplate(context.config.rtl),
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
    [
      path.join(projectDirectory, "public", "site.webmanifest"),
      getWebManifestTemplate(context.config.projectName),
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
      path.join(projectDirectory, "src", "i18n", "config.ts"),
      getI18nConfigTemplate(),
    );
    files.set(
      path.join(projectDirectory, "src", "i18n", "resources.ts"),
      getResourceStoreTemplate(),
    );
    files.set(
      path.join(projectDirectory, "src", "i18n", "types.ts"),
      getI18nTypesTemplate(),
    );
    files.set(
      path.join(projectDirectory, "src", "hooks", "use-route-locale.ts"),
      getRouteLocaleHookTemplate(),
    );
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
  }

  return files;
}
