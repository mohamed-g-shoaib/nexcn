const NPM_REGISTRY_BASE_URL = "https://registry.npmjs.org";

const latestVersionCache = new Map<string, string>();

type RegistryPackageMetadata = {
  "dist-tags"?: {
    latest?: string;
  };
};

function getRegistryPackageUrl(packageName: string): string {
  return `${NPM_REGISTRY_BASE_URL}/${encodeURIComponent(packageName)}`;
}

export async function fetchLatestPackageVersion(packageName: string): Promise<string> {
  const cachedVersion = latestVersionCache.get(packageName);

  if (cachedVersion) {
    return cachedVersion;
  }

  const response = await fetch(getRegistryPackageUrl(packageName), {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch package metadata for "${packageName}" from npm registry: ${response.status}`
    );
  }

  const metadata = (await response.json()) as RegistryPackageMetadata;
  const latestVersion = metadata["dist-tags"]?.latest;

  if (!latestVersion) {
    throw new Error(`Package "${packageName}" does not expose a latest dist-tag.`);
  }

  latestVersionCache.set(packageName, latestVersion);

  return latestVersion;
}
