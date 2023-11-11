import { FactoryProvider, Module } from '@nestjs/common';
import { DatabaseModule } from '../core/database/database.module';
import { IIngestOffersUseCase, IngestOffersUseCase } from './use-cases/ingest-offers-use-case';
import { ingestOffersUseCaseToken, offerConverterToken } from './offer.di';
import { ComposedOfferConverter, IOfferConverter } from './converters/composed-offer-converter';
import { OfferType } from './offer-type.enum';
import { OfferOnePayloadConverter } from './converters/offer-converter-strategies/offer-one-payload.converter';
import { OfferTwoPayloadConverter } from './converters/offer-converter-strategies/offer-two-payload.converter';
import { OfferProviderOneClient } from '../external-providers/offer/offer-provider-one/offer-provider-one.client';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Offer } from './entity/offer.entity';
import { OfferProviderTwoClient } from '../external-providers/offer/offer-provider-two/offer-provider-two.client';

const offerConverterProvider: FactoryProvider<IOfferConverter> = {
  provide: offerConverterToken,
  useFactory: () => {
    const offerConverterStategies = {
      [OfferType.OFFER_ONE]: new OfferOnePayloadConverter(),
      [OfferType.OFFER_TWO]: new OfferTwoPayloadConverter(),
    };
    return new ComposedOfferConverter(offerConverterStategies);
  },
};

const ingestOffersUseCaseProvider: FactoryProvider<IIngestOffersUseCase> = {
  provide: ingestOffersUseCaseToken,
  inject: [offerConverterToken, getRepositoryToken(Offer)],
  useFactory: (offerConverter, offerRepository) => {
    const offerProviderClients = {
      [OfferType.OFFER_ONE]: new OfferProviderOneClient(),
      [OfferType.OFFER_TWO]: new OfferProviderTwoClient(),
    };
    return new IngestOffersUseCase(offerProviderClients, offerConverter, offerRepository);
  },
};

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), DatabaseModule],
  providers: [offerConverterProvider, ingestOffersUseCaseProvider],
  exports: [ingestOffersUseCaseProvider],
})
export class OfferModule {}
