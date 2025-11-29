import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Account, AccountTransaction, Prisma } from '@prisma/client';

type AccountWithTransactions = Account & {
  transactions: AccountTransaction[];
};

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return this.prisma.account.create({
      data: {
        userId,
        name: createAccountDto.name,
        type: createAccountDto.type,
        balance:
          createAccountDto.balance !== undefined
            ? new Prisma.Decimal(createAccountDto.balance)
            : new Prisma.Decimal(0),
        currency: createAccountDto.currency || 'USD',
        bankName: createAccountDto.bankName,
        accountNumber: createAccountDto.accountNumber,
        icon: createAccountDto.icon,
        color: createAccountDto.color,
        includeInTotal: createAccountDto.includeInTotal ?? true,
      },
    });
  }

  async findAll(
    userId: string,
    activeOnly: boolean = true,
  ): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: {
        userId,
        ...(activeOnly && { isActive: true }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(
    userId: string,
    id: string,
    includeTransactions: boolean = false,
  ): Promise<Account | AccountWithTransactions> {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
      ...(includeTransactions && {
        include: {
          transactions: {
            orderBy: { date: 'desc' },
            take: 50,
          },
        },
      }),
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async update(
    userId: string,
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const existing = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Account not found');
    }

    return this.prisma.account.update({
      where: { id },
      data: {
        ...(updateAccountDto.name && { name: updateAccountDto.name }),
        ...(updateAccountDto.type && { type: updateAccountDto.type }),
        ...(updateAccountDto.balance !== undefined && {
          balance: new Prisma.Decimal(updateAccountDto.balance),
        }),
        ...(updateAccountDto.currency && {
          currency: updateAccountDto.currency,
        }),
        ...(updateAccountDto.bankName !== undefined && {
          bankName: updateAccountDto.bankName,
        }),
        ...(updateAccountDto.accountNumber !== undefined && {
          accountNumber: updateAccountDto.accountNumber,
        }),
        ...(updateAccountDto.icon !== undefined && {
          icon: updateAccountDto.icon,
        }),
        ...(updateAccountDto.color !== undefined && {
          color: updateAccountDto.color,
        }),
        ...(updateAccountDto.includeInTotal !== undefined && {
          includeInTotal: updateAccountDto.includeInTotal,
        }),
        ...(updateAccountDto.isActive !== undefined && {
          isActive: updateAccountDto.isActive,
        }),
      },
    });
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    const existing = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Account not found');
    }

    await this.prisma.account.delete({
      where: { id },
    });

    return { message: 'Account deleted successfully' };
  }

  async addTransaction(
    userId: string,
    accountId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Account> {
    const account = await this.prisma.account.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const amount = new Prisma.Decimal(createTransactionDto.amount);
    let newBalance = account.balance;

    if (createTransactionDto.type === 'credit') {
      newBalance = account.balance.add(amount);
    } else if (createTransactionDto.type === 'debit') {
      newBalance = account.balance.sub(amount);
    }

    await this.prisma.$transaction([
      this.prisma.accountTransaction.create({
        data: {
          accountId,
          type: createTransactionDto.type,
          amount,
          description: createTransactionDto.description,
          date: createTransactionDto.date
            ? new Date(createTransactionDto.date)
            : new Date(),
          relatedType: createTransactionDto.relatedType,
          relatedId: createTransactionDto.relatedId,
        },
      }),
      this.prisma.account.update({
        where: { id: accountId },
        data: { balance: newBalance },
      }),
    ]);

    return this.findOne(userId, accountId) as Promise<Account>;
  }

  async getTransactions(
    userId: string,
    accountId: string,
  ): Promise<AccountTransaction[]> {
    const account = await this.prisma.account.findFirst({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.prisma.accountTransaction.findMany({
      where: { accountId },
      orderBy: { date: 'desc' },
    });
  }

  async getTotalBalance(
    userId: string,
  ): Promise<{ total: string; accounts: Account[] }> {
    const accounts = await this.prisma.account.findMany({
      where: {
        userId,
        isActive: true,
        includeInTotal: true,
      },
    });

    const total = accounts.reduce(
      (sum, account) => sum.add(account.balance),
      new Prisma.Decimal(0),
    );

    return {
      total: total.toString(),
      accounts,
    };
  }
}
