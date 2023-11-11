import { Offer2Payload, offer2Payload } from './response/offer2.payload';

export class OfferProviderTwoClient {
  async fetchOffers(): Promise<Offer2Payload> {
    return Promise.resolve(offer2Payload);
  }
}
