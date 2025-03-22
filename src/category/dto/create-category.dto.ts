import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TypeCategory } from 'src/types/types';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(TypeCategory)
  type: TypeCategory;
}
