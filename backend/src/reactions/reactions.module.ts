import { Module } from '@nestjs/common';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService],
  imports: [FirebaseModule],
})
export class ReactionsModule {}
