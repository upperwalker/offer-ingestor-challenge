import { FactoryProvider, Module } from '@nestjs/common';
import { DatabaseModule } from '../core/database/database.module';
import { IIngestOffersUseCase, IngestOffersUseCase } from './use-cases/ingest-offers-use-case';
import { ingestOffersUseCaseToken, offerConverterToken, offerValidatorToken } from './offer.di';
import { ComposedOfferConverter, IOfferConverter } from './converters/composed-offer-converter';
import { OfferType } from './offer-type.enum';
import { OfferOnePayloadConverter } from './converters/offer-converter-strategies/offer-one-payload.converter';
import { OfferTwoPayloadConverter } from './converters/offer-converter-strategies/offer-two-payload.converter';
import { OfferProviderOneClient } from '../external-providers/offer/offer-provider-one/offer-provider-one.client';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Offer } from './entity/offer.entity';
import { OfferProviderTwoClient } from '../external-providers/offer/offer-provider-two/offer-provider-two.client';
import { loggerFactoryToken } from '../core/logger/logger.di';
import { LoggerModule } from '../core/logger/logger.module';
import { IOfferValidator, OfferValidator } from './validators/offer-validator';

const offerConverterProvider: FactoryProvider<IOfferConverter> = {
  provide: offerConverterToken,
  useFactory: () => {
    const offerConverterStrategies = {
      [OfferType.OFFER_ONE]: new OfferOnePayloadConverter(),
      [OfferType.OFFER_TWO]: new OfferTwoPayloadConverter(),
    };
    return new ComposedOfferConverter(offerConverterStrategies);
  },
};

const offerValidatorProvider: FactoryProvider<IOfferValidator> = {
  provide: offerValidatorToken,
  inject: [loggerFactoryToken],
  useFactory: (loggerFactory) => {
    const logger = loggerFactory.create(OfferValidator.name);
    return new OfferValidator(logger);
  },
};

const ingestOffersUseCaseProvider: FactoryProvider<IIngestOffersUseCase> = {
  provide: ingestOffersUseCaseToken,
  inject: [offerConverterToken, offerValidatorToken, getRepositoryToken(Offer), loggerFactoryToken],
  useFactory: (offerConverter, offerValidator, offerRepository, loggerFactory) => {
    const logger = loggerFactory.create(IngestOffersUseCase.name);
    const offerProviderClients = {
      [OfferType.OFFER_ONE]: new OfferProviderOneClient(),
      [OfferType.OFFER_TWO]: new OfferProviderTwoClient(),
    };
    return new IngestOffersUseCase(offerProviderClients, offerConverter, offerValidator, offerRepository, logger);
  },
};

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), DatabaseModule, LoggerModule],
  providers: [offerConverterProvider, offerValidatorProvider, ingestOffersUseCaseProvider],
  exports: [ingestOffersUseCaseProvider],
})
export class OfferModule {}
