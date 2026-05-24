import { Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

/**
 * Example: Login Page
 */
export class LoginPage extends BasePage {
  // Locators
  readonly usernameInput = 'input[name="username"]';
  readonly passwordInput = 'input[name="password"]';
  readonly loginButton = 'button:has-text("Login")';
  readonly errorMessage = '.error-message';

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    this.logger.info(`Logging in with username: ${username}`);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
    await this.waitForNavigation(() => this.page.waitForURL(/.*dashboard.*/));
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }
}
