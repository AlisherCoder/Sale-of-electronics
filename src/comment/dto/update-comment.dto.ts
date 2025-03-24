import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class UpdateCommentDto {
  @ApiProperty({ example: 'Good phone' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  text?: string;

  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Max(5)
  stars?: number;
}
