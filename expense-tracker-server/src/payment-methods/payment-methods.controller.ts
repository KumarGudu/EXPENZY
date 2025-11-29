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
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('payment-methods')
@UseGuards(JwtAuthGuard)
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.create(
      req.user.userId,
      createPaymentMethodDto,
    );
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('activeOnly') activeOnly?: string,
  ) {
    const active = activeOnly === 'false' ? false : true;
    return this.paymentMethodsService.findAll(req.user.userId, active);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.paymentMethodsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.paymentMethodsService.update(
      req.user.userId,
      id,
      updatePaymentMethodDto,
    );
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.paymentMethodsService.remove(req.user.userId, id);
  }
}
