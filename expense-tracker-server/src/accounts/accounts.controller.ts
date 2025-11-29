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
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.create(req.user.userId, createAccountDto);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('activeOnly') activeOnly?: string,
  ) {
    const active = activeOnly === 'false' ? false : true;
    return this.accountsService.findAll(req.user.userId, active);
  }

  @Get('total-balance')
  getTotalBalance(@Req() req: AuthenticatedRequest) {
    return this.accountsService.getTotalBalance(req.user.userId);
  }

  @Get(':id')
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Query('includeTransactions') includeTransactions?: string,
  ) {
    const include = includeTransactions === 'true';
    return this.accountsService.findOne(req.user.userId, id, include);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.update(req.user.userId, id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.accountsService.remove(req.user.userId, id);
  }

  @Post(':id/transactions')
  addTransaction(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.accountsService.addTransaction(
      req.user.userId,
      id,
      createTransactionDto,
    );
  }

  @Get(':id/transactions')
  getTransactions(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.accountsService.getTransactions(req.user.userId, id);
  }
}
