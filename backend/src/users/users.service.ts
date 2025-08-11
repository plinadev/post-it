/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserData } from 'src/types/update-user-data';

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          error.message || 'Failed to update password',
        );
      }
      throw new BadRequestException('Failed to update password');
    }
  }

  //update user data

  async updateUser(
    uid: string,
    dto: UpdateUserDto,
    avatar?: Express.Multer.File,
  ) {
    const auth = this.firebaseService.getAuth();
    const db = this.firebaseService.getFirestore();

    // 1. Get current user
    const firebaseUser = await auth.getUser(uid);

    // 2. Validate username (if provided)
    if (dto.username) {
      // Check length, regex, uniqueness in Firestore "users" collection
      const usernameTaken = await this.checkUsernameExists(dto.username);
      if (usernameTaken && firebaseUser.displayName !== dto.username) {
        throw new ConflictException('Username is already taken');
      }
    }

    // 3. Email update logic
    if (dto.email && dto.email !== firebaseUser.email) {
      // Check if email exists (throws if taken)
      await this.checkEmailAvailable(dto.email);
      await auth.updateUser(uid, { email: dto.email });
    }

    // 4. Phone update logic
    if (dto.phone && dto.phone !== firebaseUser.phoneNumber) {
      await this.checkPhoneAvailable(dto.phone);
      await auth.updateUser(uid, { phoneNumber: dto.phone });
    }

    // 5. Avatar upload (if provided)
    let avatarUrl: string | undefined;
    if (avatar) {
      // Read current user doc to get old avatar URL
      const userDocRef = db.collection('users').doc(uid);
      const userDocSnap = await userDocRef.get();

      if (userDocSnap.exists) {
        const userData = userDocSnap.data();
        if (userData?.avatarUrl) {
          await this.deleteAvatarFile(userData.avatarUrl);
        }
      }

      avatarUrl = await this.uploadAvatar(uid, avatar);

      // Update avatarUrl in Firestore after upload
      await userDocRef.update({ avatarUrl });
    }

    // 6. Update Firestore user doc
    const userDocRef = db.collection('users').doc(uid);
    const updateData: UpdateUserData = {};
    if (dto.username) updateData.username = dto.username;
    if (dto.email) updateData.email = dto.email;
    if (dto.phone) updateData.phone = dto.phone;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;

    await userDocRef.update(updateData);

    return { message: 'User updated successfully', data: updateData };
  }

  async deleteUser(uid: string) {
    const auth = this.firebaseService.getAuth();
    const db = this.firebaseService.getFirestore();
    const storage = this.firebaseService.getStorage();

    // 1. Get user doc from Firestore
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new NotFoundException('User not found');
    }
    const userData = userDoc.data();

    // 2. Delete avatar from Storage if exists
    if (userData?.avatarUrl && typeof userData.avatarUrl === 'string') {
      try {
        const avatarUrl: string = userData.avatarUrl;
        const bucket = storage.bucket();
        const bucketName = bucket.name;

        const prefix = `https://storage.googleapis.com/${bucketName}/`;
        const filePath = avatarUrl.startsWith(prefix)
          ? avatarUrl.slice(prefix.length)
          : null;

        if (filePath) {
          const file = bucket.file(filePath);
          await file.delete();
        }
      } catch (err) {
        console.warn('Failed to delete avatar from storage:', err);
      }
    }

    // 3. Delete Firestore user doc
    await userRef.delete();

    // 4. Delete Firebase Auth user
    await auth.deleteUser(uid);

    return { message: 'User account deleted successfully' };
  }

  private async checkUsernameExists(username: string): Promise<boolean> {
    const db = this.firebaseService.getFirestore();

    const usernameLower = username.toLowerCase();
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef
      .where('username', '==', usernameLower)
      .limit(1)
      .get();

    return !querySnapshot.empty;
  }
  private async checkEmailAvailable(email: string) {
    const auth = this.firebaseService.getAuth();

    try {
      await auth.getUserByEmail(email);
      // If user is found, email is taken
      throw new ConflictException('Email is already taken');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return; // email is available
      }
      throw error;
    }
  }

  private async checkPhoneAvailable(phone: string) {
    const auth = this.firebaseService.getAuth();

    try {
      await auth.getUserByPhoneNumber(phone);
      throw new ConflictException('Phone number is already taken');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return;
      }
      throw error;
    }
  }

  private async uploadAvatar(
    uid: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const storage = this.firebaseService.getStorage();
    const bucket = storage.bucket();

    const fileName = `avatars/${uid}-${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Make file public or generate signed URL
    await fileUpload.makePublic();
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  }
  private async deleteAvatarFile(avatarUrl: string) {
    try {
      const storage = this.firebaseService.getStorage();
      const bucket = storage.bucket();

      const url = new URL(avatarUrl);
      const filePath = decodeURIComponent(
        url.pathname.replace(/^\/[^/]+/, '').substring(1),
      );

      const file = bucket.file(filePath);
      await file.delete();
    } catch (error) {
      console.warn('Failed to delete previous avatar file:', error);
    }
  }
}
