import { Controller, Inject, Get } from '@nestjs/common';
import { IIngestOffersUseCase } from './offer/use-cases/ingest-offers-use-case';
import { ingestOffersUseCaseToken } from './offer/offer.di';

@Controller()
export class AppController {
  constructor(@Inject(ingestOffersUseCaseToken) private readonly ingestOffersUseCase: IIngestOffersUseCase) {}

  /**
   * @todo for demo purposes only
   * consider using nest command module to process job recurrently
   */
  @Get()
  async ingestOffers(): Promise<void> {
    await this.ingestOffersUseCase.execute();
  }
}
