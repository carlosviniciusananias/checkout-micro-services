import {
    ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsPositive,
  ValidateNested,
  arrayNotEmpty,
  isNotEmpty,
} from 'class-validator';

export class CheckoutItemDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  product_id: number;
}

export class CreateCheckoutDto {
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  items: CheckoutItemDto[];
}
