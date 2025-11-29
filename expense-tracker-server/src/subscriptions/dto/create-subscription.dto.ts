import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsEnum(['daily', 'weekly', 'monthly', 'yearly'])
  @IsNotEmpty()
  billingCycle: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  nextBillingDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  reminderDays?: number;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
