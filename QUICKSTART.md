# Quick Start Guide

## Getting Started in 5 Minutes

### 1. Install & Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Build TypeScript
npm run build

# Install Playwright browsers
npx playwright install
```

### 2. Update Configuration

Edit `.env` with your test URLs:
```env
BASE_URL=https://your-app.com
API_BASE_URL=https://api.your-app.com
```

### 3. Create Your First Test

**UI Test** - Create `src/tests/ui/mytest.spec.ts`:
```typescript
import { test, expect } from '@tests/BaseTest';
import { LoginPage } from '@pages/LoginPage';

test('login example', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('https://your-app.com/login');
  await loginPage.login('user', 'pass');
  expect(page).toBeTruthy();
});
```

**API Test** - Create `src/tests/api/myapi.spec.ts`:
```typescript
import { test, expect } from '@tests/BaseTest';
import { APIClient } from '@api/APIClient';

test('get users', async () => {
  const apiClient = new APIClient();
  const response = await apiClient.get('/users');
  expect(response.status).toBe(200);
});
```

**Mobile Test** - Create `src/tests/mobile/mymobile.spec.ts`:
```typescript
import { test } from '@tests/BaseTest';
import { BaseMobilePage } from '@mobile/BaseMobilePage';

test('mobile swipe', async ({ page }) => {
  const mobilePage = new BaseMobilePage(page);
  await mobilePage.goto('https://your-app.com');
  await mobilePage.swipeLeft(300);
});
```

### 4. Run Tests

```bash
npm run test:ui          # UI tests
npm run test:api         # API tests
npm run test:mobile      # Mobile tests
npm run test:all         # All tests
npm run test:headed      # Headed mode (see browser)
```

### 5. View Results

Open `test-results/index.html` in browser to see detailed test report.

## Common Tasks

### Create New Page Object

```typescript
// src/pages/MyPage.ts
import { Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class MyPage extends BasePage {
  readonly myButton = 'button[id="myButton"]';
  
  constructor(page: Page) {
    super(page);
  }
  
  async clickMyButton(): Promise<void> {
    await this.click(this.myButton);
  }
}
```

### Create New API Helper

```typescript
// src/api/UserAPI.ts
import { APIClient } from '@api/APIClient';

export class UserAPI {
  private apiClient: APIClient;
  
  constructor() {
    this.apiClient = new APIClient();
  }
  
  async getUser(id: string) {
    return await this.apiClient.get(`/users/${id}`);
  }
}
```

### Add Test Fixture

```typescript
// tests/fixtures/customFixtures.ts
import { test as base } from '@playwright/test';

export const customTest = base.extend({
  customData: async ({}, use) => {
    const data = { custom: 'value' };
    await use(data);
  }
});
```

## MCP Server Usage

### Start Server
```bash
npm run mcp
```

### Make Requests (from your AI/CLI)
```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"runUITests","id":"1"}'
```

## Debugging

### Debug Mode
```bash
npm run test:debug
```
This opens the Playwright Inspector where you can step through tests.

### View Logs
Check console output with log level:
```bash
LOG_LEVEL=debug npm run test:ui
```

### Screenshots on Failure
Enable in `.env`:
```env
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
```

## Directory Quick Reference

| Directory | Purpose |
|-----------|---------|
| `src/pages/` | Page Object Models |
| `src/api/` | API client & utilities |
| `src/mobile/` | Mobile page objects |
| `src/tests/` | Test files |
| `src/utils/` | Helper utilities |
| `src/config/` | Configuration |
| `src/mcp/` | MCP server |
| `tests/data/` | Test data files |
| `tests/fixtures/` | Test fixtures |
| `test-results/` | Test reports |

## Next Steps

1. Customize `playwright.config.ts` for your needs
2. Create your page objects in `src/pages/`
3. Add your test data to `tests/data/`
4. Write your first test in `src/tests/`
5. Run tests with `npm run test:all`

For detailed documentation, see [README.md](./README.md)

**Ready to automate! 🚀**
