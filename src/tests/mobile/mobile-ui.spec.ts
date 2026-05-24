import { test, expect, devices } from '@playwright/test';
import { BaseMobilePage } from '@mobile/BaseMobilePage';

// Override config for mobile device
test.use({ ...devices['iPhone 12'] });

test.describe('Mobile Testing - User Interface', () => {
  let mobilePage: BaseMobilePage;

  test.beforeEach(async ({ page }) => {
    mobilePage = new BaseMobilePage(page);
    await mobilePage.goto('https://example.com');
  });

  test('should display content on mobile viewport', async () => {
    const viewport = mobilePage.getViewportSize();
    expect(viewport).not.toBeNull();
    expect(viewport?.width).toBeLessThan(800);
  });

  test('should scroll down on mobile', async () => {
    await mobilePage.scrollDown(300);
    // Verify element visibility after scroll
  });

  test('should swipe left on mobile carousel', async () => {
    await mobilePage.swipeLeft(300);
    // Verify carousel moved
  });

  test('should tap button on mobile', async () => {
    const buttonLocator = 'button:has-text("Submit")';
    await mobilePage.tap(buttonLocator);
    // Verify action
  });

  test('should long press on mobile', async () => {
    const elementLocator = '.long-press-item';
    await mobilePage.longPress(elementLocator, 2000);
    // Verify context menu or action
  });
});
