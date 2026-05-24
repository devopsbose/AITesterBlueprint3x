import { test as base } from '@playwright/test';
import { APIClient } from '@api/APIClient';
import { Logger } from '@utils/logger';

interface UITestFixtures {
  apiClient: APIClient;
  logger: Logger;
}

/**
 * UI Test fixture with pre-configured API client and logger
 */
export const uiTest = base.extend<UITestFixtures>({
  apiClient: async ({}, use) => {
    const apiClient = new APIClient();
    // Set any global headers/auth if needed
    await use(apiClient);
  },

  logger: async ({}, use) => {
    const logger = new Logger('UITest');
    await use(logger);
  },
});

export { expect } from '@playwright/test';
