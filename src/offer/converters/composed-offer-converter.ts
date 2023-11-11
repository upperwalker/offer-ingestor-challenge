import { IOffer } from '../entity/offer.entity';
import { OfferType } from '../offer-type.enum';

export interface IOfferConverter {
  convert(type: OfferType, payload: unknown): IOffer[];
}

export interface IOfferConverterStrategy {
  (payload: unknown): IOffer[];
}

export class ComposedOfferConverter implements IOfferConverter {
  constructor(private offerConverterStategies: Record<OfferType, IOfferConverterStrategy>) {}

  public convert(type: OfferType, payload: unknown): IOffer[] {
    const strategy = this.offerConverterStategies[type];
    if (!strategy) {
      throw new Error(`Strategy for offer type ${type} not found`);
    }

    return strategy(payload);
  }
}
