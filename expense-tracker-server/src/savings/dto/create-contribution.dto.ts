import {
  IsNumber,
  IsOptional,
  IsDateString,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContributionDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsOptional()
  contributionDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
