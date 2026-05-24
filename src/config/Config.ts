/**
 * Configuration loader utility
 */
export class Config {
  static getBaseURL(): string {
    return process.env.BASE_URL || 'https://example.com';
  }

  static getAPIBaseURL(): string {
    return process.env.API_BASE_URL || 'https://api.example.com';
  }

  static isHeadless(): boolean {
    return process.env.HEADLESS !== 'false';
  }

  static getBrowser(): string {
    return process.env.BROWSER || 'chromium';
  }

  static getWorkers(): number {
    return parseInt(process.env.WORKERS || '1');
  }

  static getEnvironment(): string {
    return process.env.ENVIRONMENT || 'dev';
  }

  static getLogLevel(): string {
    return process.env.LOG_LEVEL || 'info';
  }

  static shouldScreenshotOnFailure(): boolean {
    return process.env.SCREENSHOT_ON_FAILURE !== 'false';
  }

  static shouldVideoOnFailure(): boolean {
    return process.env.VIDEO_ON_FAILURE !== 'false';
  }

  static getMobileDevice(): string {
    return process.env.MOBILE_DEVICE || 'iPhone 12';
  }

  static getMCPPort(): number {
    return parseInt(process.env.MCP_PORT || '3000');
  }

  static getMCPHost(): string {
    return process.env.MCP_HOST || 'localhost';
  }

  static getTimeout(): number {
    return parseInt(process.env.API_TIMEOUT || '30000');
  }
}
