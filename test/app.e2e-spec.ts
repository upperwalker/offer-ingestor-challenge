import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IOffer, Offer } from '../src/offer/entity/offer.entity';
import { Repository } from 'typeorm';
import { ingestOffersUseCaseToken, offerConverterToken, offerValidatorToken } from '../src/offer/offer.di';
import { loggerFactoryToken } from '../src/core/logger/logger.di';
import { OfferType } from '../src/offer/offer-type.enum';
import { IngestOffersUseCase } from '../src/offer/use-cases/ingest-offers-use-case';
import { OfferProviderClientMock } from './mock/offer-provider-client.mock';
import { IOfferProviderClient } from '../src/external-providers/offer/offer-provider.client';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let offersRepository: Repository<IOffer>;
  let offerProviderClientMock: OfferProviderClientMock;

  beforeAll(async () => {
    /**
     * @todo use test database configuration
     */
    offerProviderClientMock = new OfferProviderClientMock();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ingestOffersUseCaseToken)
      .useFactory({
        inject: [offerConverterToken, offerValidatorToken, getRepositoryToken(Offer), loggerFactoryToken],
        factory: (offerConverter, offerValidator, offerRepository, loggerFactory) => {
          const logger = loggerFactory.create(IngestOffersUseCase.name);
          return new IngestOffersUseCase(
            {
              [OfferType.OFFER_ONE]: offerProviderClientMock,
            } as Record<OfferType, IOfferProviderClient>,
            offerConverter,
            offerValidator,
            offerRepository,
            logger,
          );
        },
      })
      .compile();
    app = moduleFixture.createNestApplication();
    offersRepository = moduleFixture.get(getRepositoryToken(Offer));
    await app.init();
  });

  afterEach(async () => {
    await offersRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/ingest-offers', () => {
    it('should return status code 200', async () => {
      request(app.getHttpServer()).post('/ingest-offers').expect(200);
    });

    it('should ingest offers to the storage', async () => {
      const offers = await offersRepository.find();
      expect(offers.length).toEqual(0);

      const mockResponse = {
        response: {
          offers: [
            {
              offer_id: 'test offer_id',
              offer_name: 'test offer_name',
              offer_desc: 'test offer_desc',
              call_to_action: 'test call_to_action',
              offer_url: 'test offer_url',
              image_url: 'test image_url',
              platform: 'android',
              device: 'test',
            },
          ],
        },
      };

      offerProviderClientMock.fetchOffers = jest.fn().mockResolvedValue(mockResponse);

      await request(app.getHttpServer()).post('/ingest-offers');

      const offersAfterIngestion = await offersRepository.find();
      expect(offersAfterIngestion.length).toEqual(1);
      expect(offersAfterIngestion[0]).toEqual({
        id: expect.anything(), // depends om database implementation
        providerName: OfferType.OFFER_ONE,
        externalOfferId: 'test offer_id',
        slug: 'test offer_id-offer1',
        name: 'test offer_name',
        description: 'test offer_desc',
        requirements: 'test call_to_action',
        offerUrlTemplate: 'test offer_url',
        thumbnail: 'test image_url',
        isDesktop: 0,
        isIos: 0,
        isAndroid: 1,
      });
    });
  });
});
