import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TypeCategory } from 'src/types/types';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Samsung' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ['PHONE', 'LAPTOP', 'ELECTRONICS', 'ACCESSORIES'] })
  @IsNotEmpty()
  @IsEnum(TypeCategory)
  type: TypeCategory;
}
