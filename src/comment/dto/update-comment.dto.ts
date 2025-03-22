import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  @IsString()
  text?: string;

  @IsNotEmpty()
  @IsNumber()
  stars?: number;
}
