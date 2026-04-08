import path from "node:path";
import type { GenerationContext } from "../../types.js";
import {
  getAppProvidersTemplate,
  getLocaleHookTemplate,
  getThemeProviderTemplate,
  getUiSoundHookTemplate
} from "./providers.js";
import {
  getI18nTemplate,
  getLayoutTemplate,
  getNextConfigTemplate,
  getPageTemplate,
  getProxyTemplate
} from "./routing.js";
import {
  getLanguageToggleTemplate,
  getReadmeTemplate,
  getSoundAssetTemplate,
  getStarterShellTemplate,
  getThemeToggleTemplate
} from "./surface.js";

export function getNextOverlayFiles(
  context: GenerationContext,
  projectDirectory: string
): Map<string, string> {
  return new Map<string, string>([
    [path.join(projectDirectory, "app", "[locale]", "layout.tsx"), getLayoutTemplate()],
    [path.join(projectDirectory, "app", "[locale]", "page.tsx"), getPageTemplate()],
    [path.join(projectDirectory, "components", "app-providers.tsx"), getAppProvidersTemplate(context.config.base)],
    [path.join(projectDirectory, "components", "theme-provider.tsx"), getThemeProviderTemplate()],
    [path.join(projectDirectory, "components", "theme-toggle.tsx"), getThemeToggleTemplate()],
    [path.join(projectDirectory, "components", "language-toggle.tsx"), getLanguageToggleTemplate()],
    [path.join(projectDirectory, "components", "starter-shell.tsx"), getStarterShellTemplate()],
    [path.join(projectDirectory, "hooks", "use-locale.tsx"), getLocaleHookTemplate()],
    [path.join(projectDirectory, "hooks", "use-ui-sound.ts"), getUiSoundHookTemplate()],
    [path.join(projectDirectory, "lib", "i18n.ts"), getI18nTemplate()],
    [path.join(projectDirectory, "proxy.ts"), getProxyTemplate()],
    [path.join(projectDirectory, "sounds", "click-soft.ts"), getSoundAssetTemplate("click-soft")],
    [path.join(projectDirectory, "sounds", "switch-on.ts"), getSoundAssetTemplate("switch-on")],
    [path.join(projectDirectory, "sounds", "switch-off.ts"), getSoundAssetTemplate("switch-off")],
    [path.join(projectDirectory, "next.config.mjs"), getNextConfigTemplate()],
    [
      path.join(projectDirectory, "README.md"),
      getReadmeTemplate(context.config.projectName, context.config.codeQualityLabel)
    ]
  ]);
}
