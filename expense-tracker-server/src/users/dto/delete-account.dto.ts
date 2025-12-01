import {
  IsString,
  IsNotEmpty,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsDeleteConfirmation', async: false })
class IsDeleteConfirmationConstraint implements ValidatorConstraintInterface {
  validate(confirmation: string): boolean {
    return confirmation.toLowerCase() === 'delete my account';
  }

  defaultMessage(): string {
    return 'You must type "delete my account" to confirm';
  }
}

export class DeleteAccountDto {
  @IsNotEmpty()
  @IsString()
  @Validate(IsDeleteConfirmationConstraint)
  confirmation: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password is required for verification' })
  password: string;
}
