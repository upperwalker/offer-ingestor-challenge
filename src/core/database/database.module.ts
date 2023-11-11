import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      logging: true,
      entities: [join(__dirname, '../../', '**/*.entity{.ts,.js}')],
    }),
  ],
})
export class DatabaseModule {}
