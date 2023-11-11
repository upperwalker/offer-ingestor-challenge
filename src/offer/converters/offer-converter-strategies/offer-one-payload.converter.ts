import { Offer1Payload } from '../../../external-providers/offer/offer-provider-one/response/offer1.payload';
import { ICreateOfferDto } from '../../dto/create-offer.dto';
import { OfferType } from '../../offer-type.enum';
import { IOfferConverterStrategy } from '../composed-offer-converter';

export class OfferOnePayloadConverter implements IOfferConverterStrategy {
  convert(payload: Offer1Payload): ICreateOfferDto[] {
    const offers = payload.response?.offers;

    if (offers == null || !Array.isArray(offers)) {
      return [];
    }

    return offers.map((offer) => {
      const isIos = offer?.device != null && offer.device === 'iphone_ipad' ? 1 : 0;
      const isAndroid = offer?.device != null && !isIos ? 1 : 0;
      const isDesktop = offer?.platform === 'desktop' ? 1 : 0;
      const slug = offer?.offer_id ? `${offer.offer_id}-${OfferType.OFFER_ONE}` : '';

      return {
        providerName: OfferType.OFFER_ONE,
        externalOfferId: offer?.offer_id,
        slug: slug,
        name: offer?.offer_name,
        description: offer?.offer_desc,
        requirements: offer?.call_to_action,
        offerUrlTemplate: offer?.offer_url,
        thumbnail: offer?.image_url,
        isDesktop: isDesktop,
        isIos: isIos,
        isAndroid: isAndroid,
      };
    });
  }
}
