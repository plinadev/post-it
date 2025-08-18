import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { EditPostDto } from './dto/edit-post.dto';

@Controller('posts')
@UseGuards(FirebaseAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('suggestions')
  async getSuggestions(
    @Query('q') query: string,
    @Query('limit') limit?: number,
  ) {
    return this.postsService.getSearchSuggestions(query, limit);
  }

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
    @Body() dto: Partial<EditPostDto>,
    @UploadedFile() photo?: Express.Multer.File,
  ) {
    const userId = req.user.uid;

    return this.postsService.editPost(userId, postId, dto, photo);
  }

  @Get(':postId')
  async getPostById(@Param('postId') postId: string) {
    return this.postsService.getPostById(postId);
  }

  @Get()
  async getAllPosts(
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.postsService.getAllPosts(search, Number(page), Number(limit));
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
