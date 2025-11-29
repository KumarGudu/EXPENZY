import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Loan, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { CreateLoanPaymentDto } from './dto/create-loan-payment.dto';
import { InviteLoanDto } from './dto/invite-loan.dto';
import { LoanQueryDto, LoanRole } from './dto/loan-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { QueryBuilder } from '../common/utils/query-builder.util';
import * as crypto from 'crypto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async create(createLoanDto: CreateLoanDto, userId: string) {
    // Validation: At least one lender and one borrower identifier must be provided
    const hasLender = createLoanDto.lenderUserId || createLoanDto.lenderName;
    const hasBorrower =
      createLoanDto.borrowerUserId || createLoanDto.borrowerName;

    if (!hasLender || !hasBorrower) {
      throw new BadRequestException(
        'Both lender and borrower information must be provided',
      );
    }

    // Prevent self-loans
    if (
      createLoanDto.lenderUserId === createLoanDto.borrowerUserId &&
      createLoanDto.lenderUserId
    ) {
      throw new BadRequestException('Cannot create a loan to yourself');
    }

    if (
      createLoanDto.lenderUserId === userId &&
      createLoanDto.borrowerUserId === userId
    ) {
      throw new BadRequestException('Cannot create a loan to yourself');
    }

    const amountRemaining = createLoanDto.amount;

    return this.prisma.loan.create({
      data: {
        lenderUserId: createLoanDto.lenderUserId,
        lenderName: createLoanDto.lenderName,
        lenderEmail: createLoanDto.lenderEmail,
        lenderPhone: createLoanDto.lenderPhone,
        borrowerUserId: createLoanDto.borrowerUserId,
        borrowerName: createLoanDto.borrowerName,
        borrowerEmail: createLoanDto.borrowerEmail,
        borrowerPhone: createLoanDto.borrowerPhone,
        createdByUserId: userId,
        amount: createLoanDto.amount,
        currency: createLoanDto.currency || 'USD',
        interestRate: createLoanDto.interestRate || 0,
        description: createLoanDto.description,
        loanDate: new Date(createLoanDto.loanDate),
        dueDate: createLoanDto.dueDate ? new Date(createLoanDto.dueDate) : null,
        paymentTerms: createLoanDto.paymentTerms,
        amountRemaining,
      },
      include: {
        lender: true,
        borrower: true,
        createdBy: true,
      },
    });
  }

  async findAll(userId: string, query: LoanQueryDto) {
    // Build where clause based on role
    const where: Prisma.LoanWhereInput = {};

    if (query.role === LoanRole.LENDER) {
      where.lenderUserId = userId;
    } else if (query.role === LoanRole.BORROWER) {
      where.borrowerUserId = userId;
    } else {
      // ALL - user is either lender or borrower
      where.OR = [{ lenderUserId: userId }, { borrowerUserId: userId }];
    }

    // Add filters
    if (query.status) {
      where.status = query.status;
    }

    if (query.minAmount !== undefined || query.maxAmount !== undefined) {
      where.amount = QueryBuilder.buildNumberRangeFilter(
        query.minAmount,
        query.maxAmount,
      );
    }

    if (query.startDate || query.endDate) {
      where.loanDate = QueryBuilder.buildDateRangeFilter(
        query.startDate,
        query.endDate,
      );
    }

    if (query.overdue) {
      where.dueDate = {
        lt: new Date(),
      };
      where.status = 'active'; // Only active loans can be overdue
    }

    if (query.search) {
      const searchFilter = QueryBuilder.buildTextSearchFilter(query.search, [
        'description',
      ]);
      if (searchFilter) {
        Object.assign(where, searchFilter);
      }
    }

    // Build orderBy clause
    const allowedSortFields = [
      'dueDate',
      'amount',
      'loanDate',
      'createdAt',
      'status',
    ];
    const sortBy =
      query.sortBy && allowedSortFields.includes(query.sortBy)
        ? query.sortBy
        : 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    const orderBy: Prisma.LoanOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Get total count
    const total = await this.prisma.loan.count({ where });

    // Get paginated data with optimized includes
    const data = await this.prisma.loan.findMany({
      where,
      select: {
        id: true,
        amount: true,
        currency: true,
        interestRate: true,
        description: true,
        loanDate: true,
        dueDate: true,
        status: true,
        amountPaid: true,
        amountRemaining: true,
        paymentTerms: true,
        createdAt: true,
        updatedAt: true,
        lender: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        borrower: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePictureUrl: true,
          },
        },
        _count: {
          select: { payments: true },
        },
      },
      orderBy,
      skip: query.skip,
      take: query.take,
    });

    return new PaginatedResponseDto(
      data,
      query.page || 1,
      query.limit || 20,
      total,
    );
  }

  async findOne(id: string, userId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: {
        lender: true,
        borrower: true,
        createdBy: true,
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    // Verify access: user must be lender, borrower, or creator
    if (!this.hasAccessToLoan(loan, userId)) {
      throw new ForbiddenException(
        'You do not have permission to access this loan',
      );
    }

    return loan;
  }

  async update(id: string, updateLoanDto: UpdateLoanDto, userId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    // Only creator can update loan details
    if (loan.createdByUserId !== userId) {
      throw new ForbiddenException(
        'Only the loan creator can update loan details',
      );
    }

    return this.prisma.loan.update({
      where: { id },
      data: {
        amount: updateLoanDto.amount,
        currency: updateLoanDto.currency,
        interestRate: updateLoanDto.interestRate,
        description: updateLoanDto.description,
        loanDate: updateLoanDto.loanDate
          ? new Date(updateLoanDto.loanDate)
          : undefined,
        dueDate: updateLoanDto.dueDate
          ? new Date(updateLoanDto.dueDate)
          : undefined,
        paymentTerms: updateLoanDto.paymentTerms,
        status: updateLoanDto.status,
      },
      include: {
        lender: true,
        borrower: true,
        payments: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    // Only creator can delete
    if (loan.createdByUserId !== userId) {
      throw new ForbiddenException(
        'Only the loan creator can delete this loan',
      );
    }

    return this.prisma.loan.delete({
      where: { id },
    });
  }

  async addPayment(
    id: string,
    createLoanPaymentDto: CreateLoanPaymentDto,
    userId: string,
  ) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    // Verify access
    if (!this.hasAccessToLoan(loan, userId)) {
      throw new ForbiddenException(
        'You do not have permission to add payments to this loan',
      );
    }

    // Validate payment amount
    if (createLoanPaymentDto.amount > Number(loan.amountRemaining)) {
      throw new BadRequestException(
        `Payment amount (${createLoanPaymentDto.amount}) exceeds remaining amount (${Number(loan.amountRemaining)})`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Create payment
      await tx.loanPayment.create({
        data: {
          loanId: id,
          amount: createLoanPaymentDto.amount,
          currency: createLoanPaymentDto.currency || loan.currency,
          paymentDate: new Date(createLoanPaymentDto.paymentDate),
          paymentMethod: createLoanPaymentDto.paymentMethod,
          notes: createLoanPaymentDto.notes,
        },
      });

      // Update loan
      const newAmountPaid =
        Number(loan.amountPaid) + Number(createLoanPaymentDto.amount);
      const newAmountRemaining = Number(loan.amount) - newAmountPaid;
      const newStatus = newAmountRemaining <= 0 ? 'paid' : 'active';

      const updatedLoan = await tx.loan.update({
        where: { id },
        data: {
          amountPaid: newAmountPaid,
          amountRemaining: newAmountRemaining,
          status: newStatus,
        },
        include: {
          lender: true,
          borrower: true,
          payments: true,
        },
      });

      return updatedLoan;
    });
  }

  async inviteToLoan(id: string, inviteLoanDto: InviteLoanDto, userId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${id} not found`);
    }

    // Only creator can invite
    if (loan.createdByUserId !== userId) {
      throw new ForbiddenException('Only the loan creator can send invites');
    }

    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');

    // Update loan with invite details
    const updateData: Prisma.LoanUpdateInput = {
      inviteToken,
      inviteStatus: 'pending',
      invitedAt: new Date(),
    };

    // Update the appropriate user fields based on role
    if (inviteLoanDto.role === 'lender') {
      updateData.lenderEmail = inviteLoanDto.email;
      updateData.lenderPhone = inviteLoanDto.phone;
    } else {
      updateData.borrowerEmail = inviteLoanDto.email;
      updateData.borrowerPhone = inviteLoanDto.phone;
    }

    const updatedLoan = await this.prisma.loan.update({
      where: { id },
      data: updateData,
    });

    // TODO: Send invite email/SMS here
    // await this.emailService.sendLoanInvite(inviteLoanDto.email, inviteToken, loan);

    return {
      ...updatedLoan,
      inviteLink: `${process.env.APP_URL || 'http://localhost:3000'}/invites/loan/${inviteToken}`,
    };
  }

  async acceptInvite(token: string, userId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { inviteToken: token },
    });

    if (!loan) {
      throw new NotFoundException('Invalid invite token');
    }

    if (loan.inviteStatus === 'accepted') {
      throw new BadRequestException('This invite has already been accepted');
    }

    // Determine which role to assign based on which userId is empty
    const updateData: Record<string, string | null | Date> = {
      inviteStatus: 'accepted',
    };

    if (!loan.lenderUserId && loan.lenderEmail) {
      updateData.lenderUserId = userId;
      updateData.lenderName = null;
    } else if (!loan.borrowerUserId && loan.borrowerEmail) {
      updateData.borrowerUserId = userId;
      updateData.borrowerName = null;
    } else {
      throw new BadRequestException('No pending invite for this loan');
    }

    return this.prisma.loan.update({
      where: { id: loan.id },
      data: updateData,
      include: {
        lender: true,
        borrower: true,
        createdBy: true,
      },
    });
  }

  // Helper method to check if user has access to loan
  private hasAccessToLoan(loan: Loan, userId: string): boolean {
    return (
      loan.lenderUserId === userId ||
      loan.borrowerUserId === userId ||
      loan.createdByUserId === userId
    );
  }
}
