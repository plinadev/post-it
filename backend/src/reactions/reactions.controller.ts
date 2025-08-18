import {
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/firebase/guards/auth.guard';
import type { RequestWithUser } from 'src/types/request-with-user';
import { ReactionsService } from './reactions.service';

@Controller('reactions')
@UseGuards(FirebaseAuthGuard)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post(':postId/like')
  async likePost(@Param('postId') postId: string, @Req() req: RequestWithUser) {
    const userId = req.user.uid;
    return this.reactionsService.addOrUpdateReaction(userId, postId, 'like');
  }

  @Post(':postId/dislike')
  async dislikePost(
    @Param('postId') postId: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.uid;
    return this.reactionsService.addOrUpdateReaction(userId, postId, 'like');
  }

  @Delete(':postId')
  async removeReaction(
    @Param('postId') postId: string,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.uid;
    return this.reactionsService.removeReaction(userId, postId);
  }
}
