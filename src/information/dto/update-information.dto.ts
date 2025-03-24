import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SM } from 'src/types/types';

export class UpdateInformationDto {
  @ApiProperty({ example: 'About company' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({ example: 'privacy policy company' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  privacy_policy?: string;

  @ApiProperty({ example: 'alishersharipov670@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+998953901313' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  @MinLength(13)
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 13000 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  usd?: number;

  @ApiProperty({
    example: [
      { name: 'Instagram', link: 'instgram.com' },
      { name: 'Telegram', link: 'telegram.com' },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsObject({ each: true })
  @IsOptional()
  social_media?: SM[];
}
