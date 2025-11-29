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
import { SplitsService } from './splits.service';
import { CreateSplitExpenseDto } from './dto/create-split-expense.dto';
import { UpdateSplitExpenseDto } from './dto/update-split-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('split-expenses')
@UseGuards(JwtAuthGuard)
export class SplitsController {
  constructor(private readonly splitsService: SplitsService) {}

  @Post()
  create(
    @Body() createSplitExpenseDto: CreateSplitExpenseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.splitsService.create(createSplitExpenseDto, user.userId);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.splitsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.splitsService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSplitExpenseDto: UpdateSplitExpenseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.splitsService.update(id, updateSplitExpenseDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.splitsService.remove(id, user.userId);
  }

  @Post(':id/participants/:userId/settle')
  settleParticipant(
    @Param('id') id: string,
    @Param('userId') participantUserId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.splitsService.settleParticipant(
      id,
      participantUserId,
      user.userId,
    );
  }
}
