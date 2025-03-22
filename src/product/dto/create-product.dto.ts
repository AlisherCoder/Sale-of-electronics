import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Condition, Currency, TradeType } from 'src/types/types';

export class CreateProductDto {
  @IsNotEmpty()
  @IsArray()
  image: string[];

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsArray()
  colors: string[];

  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @IsNotEmpty()
  @IsPositive()
  @IsOptional()
  ceiling?: number;

  @IsNotEmpty()
  @IsPositive()
  count: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsEnum(Condition)
  condition: Condition;

  @IsNotEmpty()
  @IsBoolean()
  bargain: boolean;

  @IsNotEmpty()
  @IsEnum(TradeType)
  @IsOptional()
  trade_type?: TradeType;

  @IsNotEmpty()
  @IsPositive()
  category_id: number;
}

export class ActiveProductDto {
  @IsNotEmpty()
  @IsString()
  product_id: string;
}
