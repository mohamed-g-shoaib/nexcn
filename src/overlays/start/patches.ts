import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { readPackageJson, writePackageJson } from "../../utils/index.js";

export async function patchStylesCss(projectDirectory: string): Promise<void> {
  const cssPath = path.join(projectDirectory, "src", "styles.css");
  const currentCss = await readFile(cssPath, "utf8");

  const themedCss = currentCss
    .replace("--background: oklch(1 0 0);", "--background: oklch(0.994 0.001 106.424);")
    .replace("--background: oklch(0.145 0 0);", "--background: oklch(0.2 0 0);");

  if (currentCss.includes("::selection")) {
    await writeFile(cssPath, themedCss, "utf8");
    return;
  }

  const nextCss = `${themedCss}

@layer base {
  html {
    scrollbar-gutter: stable;
  }

  body {
    text-rendering: optimizeLegibility;
  }

  ::selection {
    background: color-mix(in oklch, var(--foreground) 18%, transparent);
    color: var(--foreground);
  }

  ::-webkit-scrollbar {
    width: 0.8rem;
    height: 0.8rem;
  }

  ::-webkit-scrollbar-thumb {
    background: color-mix(in oklch, var(--foreground) 14%, transparent);
    border: 3px solid transparent;
    border-radius: 999px;
    background-clip: padding-box;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }
}
`;

  await writeFile(cssPath, nextCss, "utf8");
}

export async function patchButtonComponent(projectDirectory: string): Promise<void> {
  const buttonPath = path.join(projectDirectory, "src", "components", "ui", "button.tsx");
  const currentButton = await readFile(buttonPath, "utf8");

  let nextButton = currentButton.replace(
    "transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px active:not-aria-[haspopup]:scale-[0.96]",
  );

  nextButton = nextButton.replace('import * as React from "react"', 'import type * as React from "react"');

  await writeFile(buttonPath, nextButton, "utf8");
}

export async function removeStartDemoArtifacts(projectDirectory: string): Promise<void> {
  await rm(path.join(projectDirectory, "src", "logo.svg"), { force: true });
}

export async function patchStartPackageJson(projectDirectory: string): Promise<void> {
  const packageJsonPath = path.join(projectDirectory, "package.json");
  const packageJson = await readPackageJson(packageJsonPath);

  delete packageJson.dependencies?.["@tanstack/react-devtools"];
  delete packageJson.dependencies?.["@tanstack/react-router-devtools"];
  delete packageJson.devDependencies?.["@tanstack/devtools-vite"];

  await writePackageJson(packageJsonPath, packageJson);
}
