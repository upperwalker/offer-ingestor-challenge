import { IOfferConverter } from '../converters/composed-offer-converter';
import { IOfferProviderClient } from '../../external-providers/offer/offer-provider.client';
import { OfferType } from '../offer-type.enum';
import { IOffer } from '../entity/offer.entity';
import { Repository } from 'typeorm';
import { ILogger } from '../../core/logger/logger.factory';
import { IOfferValidator } from '../validators/offer-validator';
import { objectEntries } from '../../utils/object';
import { CreateOfferDto } from '../dto/create-offer.dto';

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
      objectEntries(this.offerProviderClients).map(async ([type, client]) => {
        const rawPayload = await client.fetchOffers();
        const convertedPayload = this.offerConverter.convert(type, rawPayload);
        const validatedPayload = convertedPayload
          .map((payload) => this.offerValidator.validate(payload))
          .filter((validated): validated is CreateOfferDto => validated != null);

        await this.offerRepository.upsert(validatedPayload, ['slug']);
      }),
    )
      .then((results) => {
        const rejected = results.filter((result): result is PromiseRejectedResult => result.status === 'rejected');
        if (rejected.length > 0) {
          const errors = rejected.map(({ reason }) => reason?.message ?? 'unknown reason');
          this.logger.warn(`Some ingestion actions were rejected with errors: ${errors}`);
        }
      })
      .finally(() => {
        this.logger.log('Offers ingestion completed');
      });
  }
}
