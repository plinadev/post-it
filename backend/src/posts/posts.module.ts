import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [FirebaseModule],
})
export class PostsModule {}
