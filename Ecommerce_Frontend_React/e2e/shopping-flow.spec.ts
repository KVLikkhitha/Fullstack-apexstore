import { test, expect } from "@playwright/test";

test.describe("Full E-Commerce User Shopping Flow", () => {
  test("User can browse products, add to cart, inspect drawer, and proceed to checkout", async ({
    page,
  }) => {
    // 1. Visit Storefront Home
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Check brand logo and skip link
    await expect(page.locator(".brand-logo")).toContainText("ApexStore");

    // 2. Perform sitewide product search
    const desktopSearchInput = page.locator("#navbar-search-input");
    await desktopSearchInput.fill("Apple");
    await desktopSearchInput.press("Enter");

    // Should navigate to /search?q=Apple
    await expect(page).toHaveURL(/.*search\?q=Apple/);

    // 3. Locate product card
    const firstProduct = page.locator(".product-card").first();
    await expect(firstProduct).toBeVisible();

    // 4. Quick Add to Cart
    const quickAddBtn = firstProduct.locator(".quick-add-btn");
    await quickAddBtn.click();

    // 5. Open Cart Drawer via Navigation Bag icon
    const cartBtn = page.getByRole("button", { name: /Shopping Cart/i });
    await cartBtn.click();

    const drawer = page.getByRole("dialog", { name: /Shopping Bag/i });
    await expect(drawer).toBeVisible();

    // 6. Navigate to Checkout from drawer
    const checkoutLink = drawer.getByRole("button", { name: /Proceed to Checkout/i });
    await checkoutLink.click();

    await expect(page).toHaveURL(/.*checkout/);

    // 7. Verify checkout form fields exist
    await expect(page.locator("#shipping-fullName")).toBeVisible();
    await expect(page.locator("#shipping-address")).toBeVisible();
    await expect(page.locator("#shipping-city")).toBeVisible();
  });

  test("Cart drawer can be closed with the Escape key (Accessible Dialog Pattern)", async ({
    page,
  }) => {
    await page.goto("/");

    // Open Cart Drawer
    const cartBtn = page.getByRole("button", { name: /Shopping Cart/i });
    await cartBtn.click();

    const drawer = page.getByRole("dialog", { name: /Shopping Bag/i });
    await expect(drawer).toBeVisible();

    // Press Escape
    await page.keyboard.press("Escape");

    // Drawer should close
    await expect(drawer).not.toBeVisible();
  });
});
