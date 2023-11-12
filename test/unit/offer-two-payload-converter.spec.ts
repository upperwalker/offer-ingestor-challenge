import { Offer2Payload } from '../../src/external-providers/offer/offer-provider-two/response/offer2.payload';
import { OfferTwoPayloadConverter } from '../../src/offer/converters/offer-converter-strategies/offer-two-payload.converter';
import { OfferType } from '../../src/offer/offer-type.enum';

const createTestResponse = () => ({
  '15828': {
    Offer: {
      campaign_id: 15828,
      store_id: null,
      tracking_type: 'CPA',
      campaign_vertical: 'test',
      currency_name_singular: 'test',
      currency_name_plural: 'test',
      network_epc: '1',
      icon: 'test',
      name: 'test',
      tracking_url: 'https://some.url',
      instructions: 'test',
      description: 'test',
      short_description: 'test',
      offer_sticker_text_1: 'test',
      offer_sticker_color_1: 'test',
      offer_sticker_color_2: 'test',
      offer_sticker_color_3: 'test',
      category_1: 'test',
      amount: 53550,
      payout_usd: 69.25,
      start_datetime: '2022-04-19 11:58:30',
      end_datetime: '2042-04-19 04:59:00',
      is_multi_reward: false,
    },
    Country: {
      include: {
        US: {
          id: 243,
          code: 'US',
          name: 'tUnited States',
        },
      },
      exclude: [],
    },
    State: {
      include: [],
      exclude: [],
    },
    City: {
      include: [],
      exclude: [],
    },
    Connection_Type: {
      cellular: true,
      wifi: true,
    },
    Device: {
      include: [],
      exclude: [],
    },
    OS: {
      android: false,
      ios: true,
      web: true,
    },
  },
});

describe('OfferTwoPayloadConverter', () => {
  let converter: OfferTwoPayloadConverter;

  beforeEach(() => {
    converter = new OfferTwoPayloadConverter();
  });

  it('should return empty array if payload is null', () => {
    const payload = null as unknown as Offer2Payload;

    const result = converter.convert(payload);

    expect(result).toEqual([]);
  });

  it('should return empty array if payload data is not an object', () => {
    const payload = {
      data: null,
    } as unknown as Offer2Payload;

    const result = converter.convert(payload);

    expect(result).toEqual([]);
  });

  it('should return array with emtpy slug if campaign_id is not present', () => {
    const payload = {
      data: {
        '15828': {
          Offer: {
            campaign_id: null,
          },
        },
      },
    } as unknown as Offer2Payload;

    const result = converter.convert(payload);

    expect(result[0].slug).toEqual('');
  });

  it('should return array with slug containing campaign_id and offer type', () => {
    const payload = {
      data: {
        '15828': {
          Offer: {
            campaign_id: 15828,
          },
        },
      },
    } as unknown as Offer2Payload;

    const result = converter.convert(payload);

    expect(result[0].slug).toEqual('15828-offer2');
  });

  it('should return array of offers', () => {
    const payload = {
      data: createTestResponse(),
    } as unknown as Offer2Payload;

    const result = converter.convert(payload);

    expect(result).toEqual([
      {
        providerName: OfferType.OFFER_TWO,
        externalOfferId: '15828',
        slug: '15828-offer2',
        name: 'test',
        description: 'test',
        requirements: 'test',
        offerUrlTemplate: 'https://some.url',
        thumbnail: 'test',
        isDesktop: 1,
        isIos: 1,
        isAndroid: 0,
      },
    ]);
  });
});
