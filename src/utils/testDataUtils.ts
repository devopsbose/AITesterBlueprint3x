/**
 * Test data utilities
 */
export class TestDataUtils {
  /**
   * Load test data from file
   */
  static loadTestData(filePath: string): Record<string, unknown> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require(filePath);
    } catch (error) {
      console.error(`Failed to load test data from ${filePath}`);
      return {};
    }
  }

  /**
   * Generate random string
   */
  static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    return `test_${this.generateRandomString(8)}@example.com`;
  }

  /**
   * Generate random number
   */
  static generateRandomNumber(min: number = 1, max: number = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get current timestamp
   */
  static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Merge test data objects
   */
  static mergeData(baseData: Record<string, unknown>, overrides: Record<string, unknown>): Record<string, unknown> {
    return {
      ...baseData,
      ...overrides,
    };
  }
}
