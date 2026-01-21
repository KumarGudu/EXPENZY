import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
// import { CategoryType } from '@prisma/client';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Color must be a valid hex code',
  })
  color?: string;

  @IsEnum(['EXPENSE', 'INCOME', 'GROUP'], {
    message: 'Type must be EXPENSE, INCOME, or GROUP',
  })
  @IsNotEmpty()
  type: string;

  @IsUUID()
  @IsOptional()
  userId?: string; // Optional because system categories might not have a user

  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;

  @IsUUID()
  @IsOptional()
  parentCategoryId?: string;
}
