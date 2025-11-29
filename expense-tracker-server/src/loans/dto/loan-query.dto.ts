import { IsOptional, IsString, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export enum LoanStatus {
    ACTIVE = 'active',
    PAID = 'paid',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled',
}

export enum LoanRole {
    LENDER = 'lender',
    BORROWER = 'borrower',
    ALL = 'all',
}

export class LoanQueryDto extends PaginationQueryDto {
    @ApiPropertyOptional({
        description: 'Field to sort by',
        example: 'dueDate',
        enum: ['dueDate', 'amount', 'loanDate', 'createdAt', 'status'],
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
        description: 'Filter by loan status',
        enum: LoanStatus,
        example: LoanStatus.ACTIVE,
    })
    @IsEnum(LoanStatus)
    @IsOptional()
    status?: LoanStatus;

    @ApiPropertyOptional({
        description: 'Filter by user role (lender, borrower, or all)',
        enum: LoanRole,
        example: LoanRole.ALL,
    })
    @IsEnum(LoanRole)
    @IsOptional()
    role?: LoanRole = LoanRole.ALL;

    @ApiPropertyOptional({
        description: 'Minimum loan amount',
        example: 100,
    })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    minAmount?: number;

    @ApiPropertyOptional({
        description: 'Maximum loan amount',
        example: 10000,
    })
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    maxAmount?: number;

    @ApiPropertyOptional({
        description: 'Filter overdue loans (due date passed)',
        example: true,
    })
    @IsOptional()
    overdue?: boolean;

    @ApiPropertyOptional({
        description: 'Start date for loan date filtering',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @ApiPropertyOptional({
        description: 'End date for loan date filtering',
        example: '2024-12-31',
    })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @ApiPropertyOptional({
        description: 'Search in description',
        example: 'car loan',
    })
    @IsString()
    @IsOptional()
    search?: string;
}
