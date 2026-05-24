import { APIClient } from './APIClient';
import { Logger } from '@utils/logger';

/**
 * Base API test class
 * Extend this for specific API test suites
 */
export class BaseAPITest {
  protected apiClient: APIClient;
  protected logger: Logger;
  protected baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.API_BASE_URL || 'https://api.example.com';
    this.apiClient = new APIClient(this.baseURL);
    this.logger = new Logger('BaseAPITest');
  }

  /**
   * Verify response status
   */
  verifyStatusCode(actualStatus: number, expectedStatus: number): boolean {
    const isValid = actualStatus === expectedStatus;
    if (isValid) {
      this.logger.success(`Status code verified: ${actualStatus}`);
    } else {
      this.logger.error(
        `Status code mismatch. Expected: ${expectedStatus}, Actual: ${actualStatus}`
      );
    }
    return isValid;
  }

  /**
   * Verify response contains field
   */
  verifyResponseField(response: unknown, fieldPath: string): boolean {
    try {
      const fields = fieldPath.split('.');
      let current: unknown = response;

      for (const field of fields) {
        if (current && typeof current === 'object' && field in current) {
          current = (current as Record<string, unknown>)[field];
        } else {
          this.logger.error(`Field not found: ${fieldPath}`);
          return false;
        }
      }

      this.logger.success(`Field verified: ${fieldPath}`);
      return true;
    } catch (error) {
      this.logger.error(`Error verifying field: ${fieldPath}`);
      return false;
    }
  }

  /**
   * Extract response field value
   */
  getResponseField(response: unknown, fieldPath: string): unknown {
    const fields = fieldPath.split('.');
    let current: unknown = response;

    for (const field of fields) {
      if (current && typeof current === 'object' && field in current) {
        current = (current as Record<string, unknown>)[field];
      } else {
        return null;
      }
    }

    return current;
  }
}
