import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export enum SplitType {
    EQUAL = 'equal',
    PERCENTAGE = 'percentage',
    SHARES = 'shares',
    EXACT = 'exact',
}

export class SplitQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        description: 'Field to sort by',
        example: 'createdAt',
        enum: ['createdAt', 'totalAmount', 'isSettled', 'updatedAt'],
    })
    @IsString()
    @IsOptional()
    sortBy?: string = 'createdAt';

    @ApiPropertyOptional({
        description: 'Sort order',
        example: 'desc',
        enum: ['asc', 'desc'],
    })
    @IsString()
    @IsOptional()
    sortOrder?: string = 'desc';

    // Filters
    @ApiPropertyOptional({
        description: 'Filter by settlement status',
        example: false,
    })
    @Type(() => Boolean)
    @IsBoolean()
    @IsOptional()
    isSettled?: boolean;

    @ApiPropertyOptional({
        description: 'Filter by split type',
        enum: SplitType,
        example: SplitType.EQUAL,
    })
    @IsEnum(SplitType)
    @IsOptional()
    splitType?: SplitType;

    @ApiPropertyOptional({
        description: 'Minimum total amount',
        example: 50,
    })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    minAmount?: number;

    @ApiPropertyOptional({
        description: 'Maximum total amount',
        example: 1000,
    })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    maxAmount?: number;

    @ApiPropertyOptional({
        description: 'Search in description',
        example: 'dinner',
    })
    @IsString()
    @IsOptional()
    search?: string;
}
