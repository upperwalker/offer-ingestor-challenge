import { IOfferConverter } from '../converters/composed-offer-converter';
import { IOfferProviderClient } from '../../external-providers/offer/offer-provider.client';
import { OfferType } from '../offer-type.enum';
import { IOffer } from '../entity/offer.entity';
import { Repository } from 'typeorm';
import { IContextedLogger } from '../../core/logger/logger.service';

export interface IIngestOffersUseCase {
  execute(): Promise<void>;
}

export class IngestOffersUseCase {
  constructor(
    private readonly offerProviderClients: Record<OfferType, IOfferProviderClient>,
    private readonly offerConverter: IOfferConverter,
    private readonly offerRepository: Repository<IOffer>,
    private readonly logger: IContextedLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async execute() {
    this.logger.info('About to ingest offers');
    await Promise.allSettled(
      Object.entries(this.offerProviderClients).map(async ([type, client]) => {
        const rawPayload = await client.fetchOffers();
        const convertedPayload = this.offerConverter.convert(type as OfferType, rawPayload);
        await this.offerRepository.upsert(convertedPayload, ['slug']);
      }),
    );
    this.logger.info('Offers ingestion completed');
  }
}
