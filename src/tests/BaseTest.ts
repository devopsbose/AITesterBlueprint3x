import { test as base, BrowserContext } from '@playwright/test';
import { Logger } from '@utils/logger';
import { APIClient } from '@api/APIClient';

type TestFixtures = {
  apiClient: APIClient;
  logger: Logger;
};

/**
 * Base Test fixture with common utilities
 */
export const test = base.extend<TestFixtures>({
  apiClient: async ({}, use) => {
    const apiClient = new APIClient();
    await use(apiClient);
  },
  logger: async ({}, use) => {
    const logger = new Logger('Test');
    await use(logger);
  },
});

export { expect } from '@playwright/test';
