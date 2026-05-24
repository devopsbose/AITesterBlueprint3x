/**
 * Assertion utilities for common test assertions
 */
export class AssertionUtils {
  /**
   * Assert array contains value
   */
  static assertArrayContains<T>(array: T[], value: T, message?: string): void {
    if (!array.includes(value)) {
      throw new Error(message || `Array does not contain value: ${value}`);
    }
  }

  /**
   * Assert string contains substring
   */
  static assertStringContains(str: string, substring: string, message?: string): void {
    if (!str.includes(substring)) {
      throw new Error(message || `String "${str}" does not contain "${substring}"`);
    }
  }

  /**
   * Assert string matches pattern
   */
  static assertStringMatches(str: string, pattern: RegExp, message?: string): void {
    if (!pattern.test(str)) {
      throw new Error(message || `String "${str}" does not match pattern ${pattern}`);
    }
  }

  /**
   * Assert object has property
   */
  static assertObjectHasProperty(obj: unknown, property: string, message?: string): void {
    if (!obj || typeof obj !== 'object' || !(property in obj)) {
      throw new Error(message || `Object does not have property: ${property}`);
    }
  }

  /**
   * Assert value equals expected
   */
  static assertEqual<T>(actual: T, expected: T, message?: string): void {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
  }

  /**
   * Assert value not equals
   */
  static assertNotEqual<T>(actual: T, unexpected: T, message?: string): void {
    if (actual === unexpected) {
      throw new Error(message || `Value should not equal ${unexpected}`);
    }
  }

  /**
   * Assert value is truthy
   */
  static assertTrue(value: unknown, message?: string): void {
    if (!value) {
      throw new Error(message || `Expected value to be truthy, got: ${value}`);
    }
  }

  /**
   * Assert value is falsy
   */
  static assertFalse(value: unknown, message?: string): void {
    if (value) {
      throw new Error(message || `Expected value to be falsy, got: ${value}`);
    }
  }

  /**
   * Assert value is not null or undefined
   */
  static assertNotNull<T>(value: T | null | undefined, message?: string): void {
    if (value === null || value === undefined) {
      throw new Error(message || 'Expected value to not be null or undefined');
    }
  }
}
