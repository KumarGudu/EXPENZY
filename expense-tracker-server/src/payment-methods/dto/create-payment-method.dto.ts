import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum([
    'cash',
    'credit_card',
    'debit_card',
    'bank_transfer',
    'upi',
    'wallet',
  ])
  @IsNotEmpty()
  type:
    | 'cash'
    | 'credit_card'
    | 'debit_card'
    | 'bank_transfer'
    | 'upi'
    | 'wallet';

  @IsString()
  @IsOptional()
  lastFourDigits?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
