import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OfferModule } from './offer/offer.module';

@Module({
  imports: [OfferModule],
  controllers: [AppController],
})
export class AppModule {}
