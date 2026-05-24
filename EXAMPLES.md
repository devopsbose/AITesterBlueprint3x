# Advanced Examples & Customization Guide

## Table of Contents
1. [Extending Page Objects](#extending-page-objects)
2. [API Testing Patterns](#api-testing-patterns)
3. [Mobile Testing Patterns](#mobile-testing-patterns)
4. [Custom Fixtures](#custom-fixtures)
5. [Authentication Handling](#authentication-handling)
6. [Data-Driven Testing](#data-driven-testing)
7. [Error Handling & Retries](#error-handling--retries)
8. [Parallel Testing](#parallel-testing)
9. [CI/CD Integration](#cicd-integration)
10. [MCP Server Integration](#mcp-server-integration)

---

## Extending Page Objects

### Create a Complex Page Object

```typescript
// src/pages/ProductPage.ts
import { Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ProductPage extends BasePage {
  // Locators
  readonly productList = '.product-list';
  readonly productItem = '.product-item';
  readonly priceFilter = 'input[name="priceFilter"]';
  readonly searchBox = 'input[placeholder="Search products"]';
  readonly sortDropdown = 'select[name="sort"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Search for product by name
   */
  async searchProduct(productName: string): Promise<void> {
    await this.fill(this.searchBox, productName);
    await this.pressKey('Enter');
    await this.waitForElement(this.productItem);
  }

  /**
   * Filter products by price range
   */
  async filterByPrice(maxPrice: number): Promise<void> {
    await this.fill(this.priceFilter, maxPrice.toString());
    await this.pressKey('Enter');
  }

  /**
   * Sort products
   */
  async sortBy(sortOption: string): Promise<void> {
    await this.selectOption(this.sortDropdown, sortOption);
  }

  /**
   * Get all product names
   */
  async getProductNames(): Promise<string[]> {
    return await this.getAllText(this.productItem);
  }

  /**
   * Click product by name
   */
  async clickProduct(productName: string): Promise<void> {
    const productLocator = `${this.productItem}:has-text("${productName}")`;
    await this.click(productLocator);
  }

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    return await this.getPage().locator(this.productItem).count();
  }
}
```

---

## API Testing Patterns

### Create Specialized API Client

```typescript
// src/api/UserAPI.ts
import { APIClient } from '@api/APIClient';
import { BaseAPITest } from '@api/BaseAPITest';

export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
}

export class UserAPI extends BaseAPITest {
  private apiClient: APIClient;

  constructor(baseURL?: string) {
    super(baseURL);
    this.apiClient = new APIClient(this.baseURL);
  }

  /**
   * Create new user
   */
  async createUser(userData: User) {
    const response = await this.apiClient.post('/users', userData);
    this.verifyStatusCode(response.status, 201);
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string) {
    const response = await this.apiClient.get(`/users/${userId}`);
    this.verifyStatusCode(response.status, 200);
    return response.data;
  }

  /**
   * Update user
   */
  async updateUser(userId: string, userData: Partial<User>) {
    const response = await this.apiClient.put(`/users/${userId}`, userData);
    this.verifyStatusCode(response.status, 200);
    return response.data;
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string) {
    const response = await this.apiClient.delete(`/users/${userId}`);
    this.verifyStatusCode(response.status, 204);
  }

  /**
   * Get all users with filtering
   */
  async getAllUsers(filters?: { role?: string; active?: boolean }) {
    let url = '/users';
    if (filters) {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.active !== undefined) params.append('active', String(filters.active));
      url += `?${params.toString()}`;
    }
    const response = await this.apiClient.get(url);
    this.verifyStatusCode(response.status, 200);
    return response.data;
  }
}
```

### API Test Suite

```typescript
// src/tests/api/users-advanced.spec.ts
import { test, expect } from '@tests/BaseTest';
import { UserAPI } from '@api/UserAPI';

test.describe('User API - Advanced Scenarios', () => {
  let userAPI: UserAPI;

  test.beforeEach(() => {
    userAPI = new UserAPI();
  });

  test('should create, update, and delete user', async () => {
    // Create
    const newUser = await userAPI.createUser({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    });
    expect(newUser.id).toBeTruthy();

    // Update
    const updated = await userAPI.updateUser(newUser.id, {
      name: 'Jane Doe'
    });
    expect(updated.name).toBe('Jane Doe');

    // Delete
    await userAPI.deleteUser(newUser.id);

    // Verify deleted
    try {
      await userAPI.getUser(newUser.id);
      throw new Error('User should be deleted');
    } catch (error) {
      expect((error as any).response?.status).toBe(404);
    }
  });

  test('should filter users by role', async () => {
    const adminUsers = await userAPI.getAllUsers({ role: 'admin' });
    expect(Array.isArray(adminUsers)).toBeTruthy();
  });
});
```

---

## Mobile Testing Patterns

### Create Mobile-Specific Page

```typescript
// src/mobile/ProductMobilePage.ts
import { Page } from '@playwright/test';
import { BaseMobilePage } from '@mobile/BaseMobilePage';

export class ProductMobilePage extends BaseMobilePage {
  readonly productCard = '.product-card';
  readonly cartButton = 'button[aria-label="Add to cart"]';
  readonly filterMenu = '.filter-menu';
  readonly bottomNav = '.bottom-navigation';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Scroll and find product
   */
  async findProductByScroll(productName: string): Promise<boolean> {
    const maxAttempts = 5;
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const locator = `${this.productCard}:has-text("${productName}")`;
        if (await this.isVisible(locator)) {
          return true;
        }
      } catch (error) {
        // Continue
      }
      await this.scrollDown(200);
    }
    return false;
  }

  /**
   * Add product to cart with mobile swipe
   */
  async addToCartWithSwipe(productName: string): Promise<void> {
    const locator = `${this.productCard}:has-text("${productName}")`;
    await this.swipeLeft(150); // Reveal action buttons
    const cartBtn = `${locator} ${this.cartButton}`;
    await this.tap(cartBtn);
  }

  /**
   * Open mobile filter menu
   */
  async openMobileFilterMenu(): Promise<void> {
    await this.tap(this.filterMenu);
    await this.waitForElement(this.filterMenu);
  }

  /**
   * Navigate using bottom navigation
   */
  async navigateViaBottomNav(navItem: string): Promise<void> {
    const navButton = `${this.bottomNav} button:has-text("${navItem}")`;
    await this.tap(navButton);
  }
}
```

### Mobile Test

```typescript
// src/tests/mobile/shopping-mobile.spec.ts
import { test, devices } from '@tests/BaseTest';
import { ProductMobilePage } from '@mobile/ProductMobilePage';

test.use({ ...devices['iPhone 12'] });

test('mobile shopping flow', async ({ page }) => {
  const productPage = new ProductMobilePage(page);
  await productPage.goto('https://example.com/shop');

  // Find product by scrolling
  const found = await productPage.findProductByScroll('Laptop');
  expect(found).toBeTruthy();

  // Add to cart with swipe
  await productPage.addToCartWithSwipe('Laptop');

  // Navigate to cart
  await productPage.navigateViaBottomNav('Cart');
});
```

---

## Custom Fixtures

### Create Authenticated User Fixture

```typescript
// tests/fixtures/authFixtures.ts
import { test as base } from '@tests/BaseTest';
import { APIClient } from '@api/APIClient';

interface AuthFixtures {
  authenticatedAPI: APIClient;
  authToken: string;
}

export const authTest = base.extend<AuthFixtures>({
  authToken: async ({ apiClient }, use) => {
    // Login and get token
    const response = await apiClient.post('/login', {
      username: 'testuser',
      password: 'password'
    });
    const token = (response.data as { token: string }).token;
    await use(token);
  },

  authenticatedAPI: async ({ authToken }, use) => {
    const apiClient = new APIClient();
    apiClient.setAuthToken(authToken);
    await use(apiClient);
  }
});

export { expect } from '@tests/BaseTest';
```

### Use Authenticated Fixture

```typescript
import { authTest, expect } from '@tests/fixtures/authFixtures';

authTest('should access protected endpoint', async ({ authenticatedAPI }) => {
  const response = await authenticatedAPI.get('/profile');
  expect(response.status).toBe(200);
});
```

---

## Authentication Handling

### Setup Authentication in Tests

```typescript
// src/tests/ui/authenticated-flow.spec.ts
import { test, expect } from '@tests/BaseTest';
import { LoginPage } from '@pages/LoginPage';
import { DashboardPage } from '@pages/DashboardPage';

test.describe('Authenticated User Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto('https://example.com/login');
    await loginPage.login('user@example.com', 'password123');
  });

  test('should access dashboard after login', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    expect(await dashboardPage.isWelcomeHeaderVisible()).toBeTruthy();
  });

  test('should access profile', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.navigateToProfile();
    expect(await page.url()).toContain('/profile');
  });
});
```

---

## Data-Driven Testing

### Data-Driven Test Suite

```typescript
// src/tests/ui/data-driven-login.spec.ts
import { test, expect } from '@tests/BaseTest';
import { LoginPage } from '@pages/LoginPage';
import { TestDataUtils } from '@utils/testDataUtils';

const testCases = [
  { username: 'valid@example.com', password: 'password123', shouldSucceed: true },
  { username: 'invalid@example.com', password: 'wrongpass', shouldSucceed: false },
  { username: '', password: 'password123', shouldSucceed: false },
  { username: 'valid@example.com', password: '', shouldSucceed: false },
];

test.describe('Login - Data-Driven Tests', () => {
  testCases.forEach(({ username, password, shouldSucceed }) => {
    test(`login with username="${username}" should ${shouldSucceed ? 'succeed' : 'fail'}`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto('https://example.com/login');

      if (username) await loginPage.fill(loginPage['usernameInput'], username);
      if (password) await loginPage.fill(loginPage['passwordInput'], password);
      await loginPage.click(loginPage['loginButton']);

      if (shouldSucceed) {
        await page.waitForURL(/.*dashboard.*/);
      } else {
        expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
      }
    });
  });
});
```

---

## Error Handling & Retries

### Test with Retry Logic

```typescript
// src/tests/ui/retry-example.spec.ts
import { test, expect } from '@tests/BaseTest';
import { WaitUtils } from '@utils/waitUtils';
import { AssertionUtils } from '@utils/assertionUtils';

test('should handle network delays with retry', async ({ page }) => {
  // Retry logic for element visibility
  await WaitUtils.waitWithRetry(
    async () => {
      const element = page.locator('button');
      await element.waitFor({ state: 'visible' });
    },
    { maxRetries: 5, delay: 1000 }
  );
});

test('should wait for condition', async ({ page }) => {
  // Wait for condition with polling
  await WaitUtils.waitUntil(
    async () => {
      const count = await page.locator('.item').count();
      return count > 0;
    },
    { timeout: 10000, pollInterval: 500 }
  );
});
```

---

## Parallel Testing

### Configure Parallel Execution

In `playwright.config.ts`:

```typescript
export default defineConfig({
  fullyParallel: true,
  workers: 4, // Run 4 tests in parallel
  // ... rest of config
});
```

Organize tests by project:

```typescript
projects: [
  {
    name: 'ui-tests',
    testDir: './src/tests/ui',
    workers: 2,
  },
  {
    name: 'api-tests',
    testDir: './src/tests/api',
    workers: 4, // API tests can run more in parallel
  },
];
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/tests.yml
name: Automated Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        test-type: [ui, api, mobile]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Install Playwright
        run: npx playwright install
      
      - name: Run ${{ matrix.test-type }} tests
        run: npm run test:${{ matrix.test-type }}
      
      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results-${{ matrix.test-type }}
          path: test-results/
```

---

## MCP Server Integration

### Make MCP Requests from CLI

```bash
# Run UI tests via MCP
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"runUITests","id":"1"}'

# Make API call via MCP
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "method":"apiCall",
    "params":{
      "method":"GET",
      "endpoint":"/users"
    },
    "id":"2"
  }'
```

### MCP Client Usage

```typescript
import { MCPClient } from '@mcp/client';

const client = new MCPClient('http://localhost:3000');

// Run tests
const uiResults = await client.runUITests();
const apiResults = await client.runAPITests();
const allResults = await client.runAllTests();

// Make API calls
const users = await client.executeAPICall('GET', '/users');
const newUser = await client.executeAPICall('POST', '/users', {
  name: 'John',
  email: 'john@example.com'
});
```

---

## Tips & Best Practices

1. **Page Objects** - Keep one responsibility per page object
2. **Selectors** - Use data-testid attributes when possible
3. **Waits** - Always wait for elements, don't use sleep()
4. **Logging** - Log important steps for debugging
5. **Configuration** - Use environment variables
6. **Fixtures** - Pre-setup common test state
7. **Error Handling** - Always catch and log errors
8. **Performance** - Run independent tests in parallel

---

Happy Advanced Testing! 🚀
