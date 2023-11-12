import { IOfferConverterStrategy } from '../../src/offer/converters/composed-offer-converter';
import { ICreateOfferDto } from '../../src/offer/dto/create-offer.dto';

export class OfferConverterStrategyMock implements IOfferConverterStrategy {
  convert(payload: unknown): ICreateOfferDto[] {
    throw new Error('Method not implemented.');
  }
}
