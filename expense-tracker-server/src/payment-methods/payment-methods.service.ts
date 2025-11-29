import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from '@prisma/client';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    if (createPaymentMethodDto.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.paymentMethod.create({
      data: {
        userId,
        name: createPaymentMethodDto.name,
        type: createPaymentMethodDto.type,
        lastFourDigits: createPaymentMethodDto.lastFourDigits,
        bankName: createPaymentMethodDto.bankName,
        icon: createPaymentMethodDto.icon,
        color: createPaymentMethodDto.color,
        isDefault: createPaymentMethodDto.isDefault || false,
      },
    });
  }

  async findAll(
    userId: string,
    activeOnly: boolean = true,
  ): Promise<PaymentMethod[]> {
    return this.prisma.paymentMethod.findMany({
      where: {
        userId,
        ...(activeOnly && { isActive: true }),
      },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
  }

  async findOne(userId: string, id: string): Promise<PaymentMethod> {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    return paymentMethod;
  }

  async update(
    userId: string,
    id: string,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const existing = await this.prisma.paymentMethod.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Payment method not found');
    }

    if (updatePaymentMethodDto.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return this.prisma.paymentMethod.update({
      where: { id },
      data: {
        ...(updatePaymentMethodDto.name && {
          name: updatePaymentMethodDto.name,
        }),
        ...(updatePaymentMethodDto.type && {
          type: updatePaymentMethodDto.type,
        }),
        ...(updatePaymentMethodDto.lastFourDigits !== undefined && {
          lastFourDigits: updatePaymentMethodDto.lastFourDigits,
        }),
        ...(updatePaymentMethodDto.bankName !== undefined && {
          bankName: updatePaymentMethodDto.bankName,
        }),
        ...(updatePaymentMethodDto.icon !== undefined && {
          icon: updatePaymentMethodDto.icon,
        }),
        ...(updatePaymentMethodDto.color !== undefined && {
          color: updatePaymentMethodDto.color,
        }),
        ...(updatePaymentMethodDto.isDefault !== undefined && {
          isDefault: updatePaymentMethodDto.isDefault,
        }),
        ...(updatePaymentMethodDto.isActive !== undefined && {
          isActive: updatePaymentMethodDto.isActive,
        }),
      },
    });
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    const existing = await this.prisma.paymentMethod.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Payment method not found');
    }

    await this.prisma.paymentMethod.delete({
      where: { id },
    });

    return { message: 'Payment method deleted successfully' };
  }
}
