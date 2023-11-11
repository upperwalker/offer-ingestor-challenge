import { IOfferProviderClient } from '../offer-provider.client';
import { Offer2Payload, offer2Payload } from './response/offer2.payload';

export class OfferProviderTwoClient implements IOfferProviderClient {
  async fetchOffers(): Promise<Offer2Payload> {
    return Promise.resolve(offer2Payload);
  }
}
