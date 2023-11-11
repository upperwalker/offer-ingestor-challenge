import { Logger, LoggerService as ILoggerService } from '@nestjs/common';

export interface IContextedLogger extends ILoggerService {
  setContext(context: string): void;
  info(message: any): void;
}

export class LoggerService extends Logger implements IContextedLogger {
  setContext(context: string) {
    this.context = context;
  }

  info(message: any) {
    this.log(message, this.context);
  }
}
