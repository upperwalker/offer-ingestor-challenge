import { Offer2Payload } from '../../../external-providers/offer/offer-provider-two/response/offer2.payload';
import { ICreateOfferDto } from '../../dto/create-offer.dto';
import { OfferType } from '../../offer-type.enum';
import { IOfferConverterStrategy } from '../composed-offer-converter';

export class OfferTwoPayloadConverter implements IOfferConverterStrategy {
  convert(payload: Offer2Payload): ICreateOfferDto[] {
    const offers = payload.data;

    if (offers == null || typeof offers !== 'object') {
      return [];
    }

    return Object.values(offers).map((offer) => {
      const offerData = offer?.Offer;
      const isIos = offer?.OS?.ios ? 1 : 0;
      const isAndroid = offer?.OS?.android ? 1 : 0;
      const isDesktop = offer?.OS?.web ? 1 : 0;
      const slug = offer?.Offer?.campaign_id ? `${offer.Offer.campaign_id}-${OfferType.OFFER_TWO}` : '';

      return {
        externalOfferId: offerData?.campaign_id?.toString(),
        slug: slug,
        name: offerData?.name,
        description: offerData?.description,
        requirements: offerData?.instructions,
        offerUrlTemplate: offerData?.tracking_url,
        thumbnail: offerData?.icon,
        isDesktop: isDesktop,
        isIos: isIos,
        isAndroid: isAndroid,
      };
    });
  }
}
