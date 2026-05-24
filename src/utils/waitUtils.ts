/**
 * Wait utilities for test synchronization
 */
export class WaitUtils {
  /**
   * Wait for specified milliseconds
   */
  static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Wait with retry logic
   */
  static async waitWithRetry<T>(
    callback: () => Promise<T>,
    options: { maxRetries: number; delay: number } = { maxRetries: 3, delay: 1000 }
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
      try {
        return await callback();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < options.maxRetries) {
          await this.sleep(options.delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Wait until condition is true
   */
  static async waitUntil(
    condition: () => Promise<boolean>,
    options: { timeout: number; pollInterval: number } = { timeout: 30000, pollInterval: 500 }
  ): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < options.timeout) {
      try {
        const result = await condition();
        if (result) {
          return;
        }
      } catch (error) {
        // Continue waiting
      }
      await this.sleep(options.pollInterval);
    }

    throw new Error('Wait condition timeout exceeded');
  }
}
