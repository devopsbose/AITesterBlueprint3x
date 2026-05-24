/**
 * Logger utility for consistent logging
 */
export class Logger {
  private context: string;
  private logLevel: string;

  constructor(context: string) {
    this.context = context;
    this.logLevel = process.env.LOG_LEVEL || 'info';
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }

  info(message: string): void {
    console.log(this.formatMessage('INFO', message));
  }

  debug(message: string): void {
    if (this.logLevel === 'debug') {
      console.log(this.formatMessage('DEBUG', message));
    }
  }

  warn(message: string): void {
    console.warn(this.formatMessage('WARN', message));
  }

  error(message: string, error?: Error): void {
    console.error(this.formatMessage('ERROR', message), error?.stack || '');
  }

  success(message: string): void {
    console.log(this.formatMessage('SUCCESS', message));
  }
}
