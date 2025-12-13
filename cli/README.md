# Nexcn CLI

Interactive command-line tool for creating new Nexcn projects.

## Usage

```bash
npx create-nexcn my-app
```

## Features

- 🎨 Beautiful ASCII art logo
- ✓ Automatic prerequisite checking (Node.js, Git, pnpm)
- ✓ Interactive project name prompt
- ✓ Automatic dependency installation
- ✓ Git repository initialization
- ✓ Colorful terminal output with progress steps
- ✓ Error handling and validation

## What It Does

The CLI automates the entire setup process:

1. **Project Setup** - Prompts for project name
2. **Prerequisites Check** - Verifies Node.js, Git, and pnpm
3. **Download** - Clones the latest Nexcn template
4. **Install Dependencies** - Runs `pnpm install`
5. **Initialize Git** - Creates a fresh git repository

## Requirements

- Node.js 20.x or higher
- Git (automatically checked)
- pnpm (automatically installed if missing)

## Implementation

The CLI is implemented in `index.js` using:

- Node.js built-in modules (`child_process`, `fs`, `path`, `readline`)
- CommonJS for maximum compatibility
- ANSI color codes for terminal styling
- Synchronous command execution with `execSync`

## Publishing

The CLI is automatically published with the npm package via the `bin` field in `package.json`:

```json
{
  "bin": {
    "create-nexcn": "./cli/index.js"
  }
}
```

This allows users to run:

- `npx create-nexcn my-app`
- `npm init nexcn my-app`
