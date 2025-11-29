import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from '@prisma/client';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createTagDto: CreateTagDto): Promise<Tag> {
    const existing = await this.prisma.tag.findUnique({
      where: {
        userId_name: {
          userId,
          name: createTagDto.name,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Tag with this name already exists');
    }

    return this.prisma.tag.create({
      data: {
        userId,
        name: createTagDto.name,
        color: createTagDto.color,
      },
    });
  }

  async findAll(userId: string): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(userId: string, id: string): Promise<Tag> {
    const tag = await this.prisma.tag.findFirst({
      where: { id, userId },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async update(
    userId: string,
    id: string,
    updateTagDto: UpdateTagDto,
  ): Promise<Tag> {
    const existing = await this.prisma.tag.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Tag not found');
    }

    if (updateTagDto.name) {
      const duplicate = await this.prisma.tag.findFirst({
        where: {
          userId,
          name: updateTagDto.name,
          id: { not: id },
        },
      });

      if (duplicate) {
        throw new ConflictException('Tag with this name already exists');
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data: {
        ...(updateTagDto.name && { name: updateTagDto.name }),
        ...(updateTagDto.color !== undefined && { color: updateTagDto.color }),
      },
    });
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    const existing = await this.prisma.tag.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Tag not found');
    }

    await this.prisma.tag.delete({
      where: { id },
    });

    return { message: 'Tag deleted successfully' };
  }

  async attachToExpense(
    userId: string,
    expenseId: string,
    tagId: string,
  ): Promise<{ message: string }> {
    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId, userId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    const tag = await this.prisma.tag.findFirst({
      where: { id: tagId, userId },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    await this.prisma.expenseTag.create({
      data: {
        expenseId,
        tagId,
      },
    });

    return { message: 'Tag attached to expense successfully' };
  }

  async detachFromExpense(
    userId: string,
    expenseId: string,
    tagId: string,
  ): Promise<{ message: string }> {
    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId, userId },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    await this.prisma.expenseTag.delete({
      where: {
        expenseId_tagId: {
          expenseId,
          tagId,
        },
      },
    });

    return { message: 'Tag detached from expense successfully' };
  }
}
