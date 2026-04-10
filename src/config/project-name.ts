const WINDOWS_RESERVED_NAMES = new Set([
  "con",
  "prn",
  "aux",
  "nul",
  "com1",
  "com2",
  "com3",
  "com4",
  "com5",
  "com6",
  "com7",
  "com8",
  "com9",
  "lpt1",
  "lpt2",
  "lpt3",
  "lpt4",
  "lpt5",
  "lpt6",
  "lpt7",
  "lpt8",
  "lpt9",
]);

const PROJECT_NAME_PATTERN = /^(?!.*--)[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_PROJECT_NAME_LENGTH = 64;

export type ProjectNameValidationResult = {
  valid: boolean;
  normalized: string;
  error?: string;
};

type ProjectNameValidationOptions = {
  allowCurrentDirectory?: boolean;
};

export function validateProjectName(
  value: string,
  options: ProjectNameValidationOptions = {},
): ProjectNameValidationResult {
  const normalized = value.trim();
  const hasLeadingOrTrailingWhitespace = value !== normalized;

  if (options.allowCurrentDirectory && normalized === ".") {
    return { valid: true, normalized };
  }

  if (normalized.length === 0) {
    return {
      valid: false,
      normalized,
      error: "Project name is required.",
    };
  }

  if (normalized.length > MAX_PROJECT_NAME_LENGTH) {
    return {
      valid: false,
      normalized,
      error: `Project name must be ${MAX_PROJECT_NAME_LENGTH} characters or fewer.`,
    };
  }

  if (normalized.startsWith(".")) {
    return {
      valid: false,
      normalized,
      error: "Project name cannot start with a period.",
    };
  }

  if (hasLeadingOrTrailingWhitespace) {
    return {
      valid: false,
      normalized,
      error: "Project name cannot start or end with whitespace.",
    };
  }

  if (normalized.endsWith(".")) {
    return {
      valid: false,
      normalized,
      error: "Project name cannot end with a period.",
    };
  }

  if (WINDOWS_RESERVED_NAMES.has(normalized.toLowerCase())) {
    return {
      valid: false,
      normalized,
      error: "Project name is reserved by Windows.",
    };
  }

  if (!PROJECT_NAME_PATTERN.test(normalized)) {
    return {
      valid: false,
      normalized,
      error: 'Use lowercase letters, numbers, and single hyphens only.',
    };
  }

  return { valid: true, normalized };
}
