import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { SplitCalculationService } from './services/split-calculation.service';
import { BalanceCalculationService } from './services/balance-calculation.service';
import { DebtSettlementService } from './services/debt-settlement.service';

@Module({
  controllers: [GroupsController],
  providers: [
    GroupsService,
    SplitCalculationService,
    BalanceCalculationService,
    DebtSettlementService,
  ],
  exports: [
    GroupsService,
    SplitCalculationService,
    BalanceCalculationService,
    DebtSettlementService,
  ],
})
export class GroupsModule { }
