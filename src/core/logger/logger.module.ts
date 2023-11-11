import { ClassProvider, Module } from '@nestjs/common';
import { loggerToken } from './logger.di';
import { LoggerService } from './logger.service';

const loggerProvider: ClassProvider = {
  provide: loggerToken,
  useClass: LoggerService,
};

@Module({
  providers: [loggerProvider],
  exports: [loggerProvider],
})
export class LoggerModule {}
