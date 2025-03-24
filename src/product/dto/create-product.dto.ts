import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Condition, Currency, TradeType } from 'src/types/types';

export class CreateProductDto {
  @ApiProperty({ example: ['image1.png', 'image2.png'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  image: string[];

  @ApiProperty({ example: 'Samsung s25 Ultra' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 200 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: ['color-1 id', 'color-2 id'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  colors: string[];

  @ApiProperty({ enum: ['USD', 'SUM'] })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  ceiling?: number;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  count: number;

  @ApiProperty({ example: 'Samsung s25 sotaman holati yaxshi' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  @MinLength(2)
  description: string;

  @ApiProperty({ example: 'Chilonzor 19' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  @MinLength(2)
  location: string;

  @ApiProperty({ enum: ['NEW', 'USED'] })
  @IsNotEmpty()
  @IsEnum(Condition)
  condition: Condition;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  bargain: boolean;

  @ApiProperty({ enum: ['PAID', 'FREE', 'BARTER'] })
  @IsNotEmpty()
  @IsEnum(TradeType)
  @IsOptional()
  trade_type?: TradeType;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  category_id: number;
}

export class ActiveProductDto {
  @ApiProperty({ example: 'product id' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(256)
  @MinLength(2)
  product_id: string;
}
