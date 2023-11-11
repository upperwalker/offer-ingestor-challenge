import { Offer1Payload, offer1Payload } from './response/offer1.payload';

export class OfferProviderOneClient {
  async fetchOffers(): Promise<Offer1Payload> {
    return Promise.resolve(offer1Payload);
  }
}
