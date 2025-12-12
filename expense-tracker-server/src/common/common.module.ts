import { Module, Global } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/temp',
    }),
  ],
  controllers: [AttachmentController, ReminderController],
  providers: [AttachmentService, ReminderService, EmailService],
  exports: [AttachmentService, ReminderService, EmailService],
})
export class CommonModule {}
