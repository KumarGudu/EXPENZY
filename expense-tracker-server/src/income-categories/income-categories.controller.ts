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
import { IncomeCategoriesService } from './income-categories.service';
import { CreateIncomeCategoryDto } from './dto/create-income-category.dto';
import { UpdateIncomeCategoryDto } from './dto/update-income-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('income-categories')
@UseGuards(JwtAuthGuard)
export class IncomeCategoriesController {
  constructor(
    private readonly incomeCategoriesService: IncomeCategoriesService,
  ) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createIncomeCategoryDto: CreateIncomeCategoryDto,
  ) {
    return this.incomeCategoriesService.create(
      req.user.userId,
      createIncomeCategoryDto,
    );
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('includeSystem') includeSystem?: string,
  ) {
    const include = includeSystem === 'false' ? false : true;
    return this.incomeCategoriesService.findAll(req.user.userId, include);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.incomeCategoriesService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateIncomeCategoryDto: UpdateIncomeCategoryDto,
  ) {
    return this.incomeCategoriesService.update(
      req.user.userId,
      id,
      updateIncomeCategoryDto,
    );
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.incomeCategoriesService.remove(req.user.userId, id);
  }
}
