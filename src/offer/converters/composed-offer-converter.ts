import { ICreateOfferDto } from '../dto/create-offer.dto';
import { OfferType } from '../offer-type.enum';

export interface IOfferConverter {
  convert(type: OfferType, payload: unknown): ICreateOfferDto[];
}

export interface IOfferConverterStrategy {
  convert(payload: unknown): ICreateOfferDto[];
}

export class ComposedOfferConverter implements IOfferConverter {
  constructor(private offerConverterStategies: Record<OfferType, IOfferConverterStrategy>) {}

  public convert(type: OfferType, payload: unknown): ICreateOfferDto[] {
    const strategy = this.offerConverterStategies[type];
    if (!strategy) {
      throw new Error(`Strategy for offer type ${type} not found`);
    }

    return strategy.convert(payload);
  }
}
