import { IOfferConverter } from '../../src/offer/converters/composed-offer-converter';
import { ICreateOfferDto } from '../../src/offer/dto/create-offer.dto';

export class OfferConverterMock implements IOfferConverter {
  convert(type: string, payload: unknown): ICreateOfferDto[] {
    throw new Error('Method not implemented.');
  }
}
