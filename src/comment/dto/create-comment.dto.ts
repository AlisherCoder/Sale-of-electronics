import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, Max } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Good phone' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Max(5)
  stars: number;

  @ApiProperty({ example: 'product id' })
  @IsNotEmpty()
  @IsString()
  product_id: string;
}
