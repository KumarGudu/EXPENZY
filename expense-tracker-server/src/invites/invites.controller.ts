import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload.interface';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Get(':token')
  getInviteDetails(@Param('token') token: string) {
    return this.invitesService.getInviteDetails(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':token/accept')
  acceptInvite(@Param('token') token: string, @CurrentUser() user: JwtPayload) {
    return this.invitesService.acceptInvite(token, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':token/resend')
  resendInvite(@Param('token') token: string, @CurrentUser() user: JwtPayload) {
    return this.invitesService.resendInvite(token, user.userId);
  }
}
