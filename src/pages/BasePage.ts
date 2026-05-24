import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '@utils/logger';

/**
 * Base Page Object Model class
 * All page objects should extend this class
 */
export class BasePage {
  protected page: Page;
  protected logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
  }

  /**
   * Navigate to a URL
   */
  async goto(url: string): Promise<void> {
    this.logger.info(`Navigating to ${url}`);
    await this.page.goto(url);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for URL to match pattern
   */
  async waitForUrl(urlPattern: string | RegExp): Promise<void> {
    this.logger.info(`Waiting for URL: ${urlPattern}`);
    await this.page.waitForURL(urlPattern);
  }

  /**
   * Get element by locator
   */
  getElement(locator: string | Locator): Locator {
    if (typeof locator === 'string') {
      return this.page.locator(locator);
    }
    return locator;
  }

  /**
   * Click element
   */
  async click(locator: string | Locator): Promise<void> {
    const element = this.getElement(locator);
    this.logger.info(`Clicking element: ${locator}`);
    await element.click();
  }

  /**
   * Fill input field
   */
  async fill(locator: string | Locator, text: string): Promise<void> {
    const element = this.getElement(locator);
    this.logger.info(`Filling element: ${locator} with text: ${text}`);
    await element.fill(text);
  }

  /**
   * Type text character by character
   */
  async type(locator: string | Locator, text: string): Promise<void> {
    const element = this.getElement(locator);
    this.logger.info(`Typing in element: ${locator} text: ${text}`);
    await element.type(text);
  }

  /**
   * Get text from element
   */
  async getText(locator: string | Locator): Promise<string> {
    const element = this.getElement(locator);
    const text = await element.textContent();
    return text?.trim() || '';
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: string | Locator): Promise<boolean> {
    const element = this.getElement(locator);
    return await element.isVisible();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: string | Locator, timeout: number = 30000): Promise<void> {
    const element = this.getElement(locator);
    await element.waitFor({ state: 'visible', timeout });
  }

  /**
   * Get attribute value
   */
  async getAttribute(locator: string | Locator, attributeName: string): Promise<string | null> {
    const element = this.getElement(locator);
    return await element.getAttribute(attributeName);
  }

  /**
   * Select option from dropdown
   */
  async selectOption(locator: string | Locator, value: string): Promise<void> {
    const element = this.getElement(locator);
    this.logger.info(`Selecting option: ${value} from ${locator}`);
    await element.selectOption(value);
  }

  /**
   * Get all text from multiple elements
   */
  async getAllText(locator: string | Locator): Promise<string[]> {
    const element = this.getElement(locator);
    return await element.allTextContents();
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(callback: () => Promise<void>): Promise<void> {
    await Promise.all([this.page.waitForNavigation(), callback()]);
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    this.logger.info(`Taking screenshot: ${name}`);
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Verify element text
   */
  async verifyElementText(locator: string | Locator, expectedText: string): Promise<void> {
    const element = this.getElement(locator);
    await expect(element).toContainText(expectedText);
  }

  /**
   * Verify element is enabled
   */
  async verifyElementEnabled(locator: string | Locator): Promise<void> {
    const element = this.getElement(locator);
    await expect(element).toBeEnabled();
  }

  /**
   * Hover over element
   */
  async hover(locator: string | Locator): Promise<void> {
    const element = this.getElement(locator);
    this.logger.info(`Hovering over element: ${locator}`);
    await element.hover();
  }

  /**
   * Press key
   */
  async pressKey(key: string): Promise<void> {
    this.logger.info(`Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Reload page
   */
  async reload(): Promise<void> {
    this.logger.info('Reloading page');
    await this.page.reload();
  }

  /**
   * Go back
   */
  async goBack(): Promise<void> {
    this.logger.info('Going back');
    await this.page.goBack();
  }

  /**
   * Wait for timeout
   */
  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Get page object for API testing
   */
  getPage(): Page {
    return this.page;
  }
}
