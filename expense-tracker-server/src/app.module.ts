import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CategoriesModule } from './categories/categories.module';
import { LoansModule } from './loans/loans.module';
import { SplitsModule } from './splits/splits.module';
import { SummariesModule } from './summaries/summaries.module';
import { GroupsModule } from './groups/groups.module';
import { InvitesModule } from './invites/invites.module';
import { IncomeModule } from './income/income.module';
import { IncomeCategoriesModule } from './income-categories/income-categories.module';
import { SavingsModule } from './savings/savings.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TagsModule } from './tags/tags.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { AccountsModule } from './accounts/accounts.module';
import { UserSettingsModule } from './user-settings/user-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ExpensesModule,
    CategoriesModule,
    LoansModule,
    SplitsModule,
    SummariesModule,
    GroupsModule,
    InvitesModule,
    IncomeModule,
    IncomeCategoriesModule,
    SavingsModule,
    SubscriptionsModule,
    TagsModule,
    PaymentMethodsModule,
    AccountsModule,
    UserSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
