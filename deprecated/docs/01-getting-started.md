# 01. Getting Started

This guide covers the initial setup and development workflow for the boilerplate.

## Prerequisites

- **Node.js**: Version 20 or higher
- **Package Manager**: pnpm (recommended) or npm

## Installation

1. **Clone & Install**

   ```bash
   git clone <your-repo-url>
   cd nexcn
   pnpm install
   ```

2. **Start Development**
   ```bash
   pnpm dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command           | Description                                       |
| :---------------- | :------------------------------------------------ |
| `pnpm dev`        | Starts the development server with hot reload     |
| `pnpm build`      | Compiles the application for production           |
| `pnpm start`      | Runs the built production application locally     |
| `pnpm lint:fix`   | Checks and fixes code style issues automatically  |
| `pnpm type-check` | Runs TypeScript validation without emitting files |
| `pnpm test`       | Runs unit tests using Vitest                      |
| `pnpm test:e2e`   | Runs end-to-end tests using Playwright            |

## Next Steps

Once the application is running, we recommend following these guides in order:

1. **[02-project-structure.md](./02-project-structure.md)**: Understand the codebase organization.
2. **[03-styling-guide.md](./03-styling-guide.md)**: Learn how to style components correctly.
3. **[04-adding-components.md](./04-adding-components.md)**: Learn how to build new UI features.
