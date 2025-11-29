import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoansService } from '../loans/loans.service';
import { SplitsService } from '../splits/splits.service';
import { GroupsService } from '../groups/groups.service';
import {
  InviteType,
  InviteStatus,
  InviteDetails,
} from './interfaces/invite.interface';

@Injectable()
export class InvitesService {
  private readonly INVITE_EXPIRATION_DAYS = 7;

  constructor(
    private prisma: PrismaService,
    private loansService: LoansService,
    private splitsService: SplitsService,
    private groupsService: GroupsService,
  ) {}

  async getInviteDetails(token: string): Promise<InviteDetails> {
    // Check loans
    const loan = await this.prisma.loan.findUnique({
      where: { inviteToken: token },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (loan) {
      const isExpired = this.checkInviteExpiration(loan.invitedAt);
      const role = !loan.lenderUserId ? 'lender' : 'borrower';

      return {
        type: InviteType.LOAN,
        status: isExpired
          ? InviteStatus.EXPIRED
          : (loan.inviteStatus as InviteStatus),
        invitedAt: loan.invitedAt || new Date(),
        isExpired,
        entityId: loan.id,
        entityDetails: {
          loanId: loan.id,
          amount: Number(loan.amount),
          currency: loan.currency,
          description: loan.description,
          role,
          createdBy: {
            id: loan.createdBy.id,
            username: loan.createdBy.username,
            email: loan.createdBy.email,
          },
        },
      };
    }

    // Check split participants
    const splitParticipant = await this.prisma.splitParticipant.findUnique({
      where: { inviteToken: token },
      include: {
        splitExpense: {
          include: {
            createdBy: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (splitParticipant) {
      const isExpired = this.checkInviteExpiration(splitParticipant.invitedAt);

      return {
        type: InviteType.SPLIT,
        status: isExpired
          ? InviteStatus.EXPIRED
          : (splitParticipant.inviteStatus as InviteStatus),
        invitedAt: splitParticipant.invitedAt || new Date(),
        isExpired,
        entityId: splitParticipant.splitExpenseId,
        entityDetails: {
          splitId: splitParticipant.splitExpenseId,
          totalAmount: Number(splitParticipant.splitExpense.totalAmount),
          currency: splitParticipant.splitExpense.currency,
          description: splitParticipant.splitExpense.description,
          amountOwed: Number(splitParticipant.amountOwed),
          createdBy: {
            id: splitParticipant.splitExpense.createdBy.id,
            username: splitParticipant.splitExpense.createdBy.username,
            email: splitParticipant.splitExpense.createdBy.email,
          },
        },
      };
    }

    // Check group members
    const groupMember = await this.prisma.groupMember.findUnique({
      where: { inviteToken: token },
      include: {
        group: {
          include: {
            createdBy: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
            _count: {
              select: {
                members: true,
              },
            },
          },
        },
      },
    });

    if (groupMember) {
      // GroupMember doesn't have invitedAt, use joinedAt or createdAt as fallback
      const inviteDate = groupMember.joinedAt || new Date();
      const isExpired = false; // Groups don't expire for now

      return {
        type: InviteType.GROUP,
        status: groupMember.inviteStatus as InviteStatus,
        invitedAt: inviteDate,
        isExpired,
        entityId: groupMember.groupId,
        entityDetails: {
          groupId: groupMember.groupId,
          groupName: groupMember.group.name,
          description: groupMember.group.description,
          memberCount: groupMember.group._count.members,
          role: groupMember.role as 'admin' | 'member',
          createdBy: {
            id: groupMember.group.createdBy.id,
            username: groupMember.group.createdBy.username,
            email: groupMember.group.createdBy.email,
          },
        },
      };
    }

    throw new NotFoundException('Invalid invite token');
  }

  async acceptInvite(
    token: string,
    userId: string,
  ): Promise<{ type: InviteType; entity: unknown }> {
    const inviteDetails = await this.getInviteDetails(token);

    if (inviteDetails.isExpired) {
      throw new BadRequestException('This invite has expired');
    }

    if (inviteDetails.status === InviteStatus.ACCEPTED) {
      throw new BadRequestException('This invite has already been accepted');
    }

    switch (inviteDetails.type) {
      case InviteType.LOAN: {
        const loan = await this.loansService.acceptInvite(token, userId);
        return { type: InviteType.LOAN, entity: loan };
      }

      case InviteType.SPLIT: {
        // For splits, we need to accept via the participant
        const participant = await this.prisma.splitParticipant.findUnique({
          where: { inviteToken: token },
        });
        if (!participant) {
          throw new NotFoundException('Split participant not found');
        }

        const updatedParticipant = await this.prisma.splitParticipant.update({
          where: { id: participant.id },
          data: {
            userId,
            inviteStatus: 'accepted',
            participantName: null,
          },
          include: {
            splitExpense: true,
            user: true,
          },
        });
        return { type: InviteType.SPLIT, entity: updatedParticipant };
      }

      case InviteType.GROUP: {
        const group = await this.groupsService.acceptInvite(token, userId);
        return { type: InviteType.GROUP, entity: group };
      }

      default:
        throw new BadRequestException('Unknown invite type');
    }
  }

  async resendInvite(
    token: string,
    userId: string,
  ): Promise<{ message: string; inviteLink: string }> {
    const inviteDetails = await this.getInviteDetails(token);

    // Verify user is the creator
    const creatorId = inviteDetails.entityDetails.createdBy.id;
    if (creatorId !== userId) {
      throw new ForbiddenException(
        'Only the invite creator can resend invites',
      );
    }

    if (inviteDetails.status === InviteStatus.ACCEPTED) {
      throw new BadRequestException('Cannot resend an already accepted invite');
    }

    // TODO: Send email/SMS here
    // await this.emailService.sendInvite(inviteDetails);

    const inviteLink = `${process.env.APP_URL || 'http://localhost:3000'}/invites/${token}`;

    return {
      message: 'Invite resent successfully',
      inviteLink,
    };
  }

  private checkInviteExpiration(invitedAt: Date | null): boolean {
    if (!invitedAt) return false;

    const now = new Date();
    const expirationDate = new Date(invitedAt);
    expirationDate.setDate(
      expirationDate.getDate() + this.INVITE_EXPIRATION_DAYS,
    );

    return now > expirationDate;
  }
}
