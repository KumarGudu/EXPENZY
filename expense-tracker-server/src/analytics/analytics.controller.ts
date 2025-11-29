import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto, AnalyticsPeriod } from './dto/analytics-query.dto';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Get comprehensive dashboard summary',
    description:
      'Returns all key metrics including income, expenses, budgets, savings goals, upcoming subscriptions, recent transactions, top categories, and account balances',
  })
  @ApiQuery({ name: 'period', enum: AnalyticsPeriod, required: false })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getDashboardSummary(
    @Request() req: { user: { userId: string } },
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getDashboardSummary(req.user.userId, query);
  }

  @Get('spending-trends')
  @ApiOperation({
    summary: 'Get spending trends over time',
    description:
      'Returns daily spending totals and trends for the specified period',
  })
  @ApiQuery({ name: 'period', enum: AnalyticsPeriod, required: false })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getSpendingTrends(
    @Request() req: { user: { userId: string } },
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getSpendingTrends(req.user.userId, query);
  }

  @Get('category-breakdown')
  @ApiOperation({
    summary: 'Get expense breakdown by category',
    description:
      'Returns total spending, transaction count, and percentage for each category',
  })
  @ApiQuery({ name: 'period', enum: AnalyticsPeriod, required: false })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getCategoryBreakdown(
    @Request() req: { user: { userId: string } },
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getCategoryBreakdown(req.user.userId, query);
  }

  @Get('cash-flow')
  @ApiOperation({
    summary: 'Get cash flow analysis',
    description:
      'Returns daily income, expenses, and net cash flow for the specified period',
  })
  @ApiQuery({ name: 'period', enum: AnalyticsPeriod, required: false })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getCashFlow(
    @Request() req: { user: { userId: string } },
    @Query() query: AnalyticsQueryDto,
  ) {
    return this.analyticsService.getCashFlow(req.user.userId, query);
  }

  @Get('budget-performance')
  @ApiOperation({
    summary: 'Get budget performance analysis',
    description:
      'Returns utilization, status, and remaining amounts for all active budgets',
  })
  async getBudgetPerformance(@Request() req: { user: { userId: string } }) {
    return this.analyticsService.getBudgetPerformance(req.user.userId);
  }
}
