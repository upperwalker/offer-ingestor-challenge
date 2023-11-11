import { IsNotEmpty, IsString, MaxLength, IsInt, Min, Max, IsOptional, IsEnum } from 'class-validator';
import { IOffer, OfferTypeEnum } from '../entity/offer.entity';

export interface ICreateOfferDto extends Omit<IOffer, 'id'> {}

export class CreateOfferDto implements ICreateOfferDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  slug: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  requirements: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  thumbnail: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1)
  isDesktop: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1)
  isAndroid: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1)
  isIos: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  offerUrlTemplate: string;

  @IsOptional()
  @IsEnum(OfferTypeEnum)
  providerName?: OfferTypeEnum;

  @IsOptional()
  @IsString() // could be uuid, then consider using IsUUID()
  externalOfferId?: string;
}
