import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SplitsService } from './splits.service';
import { CreateSplitExpenseDto } from './dto/create-split-expense.dto';
import { UpdateSplitExpenseDto } from './dto/update-split-expense.dto';
import { SplitQueryDto } from './dto/split-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';

@ApiTags('splits')
@Controller('splits')
@UseGuards(JwtAuthGuard)
export class SplitsController {
  constructor(private readonly splitsService: SplitsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new split expense' })
  create(
    @Body() createSplitExpenseDto: CreateSplitExpenseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.splitsService.create(createSplitExpenseDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all split expenses with pagination, sorting, and filtering' })
  findAll(@CurrentUser() user: JwtPayload, @Query() query: SplitQueryDto) {
    return this.splitsService.findAll(user.userId, query);
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
