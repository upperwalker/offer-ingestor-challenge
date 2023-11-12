import { IOfferProviderClient } from '../../src/external-providers/offer/offer-provider.client';

export class OfferProviderClientMock implements IOfferProviderClient {
  async fetchOffers(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
}
