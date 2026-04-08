import { test, expect } from "@playwright/test";

test("home page has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Create Next App/);
});
