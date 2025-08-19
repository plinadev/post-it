import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { FirebaseAuthGuard } from 'src/firebase/guards/auth.guard';
import type { RequestWithUser } from 'src/types/request-with-user';

@Controller('comments')
@UseGuards(FirebaseAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId')
  async createComment(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
    @Body('content') content: string,
    @Body('parentId') parentId?: string | null,
  ) {
    const userId = req.user.uid;
    return this.commentsService.createComment(
      userId,
      postId,
      content,
      parentId,
    );
  }

  @Patch(':commentId')
  async updateComment(
    @Req() req: RequestWithUser,
    @Param('commentId') commentId: string,
    @Body('content') content: string,
  ) {
    const userId = req.user.uid;
    return this.commentsService.updateComment(userId, commentId, content);
  }

  @Delete(':commentId')
  async deleteComment(
    @Req() req: RequestWithUser,
    @Param('commentId') commentId: string,
  ) {
    const userId = req.user.uid;
    return this.commentsService.deleteComment(userId, commentId);
  }

  @Get(':postId')
  async getCommentsForPost(@Param('postId') postId: string) {
    return this.commentsService.getCommentsForPost(postId);
  }
}
