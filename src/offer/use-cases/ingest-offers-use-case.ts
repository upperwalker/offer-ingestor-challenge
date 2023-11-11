import { Inject, Injectable } from '@nestjs/common';
import { ComposedOfferConverter, IOfferConverter } from '../converters/composed-offer-converter';
import { IOfferProviderClient } from '../../external-providers/offer-provider.client';
import { OfferType } from '../offer-type.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { IOffer, Offer } from '../entity/offer.entity';
import { Repository } from 'typeorm';

export interface IIngestOffersUseCase {
  execute(): Promise<void>;
}

@Injectable()
export class IngestOffersUseCase {
  constructor(
    private readonly offerProviderClients: Record<OfferType, IOfferProviderClient>,
    @Inject(ComposedOfferConverter) private readonly offerConverter: IOfferConverter,
    @InjectRepository(Offer) private readonly offerRepository: Repository<IOffer>,
  ) {}

  async execute() {
    await Promise.allSettled(
      Object.entries(this.offerProviderClients).map(async ([type, client]) => {
        const rawPayload = await client.fetchOffers();
        const convertedPayload = this.offerConverter.convert(type as OfferType, rawPayload);
        await this.offerRepository.save(convertedPayload);
      }),
    );
  }
}
