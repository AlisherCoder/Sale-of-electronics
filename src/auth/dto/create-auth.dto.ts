import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: ['image.png'] })
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
  first_name: string;

  @ApiProperty({ example: 'Alexandr' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @MinLength(2)
  last_name: string;

  @ApiProperty({ example: '+998953901313' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  @MinLength(13)
  phone: string;

  @ApiProperty({ example: 'alishersharipov670@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  region_id: number;
}

export class LoginDto {
  @ApiProperty({ example: 'alishersharipov670@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  location?: string
}

export class ActivateDto {
  @ApiProperty({ example: 'alishersharipov670@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12324' })
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class SendOtpDto {
  @ApiProperty({ example: 'alishersharipov670@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh token' })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'alishersharipov670@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({ example: '54321' })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  new_password: string;
}
