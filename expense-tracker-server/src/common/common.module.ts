import { Module, Global } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';

@Global()
@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AttachmentController, ReminderController],
  providers: [AttachmentService, ReminderService],
  exports: [AttachmentService, ReminderService],
})
export class CommonModule {}
