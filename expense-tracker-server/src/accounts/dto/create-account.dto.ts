import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['savings', 'checking', 'credit_card', 'cash', 'investment'])
  @IsNotEmpty()
  type: 'savings' | 'checking' | 'credit_card' | 'cash' | 'investment';

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Type(() => Number)
  balance?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  includeInTotal?: boolean;
}
