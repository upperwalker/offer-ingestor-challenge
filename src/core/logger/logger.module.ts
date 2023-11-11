import { ClassProvider, Module } from '@nestjs/common';
import { loggerFactoryToken } from './logger.di';
import { ContextedLoggerFactory } from './logger.factory';

const loggerFactoryProvider: ClassProvider = {
  provide: loggerFactoryToken,
  useClass: ContextedLoggerFactory,
};

@Module({
  providers: [loggerFactoryProvider],
  exports: [loggerFactoryProvider],
})
export class LoggerModule {}
