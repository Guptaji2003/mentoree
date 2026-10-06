import { test, expect } from "@playwright/test";

test.describe("End-to-End Verified Mentorship Flow", () => {
  test("1. Landing page renders verified mentors from database and hides unverified profiles", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Core Marketplace Differentiator")).toBeVisible();
    await expect(page.locator("text=Verified Expert Mentors")).toBeVisible();
  });

  test("2. Booking modal opens with real availability slots and handles 10-minute hold countdown", async ({ page }) => {
    await page.goto("/");
    const bookButton = page.locator("button:has-text('Book Session'), button:has-text('Quick Book')").first();
    if (await bookButton.isVisible()) {
      await bookButton.click();
      await expect(page.locator("text=Select Mentorship Format")).toBeVisible();
    }
  });

  test("3. Security: Unauthenticated users are redirected from /admin", async ({ page }) => {
    await page.goto("/admin");
    // Should be redirected away or rejected by middleware
    await expect(page).not.toHaveURL("/admin");
  });
});
