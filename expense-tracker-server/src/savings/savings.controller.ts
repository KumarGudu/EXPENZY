import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { SavingsService } from './savings.service';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('savings')
@UseGuards(JwtAuthGuard)
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post('goals')
  createGoal(
    @Req() req: AuthenticatedRequest,
    @Body() createSavingsGoalDto: CreateSavingsGoalDto,
  ) {
    return this.savingsService.createGoal(
      req.user.userId,
      createSavingsGoalDto,
    );
  }

  @Get('goals')
  findAllGoals(
    @Req() req: AuthenticatedRequest,
    @Query('includeArchived') includeArchived?: string,
    @Query('includeCompleted') includeCompleted?: string,
  ) {
    const archived = includeArchived === 'true';
    const completed = includeCompleted === 'false' ? false : true;
    return this.savingsService.findAllGoals(
      req.user.userId,
      archived,
      completed,
    );
  }

  @Get('goals/:id')
  findOneGoal(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.savingsService.findOneGoal(req.user.userId, id);
  }

  @Patch('goals/:id')
  updateGoal(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateSavingsGoalDto: UpdateSavingsGoalDto,
  ) {
    return this.savingsService.updateGoal(
      req.user.userId,
      id,
      updateSavingsGoalDto,
    );
  }

  @Delete('goals/:id')
  deleteGoal(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.savingsService.deleteGoal(req.user.userId, id);
  }

  @Post('goals/:id/contributions')
  addContribution(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() createContributionDto: CreateContributionDto,
  ) {
    return this.savingsService.addContribution(
      req.user.userId,
      id,
      createContributionDto,
    );
  }

  @Get('goals/:id/contributions')
  getContributions(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.savingsService.getContributions(req.user.userId, id);
  }
}
