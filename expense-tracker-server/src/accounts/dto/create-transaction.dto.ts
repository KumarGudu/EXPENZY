import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsEnum(['debit', 'credit', 'transfer'])
  @IsNotEmpty()
  type: 'debit' | 'credit' | 'transfer';

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  relatedType?: string;

  @IsString()
  @IsOptional()
  relatedId?: string;
}
