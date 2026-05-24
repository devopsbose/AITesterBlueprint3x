import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { Logger } from '@utils/logger';

/**
 * Base Mobile Page Object Model class
 * Extends BasePage with mobile-specific interactions
 */
export class BaseMobilePage extends BasePage {
  protected logger: Logger;

  constructor(page: Page) {
    super(page);
    this.logger = new Logger('BaseMobilePage');
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator: string | Locator): Promise<void> {
    const element = this.getElement(locator);
    await element.scrollIntoViewIfNeeded();
    this.logger.info(`Scrolled to element: ${locator}`);
  }

  /**
   * Scroll down
   */
  async scrollDown(distance: number = 300): Promise<void> {
    await this.page.evaluate(`window.scrollBy(0, ${distance})`);
    this.logger.info(`Scrolled down by ${distance}px`);
  }

  /**
   * Scroll up
   */
  async scrollUp(distance: number = 300): Promise<void> {
    await this.page.evaluate(`window.scrollBy(0, -${distance})`);
    this.logger.info(`Scrolled up by ${distance}px`);
  }

  /**
   * Tap (mobile click)
   */
  async tap(locator: string | Locator): Promise<void> {
    const element = this.getElement(locator);
    await element.tap();
    this.logger.info(`Tapped element: ${locator}`);
  }

  /**
   * Long press
   */
  async longPress(locator: string | Locator, duration: number = 1000): Promise<void> {
    const element = this.getElement(locator);
    const box = await element.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await this.page.mouse.down();
      await this.page.waitForTimeout(duration);
      await this.page.mouse.up();
      this.logger.info(`Long pressed element: ${locator} for ${duration}ms`);
    }
  }

  /**
   * Swipe left
   */
  async swipeLeft(distance: number = 300): Promise<void> {
    const viewport = this.page.viewportSize();
    if (viewport) {
      const startX = viewport.width - 50;
      const endX = startX - distance;
      const y = viewport.height / 2;

      await this.page.mouse.move(startX, y);
      await this.page.mouse.down();
      await this.page.mouse.move(endX, y, { steps: 10 });
      await this.page.mouse.up();
      this.logger.info(`Swiped left by ${distance}px`);
    }
  }

  /**
   * Swipe right
   */
  async swipeRight(distance: number = 300): Promise<void> {
    const viewport = this.page.viewportSize();
    if (viewport) {
      const startX = 50;
      const endX = startX + distance;
      const y = viewport.height / 2;

      await this.page.mouse.move(startX, y);
      await this.page.mouse.down();
      await this.page.mouse.move(endX, y, { steps: 10 });
      await this.page.mouse.up();
      this.logger.info(`Swiped right by ${distance}px`);
    }
  }

  /**
   * Swipe up
   */
  async swipeUp(distance: number = 300): Promise<void> {
    const viewport = this.page.viewportSize();
    if (viewport) {
      const x = viewport.width / 2;
      const startY = viewport.height - 50;
      const endY = startY - distance;

      await this.page.mouse.move(x, startY);
      await this.page.mouse.down();
      await this.page.mouse.move(x, endY, { steps: 10 });
      await this.page.mouse.up();
      this.logger.info(`Swiped up by ${distance}px`);
    }
  }

  /**
   * Swipe down
   */
  async swipeDown(distance: number = 300): Promise<void> {
    const viewport = this.page.viewportSize();
    if (viewport) {
      const x = viewport.width / 2;
      const startY = 50;
      const endY = startY + distance;

      await this.page.mouse.move(x, startY);
      await this.page.mouse.down();
      await this.page.mouse.move(x, endY, { steps: 10 });
      await this.page.mouse.up();
      this.logger.info(`Swiped down by ${distance}px`);
    }
  }

  /**
   * Double tap
   */
  async doubleTap(locator: string | Locator): Promise<void> {
    const element = this.getElement(locator);
    await element.dblclick();
    this.logger.info(`Double tapped element: ${locator}`);
  }

  /**
   * Get viewport size
   */
  getViewportSize(): { width: number; height: number } | null {
    return this.page.viewportSize();
  }

  /**
   * Emulate device
   */
  async emulateDevice(deviceName: string): Promise<void> {
    this.logger.info(`Emulating device: ${deviceName}`);
    // Device emulation setup can be done in playwright.config.ts
  }
}
