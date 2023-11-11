import { plainToInstance } from 'class-transformer';
import { CreateOfferDto, ICreateOfferDto } from '../dto/create-offer.dto';
import { validateSync } from 'class-validator';
import { ILogger } from '../../core/logger/logger.factory';

export interface IOfferValidator {
  validate(payload: ICreateOfferDto): CreateOfferDto | null;
}

export class OfferValidator {
  constructor(private readonly logger: ILogger) {}

  validate(payload: ICreateOfferDto): CreateOfferDto | null {
    const createOfferDto = plainToInstance(CreateOfferDto, payload);
    const validationErrors = validateSync(createOfferDto);

    if (!validationErrors?.length) {
      return createOfferDto;
    }

    const { providerName, externalOfferId } = createOfferDto;
    const errors = validationErrors.map((error) => Object.values(error.constraints as any)).flat();
    /**
     * @todo improve logger to support json format for providing context details
     */
    this.logger.warn(`Offer (${providerName} ${externalOfferId}) validation failed: ${errors.join(', ')}`);

    return null;
  }
}
