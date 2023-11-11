import { IOfferProviderClient } from '../offer-provider.client';
import { Offer1Payload, offer1Payload } from './response/offer1.payload';

export class OfferProviderOneClient implements IOfferProviderClient {
  async fetchOffers(): Promise<Offer1Payload> {
    return Promise.resolve(offer1Payload);
  }
}
