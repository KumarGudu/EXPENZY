import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { CreateLoanPaymentDto } from './dto/create-loan-payment.dto';
import { InviteLoanDto } from './dto/invite-loan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('loans')
@UseGuards(JwtAuthGuard)
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  create(
    @Body() createLoanDto: CreateLoanDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.loansService.create(createLoanDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.loansService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.loansService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLoanDto: UpdateLoanDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.loansService.update(id, updateLoanDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.loansService.remove(id, user.userId);
  }

  @Post(':id/payments')
  addPayment(
    @Param('id') id: string,
    @Body() createLoanPaymentDto: CreateLoanPaymentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.loansService.addPayment(id, createLoanPaymentDto, user.userId);
  }

  @Post(':id/invite')
  inviteToLoan(
    @Param('id') id: string,
    @Body() inviteLoanDto: InviteLoanDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.loansService.inviteToLoan(id, inviteLoanDto, user.userId);
  }
}
