import {
  Body,
  Controller,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/firebase/guards/auth.guard';
import { UsersService } from './users.service';
import type { RequestWithUser } from 'src/types/request-with-user';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';

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
  @Put('me/update')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @Request() req: RequestWithUser,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user.uid, body, avatar);
  }
}
