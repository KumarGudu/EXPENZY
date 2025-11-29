import {
  IsOptional,
  IsString,
  IsEmail,
  IsUUID,
  ValidateIf,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';

export class AddGroupMemberDto {
  // Either userId OR name/email required
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ValidateIf((o: AddGroupMemberDto) => !o.userId)
  @IsNotEmpty({
    message: 'Member name is required when userId is not provided',
  })
  @IsString()
  memberName?: string;

  @IsOptional()
  @IsEmail()
  memberEmail?: string;

  @IsOptional()
  @IsString()
  memberPhone?: string;

  @IsOptional()
  @IsEnum(['admin', 'member'])
  role?: 'admin' | 'member';
}
