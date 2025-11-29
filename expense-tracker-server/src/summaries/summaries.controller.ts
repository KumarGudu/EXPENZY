import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('summaries')
@UseGuards(JwtAuthGuard)
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Get('monthly')
  getMonthlySummary(
    @CurrentUser() user: JwtPayload,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('currency') currency?: string,
  ) {
    return this.summariesService.getMonthlySummary(
      user.userId,
      parseInt(year),
      parseInt(month),
      currency,
    );
  }

  @Get('yearly')
  getYearlySummary(
    @CurrentUser() user: JwtPayload,
    @Query('year') year: string,
    @Query('currency') currency?: string,
  ) {
    return this.summariesService.getYearlySummary(
      user.userId,
      parseInt(year),
      currency,
    );
  }
}
