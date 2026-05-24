# AI Tester Blueprint - Playwright POM Framework

A comprehensive TypeScript and Playwright testing framework with **Page Object Model (POM)** architecture supporting **UI**, **API**, and **Mobile** testing, with **MCP (Model Context Protocol) Server** capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Architecture](#architecture)
- [Testing](#testing)
- [MCP Server](#mcp-server)
- [Examples](#examples)
- [Contributing](#contributing)

## ✨ Features

- ✅ **Page Object Model (POM)** - Clean, maintainable test structure
- ✅ **UI Testing** - Playwright-based web automation
- ✅ **API Testing** - RESTful API testing with Axios
- ✅ **Mobile Testing** - Native mobile device testing support
- ✅ **MCP Server** - Model Context Protocol integration for AI/LLM interactions
- ✅ **TypeScript** - Full type safety and IDE support
- ✅ **Configurable** - Environment-based configuration via `.env`
- ✅ **Logging** - Structured logging throughout the framework
- ✅ **Test Fixtures** - Pre-configured fixtures for each test type
- ✅ **Test Utilities** - Helper functions for common operations
- ✅ **CI/CD Ready** - Easy integration with CI/CD pipelines

## 📁 Project Structure

```
AITesterBlueprint3x/
├── src/
│   ├── pages/                 # Page Object Models for UI testing
│   │   ├── BasePage.ts       # Base class for all pages
│   │   ├── LoginPage.ts      # Example login page
│   │   └── DashboardPage.ts  # Example dashboard page
│   │
│   ├── api/                  # API testing utilities
│   │   ├── APIClient.ts      # HTTP client for API testing
│   │   └── BaseAPITest.ts    # Base class for API tests
│   │
│   ├── mobile/               # Mobile testing utilities
│   │   └── BaseMobilePage.ts # Base class for mobile pages
│   │
│   ├── tests/                # Test specifications
│   │   ├── ui/              # UI tests
│   │   ├── api/             # API tests
│   │   ├── mobile/          # Mobile tests
│   │   └── BaseTest.ts      # Base test fixture
│   │
│   ├── config/              # Configuration
│   │   └── Config.ts        # Configuration loader
│   │
│   ├── utils/               # Utility functions
│   │   ├── logger.ts        # Logging utility
│   │   ├── testDataUtils.ts # Test data utilities
│   │   ├── waitUtils.ts     # Wait/polling utilities
│   │   └── assertionUtils.ts # Assertion utilities
│   │
│   └── mcp/                 # MCP Server
│       ├── server.ts        # MCP server implementation
│       └── client.ts        # MCP client utilities
│
├── tests/
│   ├── fixtures/            # Test fixtures
│   │   ├── uiFixtures.ts
│   │   ├── apiFixtures.ts
│   │   └── mobileFixtures.ts
│   │
│   └── data/                # Test data
│       └── testData.json
│
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── .env.example           # Environment variables template
```

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Playwright browsers (auto-installed)

### Setup

1. **Clone/Initialize Project**
   ```bash
   cd AITesterBlueprint3x
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Build TypeScript**
   ```bash
   npm run build
   ```

5. **Install Playwright Browsers**
   ```bash
   npx playwright install
   ```

## ⚙️ Configuration

### Environment Variables (`.env`)

```env
# UI Testing
BASE_URL=https://example.com
HEADLESS=true
BROWSER=chromium
WORKERS=1

# API Testing
API_BASE_URL=https://api.example.com
API_TIMEOUT=30000

# Mobile Testing
MOBILE_DEVICE=iPhone 12

# General
LOG_LEVEL=info
SCREENSHOT_ON_FAILURE=true
VIDEO_ON_FAILURE=true
ENVIRONMENT=dev

# MCP Server
MCP_PORT=3000
MCP_HOST=localhost
```

### Playwright Config

Edit `playwright.config.ts` to customize:
- Browsers (Chromium, Firefox, WebKit)
- Mobile devices (iPhone, Android)
- Timeouts and retries
- Reporters (HTML, JSON, JUnit)
- Video/Screenshot recording

## 📖 Usage

### Running Tests

```bash
# Run all tests
npm run test:all

# Run UI tests only
npm run test:ui

# Run API tests only
npm run test:api

# Run Mobile tests only
npm run test:mobile

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Build TypeScript
npm run build

# Watch mode
npm run dev
```

### Linting and Formatting

```bash
npm run lint      # Run ESLint
npm run format    # Format with Prettier
```

## 🏗️ Architecture

### Page Object Model (POM)

All UI pages extend `BasePage`:

```typescript
import { Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput = 'input[name="username"]';
  readonly passwordInput = 'input[name="password"]';
  readonly loginButton = 'button:has-text("Login")';

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}
```

### API Testing

Use `APIClient` for HTTP requests:

```typescript
import { APIClient } from '@api/APIClient';

const apiClient = new APIClient();
const response = await apiClient.get('/users');
const newUser = await apiClient.post('/users', { name: 'John' });
```

### Mobile Testing

Extend `BaseMobilePage` for mobile-specific interactions:

```typescript
import { BaseMobilePage } from '@mobile/BaseMobilePage';

export class MobileLoginPage extends BaseMobilePage {
  async loginOnMobile(username: string, password: string): Promise<void> {
    await this.tap(this.usernameInput);
    await this.type(this.passwordInput, password);
    await this.tap(this.loginButton);
  }
}
```

## 🧪 Testing

### UI Test Example

```typescript
import { test, expect } from '@tests/BaseTest';
import { LoginPage } from '@pages/LoginPage';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto('https://example.com/login');
  await loginPage.login('user@example.com', 'password');
  
  expect(await page.title()).toContain('Dashboard');
});
```

### API Test Example

```typescript
import { test, expect } from '@playwright/test';
import { APIClient } from '@api/APIClient';

test('should fetch users', async () => {
  const apiClient = new APIClient();
  const response = await apiClient.get('/users');
  
  expect(response.status).toBe(200);
  expect(Array.isArray(response.data)).toBeTruthy();
});
```

### Mobile Test Example

```typescript
import { test } from '@playwright/test';
import { BaseMobilePage } from '@mobile/BaseMobilePage';

test('should work on mobile', async ({ page }) => {
  const mobilePage = new BaseMobilePage(page);
  await mobilePage.swipeLeft(300);
  await mobilePage.tap('button:has-text("Submit")');
});
```

## 🔌 MCP Server

The framework includes an MCP Server for AI/LLM interactions.

### Starting MCP Server

```bash
npm run mcp
```

Server runs on `http://localhost:3000` by default.

### Available MCP Methods

#### Run Tests
- `runUITests()` - Execute UI test suite
- `runAPITests()` - Execute API test suite
- `runMobileTests()` - Execute mobile test suite
- `runAllTests()` - Execute all tests

#### Get Results
- `getTestResults()` - Retrieve test results from last run

#### Execute API Calls
- `apiCall(method, endpoint, data?, headers?)` - Make API calls

### MCP Client Usage

```typescript
import { MCPClient } from '@mcp/client';

const client = new MCPClient('http://localhost:3000');
const result = await client.runUITests();
const apiResponse = await client.executeAPICall('GET', '/users');
```

### Example MCP Request (JSON-RPC)

```json
{
  "jsonrpc": "2.0",
  "method": "runUITests",
  "id": "1"
}
```

## 📚 Utilities

### Logger

```typescript
import { Logger } from '@utils/logger';

const logger = new Logger('MyTest');
logger.info('Test started');
logger.success('Test passed');
logger.error('Test failed', error);
```

### Test Data

```typescript
import { TestDataUtils } from '@utils/testDataUtils';

const randomString = TestDataUtils.generateRandomString(10);
const randomEmail = TestDataUtils.generateRandomEmail();
const timestamp = TestDataUtils.getCurrentTimestamp();
```

### Wait/Polling

```typescript
import { WaitUtils } from '@utils/waitUtils';

await WaitUtils.sleep(1000);
await WaitUtils.waitUntil(() => condition(), { timeout: 5000 });
```

### Assertions

```typescript
import { AssertionUtils } from '@utils/assertionUtils';

AssertionUtils.assertTrue(value, 'Value should be true');
AssertionUtils.assertEqual(actual, expected, 'Should match');
```

## 📊 Test Reports

Test reports are generated in the `test-results/` directory:

- `index.html` - HTML report (open in browser)
- `results.json` - JSON report
- `results.xml` - JUnit XML report

## 🔒 Best Practices

1. **Page Objects** - Keep selectors in page objects
2. **Assertions** - Use Playwright's expect() or custom assertions
3. **Test Data** - Store in `tests/data/` directory
4. **Logging** - Use Logger utility for debugging
5. **Waits** - Prefer explicit waits over sleep()
6. **Fixtures** - Use test fixtures for setup/teardown
7. **Environment** - Use `.env` for configuration
8. **Naming** - Use descriptive names for pages and tests

## 🚨 Troubleshooting

### Tests Timeout
- Increase `timeout` in `playwright.config.ts`
- Check network connectivity
- Verify selectors are correct

### Mobile Tests Fail
- Verify device is configured in `playwright.config.ts`
- Check `MOBILE_DEVICE` environment variable
- Ensure viewport is mobile-sized

### API Tests Fail
- Verify `API_BASE_URL` is correct
- Check authentication tokens/headers
- Review API response status codes

### MCP Server Won't Start
- Check port is not in use
- Verify `MCP_PORT` environment variable
- Check Node.js compatibility

## 📝 License

MIT

## 🤝 Contributing

1. Create feature branches
2. Follow TypeScript/ESLint standards
3. Write tests for new features
4. Submit pull requests

---

**Happy Testing! 🎉**

