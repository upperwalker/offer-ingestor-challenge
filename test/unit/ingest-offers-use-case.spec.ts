import { Repository } from 'typeorm';
import { IOfferProviderClient } from '../../src/external-providers/offer/offer-provider.client';
import { OfferType } from '../../src/offer/offer-type.enum';
import { IngestOffersUseCase } from '../../src/offer/use-cases/ingest-offers-use-case';
import { LoggerMock } from '../mock/logger.mock';
import { OfferConverterMock } from '../mock/offer-converter.mock';
import { OfferProviderClientMock } from '../mock/offer-provider-client.mock';
import { OfferValidatorMock } from '../mock/offer-validator.mock';
import { IOffer } from '../../src/offer/entity/offer.entity';

describe('IngestOffersUseCase', () => {
  let useCase: IngestOffersUseCase;

  let converter: OfferConverterMock;
  let validator: OfferValidatorMock;
  let offerProviderClients: Record<OfferType, IOfferProviderClient>;
  let logger: LoggerMock;
  let repository: Repository<IOffer>;

  beforeEach(() => {
    converter = new OfferConverterMock();
    validator = new OfferValidatorMock();
    offerProviderClients = {
      'test client': new OfferProviderClientMock(),
    } as unknown as Record<OfferType, IOfferProviderClient>;
    logger = new LoggerMock();
    repository = {
      upsert: jest.fn(),
    } as unknown as Repository<IOffer>;
    useCase = new IngestOffersUseCase(offerProviderClients, converter, validator, repository, logger);
  });

  it('should ingest offers', async () => {
    // prepare
    const testClient = 'test client' as OfferType;
    const testOffer = 'test offer';
    const testOfferConverted = 'test offer converted';
    const testOfferValidated = 'test offer validated';
    offerProviderClients[testClient].fetchOffers = jest.fn().mockResolvedValue([testOffer]);
    converter.convert = jest.fn().mockReturnValue([testOfferConverted]);
    validator.validate = jest.fn().mockReturnValueOnce(testOfferValidated);
    repository.upsert = jest.fn().mockResolvedValue(undefined);
    logger.log = jest.fn().mockResolvedValue(undefined);

    // execute
    await useCase.execute();

    // assert
    expect(offerProviderClients[testClient].fetchOffers).toHaveBeenCalledTimes(1);
    expect(converter.convert).toHaveBeenCalledWith(testClient, [testOffer]);
    expect(converter.convert).toHaveBeenCalledTimes(1);
    expect(validator.validate).toHaveBeenCalledWith(testOfferConverted);
    expect(validator.validate).toHaveBeenCalledTimes(1);
    expect(repository.upsert).toHaveBeenCalledWith([testOfferValidated], ['slug']);
    expect(repository.upsert).toHaveBeenCalledTimes(1);
  });

  it('should gracefully handle rejected ingestion actions', async () => {
    // prepare
    const clientError = new Error('test error');
    const testClient = 'test client' as OfferType;
    const testOfferConverted = 'test offer converted';
    const testOfferValidated = 'test offer validated';
    offerProviderClients[testClient].fetchOffers = jest.fn().mockRejectedValue(clientError);
    converter.convert = jest.fn().mockReturnValue([testOfferConverted]);
    validator.validate = jest.fn().mockReturnValueOnce(testOfferValidated);
    repository.upsert = jest.fn().mockResolvedValue(undefined);
    logger.log = jest.fn().mockResolvedValue(undefined);
    logger.warn = jest.fn().mockResolvedValue(undefined);

    // execute
    await useCase.execute();

    // assert
    expect(logger.warn).toHaveBeenCalledWith(
      `Some ingestion actions were rejected with errors: ${clientError.message}`,
    );
    expect(logger.warn).toHaveBeenCalledTimes(1);
  });
});
