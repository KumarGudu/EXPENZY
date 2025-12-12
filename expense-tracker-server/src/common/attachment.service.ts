import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AttachmentService {
  private readonly logger = new Logger(AttachmentService.name);
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
  ];

  constructor(private prisma: PrismaService) {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed. Allowed types: ${this.allowedMimeTypes.join(', ')}`,
      );
    }
  }

  /**
   * Create attachment record in database
   */
  async create(dto: CreateAttachmentDto, userId: string) {
    return this.prisma.attachment.create({
      data: {
        userId,
        entityType: dto.entityType,
        entityId: dto.entityId,
        fileName: dto.fileName,
        fileUrl: dto.fileUrl,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
      },
    });
  }

  /**
   * Upload file and create attachment record
   */
  async uploadFile(
    file: Express.Multer.File,
    entityType: string,
    entityId: string,
    userId: string,
  ) {
    this.validateFile(file);

    const fileUrl = `/uploads/${file.filename}`;

    const attachment = await this.create(
      {
        entityType: entityType as CreateAttachmentDto['entityType'],
        entityId,
        fileName: file.originalname,
        fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
      },
      userId,
    );

    this.logger.log(
      `File uploaded: ${file.filename} for ${entityType}:${entityId}`,
    );
    return attachment;
  }

  /**
   * Find all attachments for an entity
   */
  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.attachment.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Find attachment by ID
   */
  async findOne(id: string, userId: string) {
    const attachment = await this.prisma.attachment.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    return attachment;
  }

  /**
   * Delete attachment
   */
  async remove(id: string, userId: string) {
    const attachment = await this.findOne(id, userId);

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), attachment.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      this.logger.log(`Deleted file: ${filePath}`);
    }

    // Delete database record
    await this.prisma.attachment.delete({
      where: { id },
    });

    return { message: 'Attachment deleted successfully' };
  }

  /**
   * Get file path for serving
   */
  getFilePath(filename: string): string {
    return path.join(this.uploadsDir, filename);
  }
}
