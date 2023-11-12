import { Offer1Payload } from '../../src/external-providers/offer/offer-provider-one/response/offer1.payload';
import { OfferOnePayloadConverter } from '../../src/offer/converters/offer-converter-strategies/offer-one-payload.converter';
import { OfferType } from '../../src/offer/offer-type.enum';

const createTestResponse = () => ({
  offer_id: 'test offer_id',
  offer_name: 'test offer_name',
  offer_desc: 'test offer_desc',
  call_to_action: 'test call_to_action',
  offer_url: 'test offer_url',
  image_url: 'test image_url',
  platform: 'test',
  device: 'test',
});

describe('OfferOnePayloadConverter', () => {
  let converter: OfferOnePayloadConverter;

  beforeEach(() => {
    converter = new OfferOnePayloadConverter();
  });

  it('should return empty array if response is empty', () => {
    const payload = {
      response: {
        offers: null,
      },
    } as unknown as Offer1Payload;

    const result = converter.convert(payload);

    expect(result).toEqual([]);
  });

  it('should return empty array if response is not an array', () => {
    const payload = {
      response: {
        offers: {},
      },
    } as Offer1Payload;

    const result = converter.convert(payload);

    expect(result).toEqual([]);
  });

  it('should return array of offers with empty slug if offer_id is not present', () => {
    const offer = createTestResponse();
    offer.offer_id = null as unknown as string;

    const payload = {
      response: {
        offers: [offer],
      },
    } as Offer1Payload;

    const result = converter.convert(payload);

    expect(result[0].slug).toEqual('');
  });

  it('should return array of offers with slug consisting of offer type and external offer id', () => {
    const payload = {
      response: {
        offers: [createTestResponse()],
      },
    } as Offer1Payload;

    const result = converter.convert(payload);

    expect(result[0].slug).toEqual('test offer_id-offer1');
  });

  it('should return array of offers with isDesktop = 0 if platform is not desktop', () => {
    const offer = createTestResponse();
    offer.platform = 'mobile';
    const payload = {
      response: {
        offers: [offer],
      },
    } as Offer1Payload;

    const result = converter.convert(payload);

    expect(result[0].isDesktop).toEqual(0);
  });

  it('should return array of offers with isIos = 0 if device is not iphone_ipad', () => {
    const offer = createTestResponse();
    offer.device = 'android';
    const payload = {
      response: {
        offers: [offer],
      },
    } as Offer1Payload;

    const result = converter.convert(payload);
    expect(result[0].isIos).toEqual(0);
  });

  it('should return array of offers with isAndroid = 0 if device is iphone_ipad', () => {
    const offer = createTestResponse();
    offer.device = 'iphone_ipad';
    const payload = {
      response: {
        offers: [offer],
      },
    } as Offer1Payload;

    const result = converter.convert(payload);

    expect(result[0].isAndroid).toEqual(0);
  });

  it('should return array of offers', () => {
    const payload = {
      response: {
        offers: [createTestResponse()],
      },
    } as Offer1Payload;

    const result = converter.convert(payload);

    expect(result).toEqual([
      {
        providerName: OfferType.OFFER_ONE,
        externalOfferId: 'test offer_id',
        slug: 'test offer_id-offer1',
        name: 'test offer_name',
        description: 'test offer_desc',
        requirements: 'test call_to_action',
        offerUrlTemplate: 'test offer_url',
        thumbnail: 'test image_url',
        isDesktop: 0,
        isIos: 0,
        isAndroid: 1,
      },
    ]);
  });
});
