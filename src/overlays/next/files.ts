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
  getLayoutTemplate,
  getNextConfigTemplate,
  getPageTemplate,
  getProxyTemplate,
} from "./routing.js";
import {
  getLanguageToggleTemplate,
  getReadmeTemplate,
  getSoundAssetTemplate,
  getStarterShellTemplate,
  getThemeToggleTemplate,
} from "./surface.js";

export function getNextOverlayFiles(
  context: GenerationContext,
  projectDirectory: string,
): Map<string, string> {
  const files = new Map<string, string>([
    [
      path.join(projectDirectory, "global.d.ts"),
      getCssImportDeclarationsTemplate(),
    ],
    [
      path.join(projectDirectory, "components", "app-providers.tsx"),
      getAppProvidersTemplate(context.config.base, context.config.rtl),
    ],
    [
      path.join(projectDirectory, "components", "theme-provider.tsx"),
      getThemeProviderTemplate(),
    ],
    [
      path.join(projectDirectory, "components", "theme-toggle.tsx"),
      getThemeToggleTemplate(),
    ],
    [
      path.join(projectDirectory, "components", "starter-shell.tsx"),
      getStarterShellTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "hooks", "use-locale.tsx"),
      getLocaleHookTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "hooks", "use-ui-sound.ts"),
      getUiSoundHookTemplate(),
    ],
    [
      path.join(projectDirectory, "lib", "i18n.ts"),
      getI18nTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "sounds", "click-soft.ts"),
      getSoundAssetTemplate("click-soft"),
    ],
    [
      path.join(projectDirectory, "sounds", "switch-on.ts"),
      getSoundAssetTemplate("switch-on"),
    ],
    [
      path.join(projectDirectory, "sounds", "switch-off.ts"),
      getSoundAssetTemplate("switch-off"),
    ],
    [path.join(projectDirectory, "next.config.mjs"), getNextConfigTemplate()],
    [
      path.join(projectDirectory, "README.md"),
      getReadmeTemplate(
        context.config.projectName,
        context.config.codeQualityLabel,
        context.config.rtl,
        context.config.packageManager,
        context.config.base,
      ),
    ],
  ]);

  if (context.config.rtl) {
    files.set(
      path.join(projectDirectory, "app", "[locale]", "layout.tsx"),
      getLayoutTemplate(true),
    );
    files.set(
      path.join(projectDirectory, "app", "[locale]", "page.tsx"),
      getPageTemplate(),
    );
    files.set(
      path.join(projectDirectory, "components", "language-toggle.tsx"),
      getLanguageToggleTemplate(),
    );
    files.set(path.join(projectDirectory, "proxy.ts"), getProxyTemplate());
    return files;
  }

  files.set(
    path.join(projectDirectory, "app", "layout.tsx"),
    getLayoutTemplate(false),
  );
  files.set(path.join(projectDirectory, "app", "page.tsx"), getPageTemplate());
  return files;
}
