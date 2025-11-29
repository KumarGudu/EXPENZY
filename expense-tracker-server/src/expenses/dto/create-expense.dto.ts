import {
  IsArray,
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateExpenseDto {
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsDecimal()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  expenseDate: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsDecimal()
  @IsOptional()
  locationLat?: number;

  @IsDecimal()
  @IsOptional()
  locationLng?: number;

  @IsString()
  @IsOptional()
  locationName?: string;
}
