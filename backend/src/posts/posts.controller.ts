import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FirebaseAuthGuard } from 'src/firebase/guards/auth.guard';
import type { RequestWithUser } from 'src/types/request-with-user';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from 'src/interceptors/file.interceptor';

@Controller('posts')
@UseGuards(FirebaseAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    new FileInterceptor('photo', 1, {
      limits: { fieldSize: 10 * 1024 * 1024 },
    }),
  )
  async createPost(
    @Req() req: RequestWithUser,
    @Body() dto: CreatePostDto,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    const userId = req.user.uid;
    return this.postsService.createPost(userId, dto, photo);
  }

  @Patch(':postId')
  @UseInterceptors(
    new FileInterceptor('photo', 1, {
      limits: { fieldSize: 10 * 1024 * 1024 },
    }),
  )
  async editPost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
    @Body() dto: Partial<CreatePostDto>,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    const userId = req.user.uid;

    return this.postsService.editPost(userId, postId, dto, photo);
  }

  @Get(':postId')
  async getPostById(@Param('postId') postId: string) {
    return this.postsService.getPostById(postId);
  }

  @Get('user/:userId')
  async getPostsByUserId(@Param('userId') userId: string) {
    return this.postsService.getPostsByUserId(userId);
  }

  @Delete(':postId')
  async deletePost(
    @Req() req: RequestWithUser,
    @Param('postId') postId: string,
  ) {
    const userId = req.user.uid;
    return this.postsService.deletePost(userId, postId);
  }
}
