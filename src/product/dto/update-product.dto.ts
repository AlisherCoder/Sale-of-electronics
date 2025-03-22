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

export class UpdateProductDto {
  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  image?: string[];

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNotEmpty()
  @IsArray()
  colors?: string[];

  @IsNotEmpty()
  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @IsNotEmpty()
  @IsPositive()
  @IsOptional()
  @IsOptional()
  ceiling?: number;

  @IsNotEmpty()
  @IsPositive()
  @IsOptional()
  count?: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  location?: string;

  @IsNotEmpty()
  @IsEnum(Condition)
  @IsOptional()
  condition?: Condition;

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  bargain?: boolean;

  @IsNotEmpty()
  @IsEnum(TradeType)
  @IsOptional()
  trade_type?: TradeType;

  @IsNotEmpty()
  @IsPositive()
  @IsOptional()
  category_id?: number;
}
