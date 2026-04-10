import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function patchGlobalsCss(projectDirectory: string): Promise<void> {
  const globalsCssPath = path.join(projectDirectory, "app", "globals.css");
  const currentCss = await readFile(globalsCssPath, "utf8");

  let themedCss = currentCss
    .replace("--background: oklch(1 0 0);", "--background: oklch(0.994 0.001 106.424);")
    .replace("--background: oklch(0.145 0 0);", "--background: oklch(0.2 0 0);");

  if (!themedCss.includes("button:not(:disabled)")) {
    themedCss = themedCss.replace(
      "  body {\n    text-rendering: optimizeLegibility;\n  }\n",
      `  body {\n    text-rendering: optimizeLegibility;\n  }\n\n  button:not(:disabled),\n  [role="button"]:not(:disabled),\n  a[href],\n  summary,\n  label[for] {\n    cursor: pointer;\n  }\n`,
    );
  }

  if (currentCss.includes("::selection")) {
    await writeFile(globalsCssPath, themedCss, "utf8");
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

  button:not(:disabled),
  [role="button"]:not(:disabled),
  a[href],
  summary,
  label[for] {
    cursor: pointer;
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

  await writeFile(globalsCssPath, nextCss, "utf8");
}

export async function patchButtonComponent(projectDirectory: string): Promise<void> {
  const buttonPath = path.join(projectDirectory, "components", "ui", "button.tsx");
  const currentButton = await readFile(buttonPath, "utf8");

  let nextButton = currentButton.replace(
    "transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:not-aria-[haspopup]:translate-y-px active:not-aria-[haspopup]:scale-[0.96]"
  );

  nextButton = nextButton.replace('import * as React from "react"', 'import type * as React from "react"');

  await writeFile(buttonPath, nextButton, "utf8");
}
