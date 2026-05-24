import { test as base, devices } from '@playwright/test';
import { Logger } from '@utils/logger';

interface MobileTestFixtures {
  logger: Logger;
  deviceName: string;
}

/**
 * Mobile Test fixture with pre-configured logger and device info
 */
export const mobileTest = base.extend<MobileTestFixtures>({
  logger: async ({}, use) => {
    const logger = new Logger('MobileTest');
    await use(logger);
  },

  deviceName: async ({}, use) => {
    const deviceName = process.env.MOBILE_DEVICE || 'iPhone 12';
    await use(deviceName);
  },
});

export { expect } from '@playwright/test';
