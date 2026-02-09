import {
  IsOptional,
  IsEmail,
  IsUUID,
  ValidateIf,
  IsNotEmpty,
  IsEnum,
  IsString,
} from 'class-validator';

export class AddGroupMemberDto {
  // Either userId OR memberEmail OR memberName required
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ValidateIf((o: AddGroupMemberDto) => !o.userId && !o.memberName)
  @IsNotEmpty({
    message: 'Member email is required when neither userId nor memberName is provided',
  })
  @IsEmail()
  memberEmail?: string;

  @IsOptional()
  @IsEnum(['admin', 'member'])
  role?: 'admin' | 'member';

  @IsOptional()
  @IsString()
  memberName?: string;
}
