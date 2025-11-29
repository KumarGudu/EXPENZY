import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription, Category, Prisma } from '@prisma/client';

type SubscriptionWithCategory = Subscription & {
  category?: Category | null;
};

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionWithCategory> {
    return this.prisma.subscription.create({
      data: {
        userId,
        name: createSubscriptionDto.name,
        description: createSubscriptionDto.description,
        amount: new Prisma.Decimal(createSubscriptionDto.amount),
        currency: createSubscriptionDto.currency || 'USD',
        billingCycle: createSubscriptionDto.billingCycle,
        categoryId: createSubscriptionDto.categoryId,
        startDate: new Date(createSubscriptionDto.startDate),
        nextBillingDate: new Date(createSubscriptionDto.nextBillingDate),
        endDate: createSubscriptionDto.endDate
          ? new Date(createSubscriptionDto.endDate)
          : null,
        paymentMethod: createSubscriptionDto.paymentMethod,
        website: createSubscriptionDto.website,
        reminderDays: createSubscriptionDto.reminderDays ?? 3,
        icon: createSubscriptionDto.icon,
        color: createSubscriptionDto.color,
        notes: createSubscriptionDto.notes,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(
    userId: string,
    activeOnly: boolean = true,
  ): Promise<SubscriptionWithCategory[]> {
    return this.prisma.subscription.findMany({
      where: {
        userId,
        ...(activeOnly && { isActive: true }),
      },
      include: {
        category: true,
      },
      orderBy: { nextBillingDate: 'asc' },
    });
  }

  async findOne(userId: string, id: string): Promise<SubscriptionWithCategory> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id, userId },
      include: {
        category: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async update(
    userId: string,
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionWithCategory> {
    const existing = await this.prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.subscription.update({
      where: { id },
      data: {
        ...(updateSubscriptionDto.name && { name: updateSubscriptionDto.name }),
        ...(updateSubscriptionDto.description !== undefined && {
          description: updateSubscriptionDto.description,
        }),
        ...(updateSubscriptionDto.amount !== undefined && {
          amount: new Prisma.Decimal(updateSubscriptionDto.amount),
        }),
        ...(updateSubscriptionDto.currency && {
          currency: updateSubscriptionDto.currency,
        }),
        ...(updateSubscriptionDto.billingCycle && {
          billingCycle: updateSubscriptionDto.billingCycle,
        }),
        ...(updateSubscriptionDto.categoryId !== undefined && {
          categoryId: updateSubscriptionDto.categoryId,
        }),
        ...(updateSubscriptionDto.startDate && {
          startDate: new Date(updateSubscriptionDto.startDate),
        }),
        ...(updateSubscriptionDto.nextBillingDate && {
          nextBillingDate: new Date(updateSubscriptionDto.nextBillingDate),
        }),
        ...(updateSubscriptionDto.endDate !== undefined && {
          endDate: updateSubscriptionDto.endDate
            ? new Date(updateSubscriptionDto.endDate)
            : null,
        }),
        ...(updateSubscriptionDto.paymentMethod !== undefined && {
          paymentMethod: updateSubscriptionDto.paymentMethod,
        }),
        ...(updateSubscriptionDto.website !== undefined && {
          website: updateSubscriptionDto.website,
        }),
        ...(updateSubscriptionDto.reminderDays !== undefined && {
          reminderDays: updateSubscriptionDto.reminderDays,
        }),
        ...(updateSubscriptionDto.icon !== undefined && {
          icon: updateSubscriptionDto.icon,
        }),
        ...(updateSubscriptionDto.color !== undefined && {
          color: updateSubscriptionDto.color,
        }),
        ...(updateSubscriptionDto.notes !== undefined && {
          notes: updateSubscriptionDto.notes,
        }),
        ...(updateSubscriptionDto.isActive !== undefined && {
          isActive: updateSubscriptionDto.isActive,
        }),
      },
      include: {
        category: true,
      },
    });
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    const existing = await this.prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Subscription not found');
    }

    await this.prisma.subscription.delete({
      where: { id },
    });

    return { message: 'Subscription deleted successfully' };
  }

  async getUpcoming(
    userId: string,
    days: number = 30,
  ): Promise<SubscriptionWithCategory[]> {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return this.prisma.subscription.findMany({
      where: {
        userId,
        isActive: true,
        nextBillingDate: {
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
      orderBy: { nextBillingDate: 'asc' },
    });
  }

  async getTotalMonthly(userId: string): Promise<{
    total: string;
    count: number;
    subscriptions: SubscriptionWithCategory[];
  }> {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    const total = subscriptions.reduce((sum, sub) => {
      let monthlyAmount = sub.amount;

      switch (sub.billingCycle) {
        case 'daily':
          monthlyAmount = sub.amount.mul(30);
          break;
        case 'weekly':
          monthlyAmount = sub.amount.mul(4);
          break;
        case 'yearly':
          monthlyAmount = sub.amount.div(12);
          break;
      }

      return sum.add(monthlyAmount);
    }, new Prisma.Decimal(0));

    return {
      total: total.toString(),
      count: subscriptions.length,
      subscriptions,
    };
  }
}
