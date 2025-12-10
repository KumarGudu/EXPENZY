import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { SplitCalculationService } from './services/split-calculation.service';
import { BalanceCalculationService } from './services/balance-calculation.service';

@Module({
  controllers: [GroupsController],
  providers: [
    GroupsService,
    SplitCalculationService,
    BalanceCalculationService,
  ],
  exports: [GroupsService, SplitCalculationService, BalanceCalculationService],
})
export class GroupsModule {}
