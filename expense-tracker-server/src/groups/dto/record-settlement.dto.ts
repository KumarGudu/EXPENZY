import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class RecordSettlementDto {
  @IsString()
  fromMemberId: string;

  @IsString()
  toMemberId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string = 'INR';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  settledAt?: string;
}
