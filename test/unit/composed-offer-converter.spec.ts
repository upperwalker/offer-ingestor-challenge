import { ComposedOfferConverter } from '../../src/offer/converters/composed-offer-converter';
import { OfferType } from '../../src/offer/offer-type.enum';
import { OfferConverterStrategyMock } from '../mock/offer-converter-strategy.mock';

describe('ComposedOfferConverter', () => {
  let converter: ComposedOfferConverter;
  let offerConverterStategies: Record<OfferType, OfferConverterStrategyMock>;

  beforeEach(() => {
    offerConverterStategies = {
      [OfferType.OFFER_ONE]: new OfferConverterStrategyMock(),
      [OfferType.OFFER_TWO]: new OfferConverterStrategyMock(),
    };
    converter = new ComposedOfferConverter(offerConverterStategies);
  });

  // happy path
  it.each(Object.values(OfferType))('should call the correct strategy for %s', (offerType) => {
    // prepare
    const payload = {};
    const expected = `test ${offerType} result`;
    offerConverterStategies[offerType].convert = jest.fn().mockReturnValue(expected);

    // execute
    const actual = converter.convert(offerType, payload);

    // assert
    expect(actual).toEqual(expected);
    expect(offerConverterStategies[offerType].convert).toHaveBeenCalledWith(payload);
    expect(offerConverterStategies[offerType].convert).toHaveBeenCalledTimes(1);
  });

  // sad path
  it('should throw an error if the strategy is not found', () => {
    // prepare
    const offerType = 'test offer type';
    const payload = {};

    // execute
    const actual = () => converter.convert(offerType as OfferType, payload);

    // assert
    expect(actual).toThrow(`Strategy for offer type ${offerType} not found`);
  });
});
