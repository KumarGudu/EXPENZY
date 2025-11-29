import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { SavingsGoal, SavingsContribution, Prisma } from '@prisma/client';

type SavingsGoalWithContributions = SavingsGoal & {
  contributions: SavingsContribution[];
};

@Injectable()
export class SavingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createGoal(
    userId: string,
    createSavingsGoalDto: CreateSavingsGoalDto,
  ): Promise<SavingsGoal> {
    return this.prisma.savingsGoal.create({
      data: {
        userId,
        name: createSavingsGoalDto.name,
        description: createSavingsGoalDto.description,
        targetAmount: new Prisma.Decimal(createSavingsGoalDto.targetAmount),
        currency: createSavingsGoalDto.currency || 'USD',
        targetDate: createSavingsGoalDto.targetDate
          ? new Date(createSavingsGoalDto.targetDate)
          : null,
        priority: createSavingsGoalDto.priority || 'medium',
        icon: createSavingsGoalDto.icon,
        color: createSavingsGoalDto.color,
      },
    });
  }

  async findAllGoals(
    userId: string,
    includeArchived: boolean = false,
    includeCompleted: boolean = true,
  ): Promise<SavingsGoalWithContributions[]> {
    return this.prisma.savingsGoal.findMany({
      where: {
        userId,
        ...(includeArchived ? {} : { isArchived: false }),
        ...(includeCompleted ? {} : { isCompleted: false }),
      },
      include: {
        contributions: {
          orderBy: { contributionDate: 'desc' },
          take: 5,
        },
      },
      orderBy: [
        { isCompleted: 'asc' },
        { priority: 'desc' },
        { targetDate: 'asc' },
      ],
    });
  }

  async findOneGoal(
    userId: string,
    id: string,
  ): Promise<SavingsGoalWithContributions> {
    const goal = await this.prisma.savingsGoal.findFirst({
      where: { id, userId },
      include: {
        contributions: {
          orderBy: { contributionDate: 'desc' },
        },
      },
    });

    if (!goal) {
      throw new NotFoundException('Savings goal not found');
    }

    return goal;
  }

  async updateGoal(
    userId: string,
    id: string,
    updateSavingsGoalDto: UpdateSavingsGoalDto,
  ): Promise<SavingsGoal> {
    const existing = await this.prisma.savingsGoal.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Savings goal not found');
    }

    const updateData: Prisma.SavingsGoalUpdateInput = {
      ...(updateSavingsGoalDto.name && { name: updateSavingsGoalDto.name }),
      ...(updateSavingsGoalDto.description !== undefined && {
        description: updateSavingsGoalDto.description,
      }),
      ...(updateSavingsGoalDto.targetAmount !== undefined && {
        targetAmount: new Prisma.Decimal(updateSavingsGoalDto.targetAmount),
      }),
      ...(updateSavingsGoalDto.currency && {
        currency: updateSavingsGoalDto.currency,
      }),
      ...(updateSavingsGoalDto.targetDate !== undefined && {
        targetDate: updateSavingsGoalDto.targetDate
          ? new Date(updateSavingsGoalDto.targetDate)
          : null,
      }),
      ...(updateSavingsGoalDto.priority && {
        priority: updateSavingsGoalDto.priority,
      }),
      ...(updateSavingsGoalDto.icon !== undefined && {
        icon: updateSavingsGoalDto.icon,
      }),
      ...(updateSavingsGoalDto.color !== undefined && {
        color: updateSavingsGoalDto.color,
      }),
      ...(updateSavingsGoalDto.isArchived !== undefined && {
        isArchived: updateSavingsGoalDto.isArchived,
      }),
    };

    if (updateSavingsGoalDto.isCompleted !== undefined) {
      updateData.isCompleted = updateSavingsGoalDto.isCompleted;
      updateData.completedAt = updateSavingsGoalDto.isCompleted
        ? new Date()
        : null;
    }

    return this.prisma.savingsGoal.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteGoal(userId: string, id: string): Promise<{ message: string }> {
    const existing = await this.prisma.savingsGoal.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Savings goal not found');
    }

    await this.prisma.savingsGoal.delete({
      where: { id },
    });

    return { message: 'Savings goal deleted successfully' };
  }

  async addContribution(
    userId: string,
    goalId: string,
    createContributionDto: CreateContributionDto,
  ): Promise<SavingsGoal> {
    const goal = await this.prisma.savingsGoal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundException('Savings goal not found');
    }

    const amount = new Prisma.Decimal(createContributionDto.amount);
    const newCurrentAmount = goal.currentAmount.add(amount);

    await this.prisma.$transaction([
      this.prisma.savingsContribution.create({
        data: {
          savingsGoalId: goalId,
          amount,
          currency: createContributionDto.currency || goal.currency,
          contributionDate: createContributionDto.contributionDate
            ? new Date(createContributionDto.contributionDate)
            : new Date(),
          notes: createContributionDto.notes,
        },
      }),
      this.prisma.savingsGoal.update({
        where: { id: goalId },
        data: {
          currentAmount: newCurrentAmount,
          isCompleted: newCurrentAmount.gte(goal.targetAmount),
          completedAt: newCurrentAmount.gte(goal.targetAmount)
            ? new Date()
            : goal.completedAt,
        },
      }),
    ]);

    return this.findOneGoal(userId, goalId);
  }

  async getContributions(
    userId: string,
    goalId: string,
  ): Promise<SavingsContribution[]> {
    const goal = await this.prisma.savingsGoal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new NotFoundException('Savings goal not found');
    }

    return this.prisma.savingsContribution.findMany({
      where: { savingsGoalId: goalId },
      orderBy: { contributionDate: 'desc' },
    });
  }
}
