import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  image?: string[];

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  first_name?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  last_name?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  region_id?: number;
}
