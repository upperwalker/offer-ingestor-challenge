import { Logger, LoggerService as ILogger } from '@nestjs/common';

export { LoggerService as ILogger } from '@nestjs/common';
export interface ILoggerFactory {
  create(context: string): ILogger;
}

export class ContextedLoggerFactory implements ILoggerFactory {
  create(context: string): ILogger {
    return new Logger(context);
  }
}
