import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsUUID,
  IsNumber,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoanDto {
  // Lender - either userId OR name/email required
  @IsOptional()
  @IsUUID()
  lenderUserId?: string;

  @ValidateIf((o: CreateLoanDto) => !o.lenderUserId)
  @IsNotEmpty({
    message: 'Lender name is required when lenderUserId is not provided',
  })
  @IsString()
  lenderName?: string;

  @IsOptional()
  @IsEmail()
  lenderEmail?: string;

  @IsOptional()
  @IsString()
  lenderPhone?: string;

  // Borrower - either userId OR name/email required
  @IsOptional()
  @IsUUID()
  borrowerUserId?: string;

  @ValidateIf((o: CreateLoanDto) => !o.borrowerUserId)
  @IsNotEmpty({
    message: 'Borrower name is required when borrowerUserId is not provided',
  })
  @IsString()
  borrowerName?: string;

  @IsOptional()
  @IsEmail()
  borrowerEmail?: string;

  @IsOptional()
  @IsString()
  borrowerPhone?: string;

  // Loan details
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  interestRate?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  loanDate: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  paymentTerms?: string;
}
