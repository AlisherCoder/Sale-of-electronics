import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 'product id' })
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  count: number;

  @ApiProperty({ example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  summa: number;
}
