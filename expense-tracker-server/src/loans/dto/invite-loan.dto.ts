import { IsNotEmpty, IsEmail, IsOptional, IsString } from 'class-validator';

export class InviteLoanDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsString()
  role: 'lender' | 'borrower';

  @IsOptional()
  @IsString()
  message?: string;
}
