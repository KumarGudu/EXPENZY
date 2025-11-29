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
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.create(
      req.user.userId,
      createSubscriptionDto,
    );
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('activeOnly') activeOnly?: string,
  ) {
    const active = activeOnly === 'false' ? false : true;
    return this.subscriptionsService.findAll(req.user.userId, active);
  }

  @Get('upcoming')
  getUpcoming(
    @Req() req: AuthenticatedRequest,
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
  ) {
    return this.subscriptionsService.getUpcoming(req.user.userId, days);
  }

  @Get('total-monthly')
  getTotalMonthly(@Req() req: AuthenticatedRequest) {
    return this.subscriptionsService.getTotalMonthly(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.subscriptionsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.update(
      req.user.userId,
      id,
      updateSubscriptionDto,
    );
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.subscriptionsService.remove(req.user.userId, id);
  }
}
