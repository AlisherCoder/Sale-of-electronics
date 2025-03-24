import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'image.png' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  image?: string[];

  @ApiProperty({ example: 'Alex' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(2)
  @IsOptional()
  first_name?: string;

  @ApiProperty({ example: 'Alexandr' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(2)
  @IsOptional()
  last_name?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  region_id?: number;
}
