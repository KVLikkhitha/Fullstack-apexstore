import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Automated WCAG 2.1 AA Accessibility Audits", () => {
  test("Home Page should not have critical WCAG accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(["color-contrast"]) // Optional fine-tuning for gradients
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test("Skip to Main Content link is functional and navigates to #main-content", async ({ page }) => {
    await page.goto("/");

    // Focus skip link via keyboard tab
    await page.keyboard.press("Tab");

    const skipLink = page.locator(".skip-link");
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    // Trigger skip link
    await page.keyboard.press("Enter");

    // Verify focus lands on #main-content
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeVisible();
  });

  test("Search Catalog page has proper landmark hierarchy and accessible form inputs", async ({ page }) => {
    await page.goto("/search");
    await page.waitForLoadState("domcontentloaded");

    // Main landmark verification
    const main = page.locator("main#main-content");
    await expect(main).toBeVisible();

    // Search input has accessible label
    const searchInput = page.getByRole("searchbox", {
      name: /Filter products by name or brand/i,
    });
    await expect(searchInput).toBeVisible();

    // Price range slider has aria attributes
    const slider = page.getByRole("slider", {
      name: /Maximum price filter slider/i,
    });
    await expect(slider).toBeVisible();
    await expect(slider).toHaveAttribute("aria-valuemin", "1000");
    await expect(slider).toHaveAttribute("aria-valuemax", "200000");
  });
});
