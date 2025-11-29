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
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(req.user.userId, createTagDto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.tagsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tagsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(req.user.userId, id, updateTagDto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.tagsService.remove(req.user.userId, id);
  }

  @Post('expenses/:expenseId/attach/:tagId')
  attachToExpense(
    @Req() req: AuthenticatedRequest,
    @Param('expenseId') expenseId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.attachToExpense(req.user.userId, expenseId, tagId);
  }

  @Delete('expenses/:expenseId/detach/:tagId')
  detachFromExpense(
    @Req() req: AuthenticatedRequest,
    @Param('expenseId') expenseId: string,
    @Param('tagId') tagId: string,
  ) {
    return this.tagsService.detachFromExpense(
      req.user.userId,
      expenseId,
      tagId,
    );
  }
}
