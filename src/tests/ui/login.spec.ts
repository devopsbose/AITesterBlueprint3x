import { test, expect } from '@tests/BaseTest';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

test.describe('UI Testing - Login Flow', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.goto('https://example.com/login');
  });

  test('should login successfully with valid credentials', async () => {
    await loginPage.login('testuser', 'password123');
    expect(await dashboardPage.isWelcomeHeaderVisible()).toBeTruthy();
  });

  test('should display error message with invalid credentials', async () => {
    await loginPage.fill(loginPage['usernameInput'], 'invaliduser');
    await loginPage.fill(loginPage['passwordInput'], 'wrongpass');
    await loginPage.click(loginPage['loginButton']);

    const isErrorVisible = await loginPage.isErrorMessageVisible();
    expect(isErrorVisible).toBeTruthy();
  });

  test('should logout successfully', async () => {
    await loginPage.login('testuser', 'password123');
    await dashboardPage.logout();
    await loginPage.waitForUrl(/.*login.*/);
  });
});
