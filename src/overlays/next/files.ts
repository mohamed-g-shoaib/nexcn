import path from "node:path";
import type { GenerationContext } from "../../types.js";
import { getCssImportDeclarationsTemplate } from "../shared/types.js";
import {
  getAppProvidersTemplate,
  getThemeProviderTemplate,
  getUiSoundHookTemplate,
} from "./providers.js";
import {
  getErrorTemplate,
  getGlobalErrorTemplate,
  getI18nTemplate,
  getLocaleErrorTemplate,
  getLocaleLayoutTemplate,
  getLocaleNotFoundTemplate,
  getMessagesTemplate,
  getNavigationTemplate,
  getNextConfigTemplate,
  getNotFoundTemplate,
  getPageTemplate,
  getProxyTemplate,
  getRequestTemplate,
  getRootLayoutTemplate,
  getRoutingTemplate,
} from "./routing.js";
import {
  getFallbackActionsTemplate,
  getErrorViewTemplate,
  getFallbackScreenTemplate,
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
      getThemeToggleTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "components", "starter-shell.tsx"),
      getStarterShellTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "components", "fallback-screen.tsx"),
      getFallbackScreenTemplate(),
    ],
    [
      path.join(projectDirectory, "components", "error-view.tsx"),
      getErrorViewTemplate(),
    ],
    [
      path.join(projectDirectory, "components", "fallback-actions.tsx"),
      getFallbackActionsTemplate(),
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
    [
      path.join(projectDirectory, "next.config.mjs"),
      getNextConfigTemplate(context.config.rtl),
    ],
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
    [
      path.join(projectDirectory, "app", "not-found.tsx"),
      getNotFoundTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "app", "error.tsx"),
      getErrorTemplate(context.config.rtl),
    ],
    [
      path.join(projectDirectory, "app", "global-error.tsx"),
      getGlobalErrorTemplate(),
    ],
  ]);

  if (context.config.rtl) {
    files.set(
      path.join(projectDirectory, "app", "layout.tsx"),
      getRootLayoutTemplate(true, context.config.projectName),
    );
    files.set(
      path.join(projectDirectory, "app", "[locale]", "layout.tsx"),
      getLocaleLayoutTemplate(),
    );
    files.set(
      path.join(projectDirectory, "app", "[locale]", "page.tsx"),
      getPageTemplate(true),
    );
    files.set(
      path.join(projectDirectory, "app", "[locale]", "not-found.tsx"),
      getLocaleNotFoundTemplate(),
    );
    files.set(
      path.join(projectDirectory, "app", "[locale]", "error.tsx"),
      getLocaleErrorTemplate(),
    );
    files.set(
      path.join(projectDirectory, "components", "language-toggle.tsx"),
      getLanguageToggleTemplate(),
    );
    files.set(path.join(projectDirectory, "proxy.ts"), getProxyTemplate());
    files.set(path.join(projectDirectory, "i18n", "routing.ts"), getRoutingTemplate());
    files.set(path.join(projectDirectory, "i18n", "request.ts"), getRequestTemplate());
    files.set(path.join(projectDirectory, "i18n", "navigation.ts"), getNavigationTemplate());
    files.set(path.join(projectDirectory, "messages", "en.json"), getMessagesTemplate("en"));
    files.set(path.join(projectDirectory, "messages", "ar.json"), getMessagesTemplate("ar"));
    return files;
  }

  files.set(
    path.join(projectDirectory, "app", "layout.tsx"),
    getRootLayoutTemplate(false, context.config.projectName),
  );
  files.set(path.join(projectDirectory, "app", "page.tsx"), getPageTemplate(false));
  return files;
}
