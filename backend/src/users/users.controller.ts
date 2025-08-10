import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/firebase/guards/auth.guard';
import { UsersService } from './users.service';
import type { RequestWithUser } from 'src/types/request-with-user';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('me/set-username')
  setUsername(
    @Request() req: RequestWithUser,
    @Body('username') username: string,
  ) {
    return this.usersService.setUsername(req.user.uid, username);
  }

  @Post('me/change-password')
  changePassword(
    @Request() req: RequestWithUser,
    @Body('username') password: string,
  ) {
    return this.usersService.changePassword(req.user.uid, password);
  }
}
