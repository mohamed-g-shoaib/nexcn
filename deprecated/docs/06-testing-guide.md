# 06. Testing Guide

This project comes with a dual testing strategy to ensure reliability.

## Test Types

1. **Unit Tests (Vitest)**: Test individual components or functions in isolation. Fast and granular.
2. **E2E Tests (Playwright)**: Test the full application flows (e.g., "User can log in"). Slower but realistic.

## Running Tests

```bash
# Run unit tests
pnpm test

# Run component tests with a UI to visualize them
pnpm test:ui

# Run end-to-end tests
pnpm test:e2e
```

## How to Write a Component Test (Unit)

Create a file named `MyComponent.test.tsx` right next to your component.

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Counter } from "./Counter";

describe("Counter Component", () => {
  it("increments number when clicked", () => {
    // 1. Render the component
    render(<Counter />);

    // 2. Interact with it
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // 3. Assert the result
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
```

## How to Write an E2E Test

Create a file in the `tests/` directory, e.g., `tests/navigation.spec.ts`.

```tsx
import { test, expect } from "@playwright/test";

test("user can navigate to about page", async ({ page }) => {
  // 1. Go to homepage
  await page.goto("/en");

  // 2. Click the link
  await page.getByRole("link", { name: "About" }).click();

  // 3. Verify URL changed
  await expect(page).toHaveURL("/en/about");

  // 4. Verify content visible
  await expect(page.getByRole("heading", { name: "About Us" })).toBeVisible();
});
```
