import { CreateOfferDto, ICreateOfferDto } from '../../src/offer/dto/create-offer.dto';
import { IOfferValidator } from '../../src/offer/validators/offer-validator';

export class OfferValidatorMock implements IOfferValidator {
  validate(payload: ICreateOfferDto): CreateOfferDto | null {
    throw new Error('Method not implemented.');
  }
}
