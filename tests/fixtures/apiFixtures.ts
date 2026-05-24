import { test as base } from '@playwright/test';
import { APIClient } from '@api/APIClient';
import { Logger } from '@utils/logger';

interface APITestFixtures {
  apiClient: APIClient;
  logger: Logger;
  testData: Record<string, unknown>;
}

/**
 * API Test fixture with pre-configured API client, logger, and test data
 */
export const apiTest = base.extend<APITestFixtures>({
  apiClient: async ({}, use) => {
    const apiClient = new APIClient();
    // Set base headers if needed
    apiClient.setHeader('Accept', 'application/json');
    await use(apiClient);
  },

  logger: async ({}, use) => {
    const logger = new Logger('APITest');
    await use(logger);
  },

  testData: async ({}, use) => {
    const data = {
      endpoint: '/users',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    };
    await use(data);
  },
});

export { expect } from '@playwright/test';
