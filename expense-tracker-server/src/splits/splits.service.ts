import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { SplitExpense } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSplitExpenseDto } from './dto/create-split-expense.dto';
import { UpdateSplitExpenseDto } from './dto/update-split-expense.dto';
import * as crypto from 'crypto';

@Injectable()
export class SplitsService {
  constructor(private prisma: PrismaService) {}

  async create(createSplitExpenseDto: CreateSplitExpenseDto, userId: string) {
    // Validation
    if (!createSplitExpenseDto.expenseId && !createSplitExpenseDto.groupId) {
      throw new BadRequestException(
        'Either expenseId or groupId must be provided',
      );
    }

    // Validate split totals
    this.validateSplitTotals(createSplitExpenseDto);

    // Calculate amounts for each participant based on split type
    const participants = this.calculateParticipantAmounts(
      createSplitExpenseDto,
    );

    return this.prisma.splitExpense.create({
      data: {
        expenseId: createSplitExpenseDto.expenseId,
        groupId: createSplitExpenseDto.groupId,
        totalAmount: createSplitExpenseDto.totalAmount,
        currency: createSplitExpenseDto.currency || 'USD',
        splitType: createSplitExpenseDto.splitType,
        paidByUserId: createSplitExpenseDto.paidByUserId,
        paidByName: createSplitExpenseDto.paidByName,
        paidByEmail: createSplitExpenseDto.paidByEmail,
        createdByUserId: userId,
        description: createSplitExpenseDto.description,
        participants: {
          create: participants.map((p) => ({
            userId: p.userId,
            participantName: p.participantName,
            participantEmail: p.participantEmail,
            participantPhone: p.participantPhone,
            amountOwed: p.amountOwed,
            percentage: p.percentage,
            shares: p.shares,
            inviteToken:
              p.participantEmail && !p.userId
                ? crypto.randomBytes(32).toString('hex')
                : null,
          })),
        },
      },
      include: {
        expense: true,
        group: true,
        paidByUser: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.splitExpense.findMany({
      where: {
        OR: [
          { paidByUserId: userId },
          { createdByUserId: userId },
          { participants: { some: { userId: userId } } },
        ],
      },
      include: {
        expense: true,
        group: true,
        paidByUser: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const split = await this.prisma.splitExpense.findUnique({
      where: { id },
      include: {
        expense: true,
        group: true,
        paidByUser: true,
        createdBy: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!split) {
      throw new NotFoundException(`Split expense with ID ${id} not found`);
    }

    // Verify access
    if (!this.hasAccessToSplit(split, userId)) {
      throw new ForbiddenException(
        'You do not have permission to access this split expense',
      );
    }

    return split;
  }

  async update(
    id: string,
    updateSplitExpenseDto: UpdateSplitExpenseDto,
    userId: string,
  ) {
    const split = await this.prisma.splitExpense.findUnique({
      where: { id },
    });

    if (!split) {
      throw new NotFoundException(`Split expense with ID ${id} not found`);
    }

    // Only creator can update
    if (split.createdByUserId !== userId) {
      throw new ForbiddenException(
        'Only the split creator can update this split expense',
      );
    }

    return this.prisma.splitExpense.update({
      where: { id },
      data: {
        description: updateSplitExpenseDto.description,
        isSettled: updateSplitExpenseDto.isSettled,
        settledAt: updateSplitExpenseDto.isSettled ? new Date() : null,
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const split = await this.prisma.splitExpense.findUnique({
      where: { id },
    });

    if (!split) {
      throw new NotFoundException(`Split expense with ID ${id} not found`);
    }

    // Only creator can delete
    if (split.createdByUserId !== userId) {
      throw new ForbiddenException(
        'Only the split creator can delete this split expense',
      );
    }

    return this.prisma.splitExpense.delete({
      where: { id },
    });
  }

  async settleParticipant(
    splitId: string,
    participantUserId: string,
    userId: string,
  ) {
    // Find the participant
    const participant = await this.prisma.splitParticipant.findFirst({
      where: {
        splitExpenseId: splitId,
        userId: participantUserId,
      },
      include: {
        splitExpense: true,
      },
    });

    if (!participant) {
      throw new NotFoundException('Participant not found in this split');
    }

    // Only the participant themselves can settle
    if (participantUserId !== userId) {
      throw new ForbiddenException(
        'You can only settle your own participation',
      );
    }

    if (participant.isSettled) {
      throw new BadRequestException('This participation is already settled');
    }

    // Update participant
    const updatedParticipant = await this.prisma.splitParticipant.update({
      where: { id: participant.id },
      data: {
        amountPaid: participant.amountOwed,
        isSettled: true,
        settledAt: new Date(),
      },
    });

    // Check if all participants are settled
    const allParticipants = await this.prisma.splitParticipant.findMany({
      where: { splitExpenseId: splitId },
    });

    const allSettled = allParticipants.every((p) => p.isSettled);

    if (allSettled) {
      await this.prisma.splitExpense.update({
        where: { id: splitId },
        data: {
          isSettled: true,
          settledAt: new Date(),
        },
      });
    }

    return updatedParticipant;
  }

  // Helper methods
  private validateSplitTotals(dto: CreateSplitExpenseDto) {
    const { splitType, totalAmount, participants } = dto;

    if (splitType === 'percentage') {
      const totalPercentage = participants.reduce(
        (sum, p) => sum + (p.percentage || 0),
        0,
      );
      if (Math.abs(totalPercentage - 100) > 0.01) {
        throw new BadRequestException('Percentages must add up to 100%');
      }
    }

    if (splitType === 'exact') {
      const totalOwed = participants.reduce(
        (sum, p) => sum + (p.amountOwed || 0),
        0,
      );
      if (Math.abs(totalOwed - totalAmount) > 0.01) {
        throw new BadRequestException(
          'Sum of exact amounts must equal total amount',
        );
      }
    }
  }

  private calculateParticipantAmounts(dto: CreateSplitExpenseDto) {
    const { splitType, totalAmount, participants } = dto;

    return participants.map((p) => {
      let amountOwed = p.amountOwed || 0;

      if (splitType === 'equal') {
        amountOwed = totalAmount / participants.length;
      } else if (splitType === 'percentage' && p.percentage) {
        amountOwed = (totalAmount * p.percentage) / 100;
      } else if (splitType === 'shares' && p.shares) {
        const totalShares = participants.reduce(
          (sum, part) => sum + (part.shares || 0),
          0,
        );
        amountOwed = (totalAmount * p.shares) / totalShares;
      }

      return {
        ...p,
        amountOwed,
      };
    });
  }

  private hasAccessToSplit(
    split: SplitExpense & { participants: { userId: string | null }[] },
    userId: string,
  ): boolean {
    return (
      split.paidByUserId === userId ||
      split.createdByUserId === userId ||
      split.participants.some((p) => p.userId === userId)
    );
  }
}
