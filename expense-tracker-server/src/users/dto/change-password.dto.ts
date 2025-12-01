import {
  IsString,
  IsNotEmpty,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsNotSameAsOld', async: false })
class IsNotSameAsOldConstraint implements ValidatorConstraintInterface {
  validate(newPassword: string, args: ValidationArguments): boolean {
    const object = args.object as ChangePasswordDto;
    return newPassword !== object.currentPassword;
  }

  defaultMessage(): string {
    return 'New password must be different from current password';
  }
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Current password must be at least 6 characters' })
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  @Validate(IsNotSameAsOldConstraint)
  newPassword: string;
}
