import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class DeleteAccountDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password is required for verification' })
  password: string;
}
