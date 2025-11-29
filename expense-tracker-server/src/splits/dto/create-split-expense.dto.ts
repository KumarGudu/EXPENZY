import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsUUID,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SplitParticipantDto {
  // Either userId OR name/email required
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ValidateIf((o: SplitParticipantDto) => !o.userId)
  @IsNotEmpty({
    message: 'Participant name is required when userId is not provided',
  })
  @IsString()
  participantName?: string;

  @IsOptional()
  @IsEmail()
  participantEmail?: string;

  @IsOptional()
  @IsString()
  participantPhone?: string;

  // Split amount (for 'exact' type)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amountOwed?: number;

  // Percentage (for 'percentage' type)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  percentage?: number;

  // Shares (for 'shares' type)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  shares?: number;
}

export class CreateSplitExpenseDto {
  @IsOptional()
  @IsUUID()
  expenseId?: string;

  @IsOptional()
  @IsUUID()
  groupId?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  totalAmount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNotEmpty()
  @IsEnum(['equal', 'percentage', 'exact', 'shares'])
  splitType: 'equal' | 'percentage' | 'exact' | 'shares';

  // Payer - either userId OR name/email
  @IsOptional()
  @IsUUID()
  paidByUserId?: string;

  @ValidateIf((o: CreateSplitExpenseDto) => !o.paidByUserId)
  @IsString()
  paidByName?: string;

  @IsOptional()
  @IsEmail()
  paidByEmail?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SplitParticipantDto)
  participants: SplitParticipantDto[];
}
