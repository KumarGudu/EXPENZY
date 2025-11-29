import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

interface GoogleProfile {
  id: string;
  emails?: Array<{ value: string; verified?: boolean }>;
  name?: { givenName?: string; familyName?: string };
  photos?: Array<{ value: string }>;
  displayName?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        passwordHash: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phone: createUserDto.phone,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { isDeleted: false },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const updateData: Record<string, string | undefined> = {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      phone: updateUserDto.phone,
    };

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateData.passwordHash = hashedPassword;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async validateGoogleUser(profile: GoogleProfile) {
    const email = profile.emails?.[0]?.value;
    const firstName = profile.name?.givenName;
    const lastName = profile.name?.familyName;
    const avatar = profile.photos?.[0]?.value;

    if (!email) {
      throw new BadRequestException('Email not provided by Google');
    }

    // Check if user exists with googleId
    let user = await this.prisma.user.findUnique({
      where: { googleId: profile.id },
    });

    if (user) {
      return user;
    }

    // Check if user exists with email
    user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Link googleId to existing user
      return this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: profile.id,
          avatar: avatar || user.avatar,
          lastLoginAt: new Date(),
        },
      });
    }

    // Create new user
    const username = email.split('@')[0] || 'user';
    return this.prisma.user.create({
      data: {
        email,
        username: `${username}_${Math.floor(Math.random() * 1000)}`,
        googleId: profile.id,
        avatar,
        firstName,
        lastName,
        isVerified: true,
        lastLoginAt: new Date(),
      },
    });
  }
}
