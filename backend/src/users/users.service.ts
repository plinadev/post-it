import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) {}

  //set username
  async setUsername(uid: string, username: string) {
    const trimmed = username.trim();

    if (trimmed.length < 3) {
      throw new BadRequestException(
        'Username must be at least 3 characters long',
      );
    }

    try {
      const firestore = this.firebaseService.getFirestore();

      const existing = await firestore
        .collection('users')
        .where('username', '==', trimmed)
        .get();

      if (!existing.empty) {
        throw new ConflictException('Username is already taken');
      }

      await firestore
        .collection('users')
        .doc(uid)
        .set({ username: trimmed }, { merge: true });

      return {
        message: 'Username saved successfully',
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to set username');
    }
  }

  //change password
  async changePassword(uid: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }
    try {
      await this.firebaseService
        .getAuth()
        .updateUser(uid, { password: newPassword });
      return { message: 'Password updated successfully' };
    } catch (error: any) {
      throw new BadRequestException(
        error.message || 'Failed to update password',
      );
    }
  }
}
