import { ILogger } from '../../src/core/logger/logger.factory';

export class LoggerMock implements ILogger {
  debug(message: string, context?: string): void {
    throw new Error('Method not implemented.');
  }
  error(message: string, context?: string): void {
    throw new Error('Method not implemented.');
  }
  info(message: string, context?: string): void {
    throw new Error('Method not implemented.');
  }
  warn(message: string, context?: string): void {
    throw new Error('Method not implemented.');
  }
  log(message: string, context?: string): void {
    throw new Error('Method not implemented.');
  }
}
