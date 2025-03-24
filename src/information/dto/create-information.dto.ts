import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SM } from 'src/types/types';

export class CreateInformationDto {
  @ApiProperty({ example: 'About company' })
  @IsNotEmpty()
  @IsString()
  about: string;

  @ApiProperty({ example: 'privacy policy company' })
  @IsNotEmpty()
  @IsString()
  privacy_policy: string;

  @ApiProperty({ example: 'alishersharipov670@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+998953901313' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  @MinLength(13)
  phone: string;

  @ApiProperty({ example: 13000 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  usd: number;

  @ApiProperty({
    example: [
      { name: 'Instagram', link: 'instgram.com' },
      { name: 'Telegram', link: 'telegram.com' },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsObject({ each: true })
  social_media: SM[];
}
