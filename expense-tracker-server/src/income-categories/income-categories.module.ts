import { Module } from '@nestjs/common';
import { IncomeCategoriesService } from './income-categories.service';
import { IncomeCategoriesController } from './income-categories.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IncomeCategoriesController],
  providers: [IncomeCategoriesService],
  exports: [IncomeCategoriesService],
})
export class IncomeCategoriesModule {}
