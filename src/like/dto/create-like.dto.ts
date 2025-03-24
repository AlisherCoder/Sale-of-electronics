import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({ example: 'product id' })
  @IsNotEmpty()
  @IsString()
  product_id: string;
}
