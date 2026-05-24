import { Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

/**
 * Example: Dashboard Page
 */
export class DashboardPage extends BasePage {
  // Locators
  readonly welcomeHeader = 'h1:has-text("Welcome")';
  readonly logoutButton = 'button:has-text("Logout")';
  readonly userMenu = '.user-menu';
  readonly profileLink = 'a:has-text("Profile")';

  constructor(page: Page) {
    super(page);
  }

  async isWelcomeHeaderVisible(): Promise<boolean> {
    return await this.isVisible(this.welcomeHeader);
  }

  async logout(): Promise<void> {
    this.logger.info('Logging out');
    await this.click(this.logoutButton);
    await this.waitForUrl(/.*login.*/);
  }

  async openUserMenu(): Promise<void> {
    this.logger.info('Opening user menu');
    await this.click(this.userMenu);
  }

  async navigateToProfile(): Promise<void> {
    this.logger.info('Navigating to profile');
    await this.openUserMenu();
    await this.click(this.profileLink);
  }
}
