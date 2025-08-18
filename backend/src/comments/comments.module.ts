import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { CommentsService } from './comments.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [FirebaseModule],
})
export class CommentsModule {}
