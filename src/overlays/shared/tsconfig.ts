import { readFile, writeFile } from "node:fs/promises";

function parseTsconfigLikeJson(source: string): {
  compilerOptions?: Record<string, unknown>;
} {
  const withoutBlockComments = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutLineComments = withoutBlockComments.replace(/^\s*\/\/.*$/gm, "");
  const withoutTrailingCommas = withoutLineComments.replace(/,\s*([}\]])/g, "$1");

  return JSON.parse(withoutTrailingCommas) as {
    compilerOptions?: Record<string, unknown>;
  };
}

export async function removeDeprecatedBaseUrl(tsconfigPath: string): Promise<void> {
  let currentConfig: string;

  try {
    currentConfig = await readFile(tsconfigPath, "utf8");
  } catch {
    return;
  }

  const parsedConfig = parseTsconfigLikeJson(currentConfig);

  if (!parsedConfig.compilerOptions || !("baseUrl" in parsedConfig.compilerOptions)) {
    return;
  }

  delete parsedConfig.compilerOptions.baseUrl;

  await writeFile(tsconfigPath, `${JSON.stringify(parsedConfig, null, 2)}\n`, "utf8");
}
