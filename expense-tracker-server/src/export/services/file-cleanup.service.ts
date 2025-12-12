import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileCleanupService {
    private readonly logger = new Logger(FileCleanupService.name);
    private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'exports');
    private readonly TTL_MINUTES = 15;

    /**
     * Cron job runs every 5 minutes to clean up old files
     */
    @Cron(CronExpression.EVERY_5_MINUTES)
    async cleanupOldFiles(): Promise<void> {
        try {
            if (!fs.existsSync(this.uploadsDir)) {
                return;
            }

            const files = fs.readdirSync(this.uploadsDir);
            const now = Date.now();
            let deletedCount = 0;

            for (const file of files) {
                const filepath = path.join(this.uploadsDir, file);
                const stats = fs.statSync(filepath);
                const ageMinutes = (now - stats.mtimeMs) / (1000 * 60);

                if (ageMinutes > this.TTL_MINUTES) {
                    fs.unlinkSync(filepath);
                    deletedCount++;
                    this.logger.debug(`Deleted old export file: ${file}`);
                }
            }

            if (deletedCount > 0) {
                this.logger.log(
                    `Cleanup completed: ${deletedCount} file(s) deleted (older than ${this.TTL_MINUTES} minutes)`,
                );
            }
        } catch (error) {
            this.logger.error(`Error during file cleanup: ${error.message}`);
        }
    }

    /**
     * Manually delete a specific file
     */
    async deleteFile(filename: string): Promise<boolean> {
        try {
            const filepath = path.join(this.uploadsDir, filename);
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
                this.logger.log(`Manually deleted file: ${filename}`);
                return true;
            }
            return false;
        } catch (error) {
            this.logger.error(`Error deleting file ${filename}: ${error.message}`);
            return false;
        }
    }
}
