import { IOfferConverter } from '../converters/composed-offer-converter';
import { IOfferProviderClient } from '../../external-providers/offer/offer-provider.client';
import { OfferType } from '../offer-type.enum';
import { IOffer } from '../entity/offer.entity';
import { Repository } from 'typeorm';
import { ILogger } from '../../core/logger/logger.factory';
import { IOfferValidator } from '../validators/offer-validator';

export interface IIngestOffersUseCase {
  execute(): Promise<void>;
}

export class IngestOffersUseCase implements IIngestOffersUseCase {
  constructor(
    private readonly offerProviderClients: Record<OfferType, IOfferProviderClient>,
    private readonly offerConverter: IOfferConverter,
    private readonly offerValidator: IOfferValidator,
    private readonly offerRepository: Repository<IOffer>,
    private readonly logger: ILogger,
  ) {}

  async execute() {
    this.logger.log('About to ingest offers');
    await Promise.allSettled(
      Object.entries(this.offerProviderClients).map(async ([type, client]) => {
        const rawPayload = await client.fetchOffers();
        const convertedPayload = this.offerConverter.convert(type as OfferType, rawPayload);
        const validatedPayload = convertedPayload.filter((payload) => this.offerValidator.validate(payload));
        await this.offerRepository.upsert(validatedPayload, ['slug']);
      }),
    );
    this.logger.log('Offers ingestion completed');
  }
}
