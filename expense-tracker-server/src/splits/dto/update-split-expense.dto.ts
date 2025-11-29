import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreateSplitExpenseDto } from './create-split-expense.dto';

export class UpdateSplitExpenseDto extends PartialType(CreateSplitExpenseDto) {
  @IsOptional()
  @IsBoolean()
  isSettled?: boolean;
}
