import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { FirebaseService } from 'src/firebase/firebase.service';
import * as admin from 'firebase-admin';
import { Reaction } from 'src/types/reaction';
import { Post } from 'src/types/post';
type ReactionType = 'like' | 'dislike';
@Injectable()
export class ReactionsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async addOrUpdateReaction(
    userId: string,
    postId: string,
    type: ReactionType,
  ) {
    const db = this.firebaseService.getFirestore();
    const postRef = db.collection('posts').doc(postId);
    const reactionId = `${postId}_${userId}`;
    const reactionRef = db.collection('reactions').doc(reactionId);

    return db.runTransaction(async (t) => {
      const postSnap = await t.get(postRef);
      if (!postSnap.exists) {
        throw new NotFoundError('Post not found');
      }

      const postData = postSnap.data() as Post;
      const reactionSnap = await t.get(reactionRef);

      let likesCount = postData.likesCount || 0;
      let dislikesCount = postData.dislikesCount || 0;

      if (!reactionSnap.exists) {
        //create new reaction
        const newReaction = {
          id: reactionId,
          postId,
          userId,
          type,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        t.set(reactionRef, newReaction);

        if (type === 'like') likesCount++;
        else if (type === 'dislike') dislikesCount++;
      } else {
        //update existing reaction
        const oldReaction = reactionSnap.data() as Reaction;
        if (oldReaction.type === type) {
          throw new BadRequestException(`You already ${type}d this post`);
        }

        //switch reaction
        t.update(reactionRef, { type });

        if (oldReaction.type === 'like') {
          likesCount--;
          dislikesCount++;
        } else if (oldReaction.type === 'dislike') {
          dislikesCount--;
          likesCount++;
        }

        t.update(postRef, { likesCount, dislikesCount });

        return { postId, userId, type, likesCount, dislikesCount };
      }
    });
  }

  async removeReaction(userId: string, postId: string) {
    const db = this.firebaseService.getFirestore();

    const postRef = db.collection('posts').doc(postId);
    const reactionId = `${postId}_${userId}`;
    const reactionRef = db.collection('reactions').doc(reactionId);

    return db.runTransaction(async (t) => {
      const reactionSnap = await t.get(reactionRef);
      if (!reactionSnap.exists) {
        throw new NotFoundException('No reaction found for this post');
      }

      const reaction = reactionSnap.data() as Reaction;
      const postSnap = await t.get(postRef);
      if (!postSnap.exists) {
        throw new NotFoundException('Post not found');
      }

      const postData = postSnap.data() as Post;
      let likesCount = postData.likesCount || 0;
      let dislikesCount = postData.dislikesCount || 0;

      if (reaction.type === 'like') likesCount--;
      else if (reaction.type === 'dislike') dislikesCount--;

      t.delete(reactionRef);
      t.update(postRef, { likesCount, dislikesCount });

      return { postId, userId, likesCount, dislikesCount };
    });
  }
}
