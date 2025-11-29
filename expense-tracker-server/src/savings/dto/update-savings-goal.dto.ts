import { PartialType } from '@nestjs/mapped-types';
import { CreateSavingsGoalDto } from './create-savings-goal.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSavingsGoalDto extends PartialType(CreateSavingsGoalDto) {
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean;
}
