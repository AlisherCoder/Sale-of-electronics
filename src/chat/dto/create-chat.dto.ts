import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ example: 'Hello, how are you?' })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({ example: 'product id' })
  @IsNotEmpty()
  @IsString()
  product_id: string;
}
