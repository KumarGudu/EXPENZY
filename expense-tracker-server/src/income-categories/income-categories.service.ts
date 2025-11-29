import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncomeCategoryDto } from './dto/create-income-category.dto';
import { UpdateIncomeCategoryDto } from './dto/update-income-category.dto';
import { IncomeCategory } from '@prisma/client';

@Injectable()
export class IncomeCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    createIncomeCategoryDto: CreateIncomeCategoryDto,
  ): Promise<IncomeCategory> {
    const existing = await this.prisma.incomeCategory.findUnique({
      where: {
        userId_name: {
          userId,
          name: createIncomeCategoryDto.name,
        },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Income category with this name already exists',
      );
    }

    return this.prisma.incomeCategory.create({
      data: {
        userId,
        name: createIncomeCategoryDto.name,
        icon: createIncomeCategoryDto.icon,
        color: createIncomeCategoryDto.color,
        isSystem: createIncomeCategoryDto.isSystem || false,
      },
    });
  }

  async findAll(
    userId: string,
    includeSystem: boolean = true,
  ): Promise<IncomeCategory[]> {
    return this.prisma.incomeCategory.findMany({
      where: {
        OR: [
          { userId },
          ...(includeSystem ? [{ isSystem: true, userId: null }] : []),
        ],
      },
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
    });
  }

  async findOne(userId: string, id: string): Promise<IncomeCategory> {
    const category = await this.prisma.incomeCategory.findFirst({
      where: {
        id,
        OR: [{ userId }, { isSystem: true, userId: null }],
      },
    });

    if (!category) {
      throw new NotFoundException('Income category not found');
    }

    return category;
  }

  async update(
    userId: string,
    id: string,
    updateIncomeCategoryDto: UpdateIncomeCategoryDto,
  ): Promise<IncomeCategory> {
    const existing = await this.prisma.incomeCategory.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException(
        'Income category not found or you do not have permission to update it',
      );
    }

    if (existing.isSystem) {
      throw new ConflictException('Cannot update system categories');
    }

    if (updateIncomeCategoryDto.name) {
      const duplicate = await this.prisma.incomeCategory.findFirst({
        where: {
          userId,
          name: updateIncomeCategoryDto.name,
          id: { not: id },
        },
      });

      if (duplicate) {
        throw new ConflictException(
          'Income category with this name already exists',
        );
      }
    }

    return this.prisma.incomeCategory.update({
      where: { id },
      data: {
        ...(updateIncomeCategoryDto.name && {
          name: updateIncomeCategoryDto.name,
        }),
        ...(updateIncomeCategoryDto.icon !== undefined && {
          icon: updateIncomeCategoryDto.icon,
        }),
        ...(updateIncomeCategoryDto.color !== undefined && {
          color: updateIncomeCategoryDto.color,
        }),
      },
    });
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    const existing = await this.prisma.incomeCategory.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException(
        'Income category not found or you do not have permission to delete it',
      );
    }

    if (existing.isSystem) {
      throw new ConflictException('Cannot delete system categories');
    }

    await this.prisma.incomeCategory.delete({
      where: { id },
    });

    return { message: 'Income category deleted successfully' };
  }
}
