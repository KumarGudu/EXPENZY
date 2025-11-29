import { Controller, Get, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('user-settings')
@UseGuards(JwtAuthGuard)
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  getSettings(@Req() req: AuthenticatedRequest) {
    return this.userSettingsService.getOrCreate(req.user.userId);
  }

  @Patch()
  updateSettings(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.userSettingsService.update(
      req.user.userId,
      updateUserSettingsDto,
    );
  }
}
