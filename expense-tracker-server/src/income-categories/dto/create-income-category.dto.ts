import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateIncomeCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;
}
