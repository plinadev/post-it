import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    if (!admin.apps.length) {
      try {
        const adminSdkJson = process.env.ADMIN_SDK;
        if (!adminSdkJson) {
          throw new Error('FIREBASE_ADMIN_SDK environment variable is not set');
        }

        const serviceAccount = JSON.parse(adminSdkJson) as ServiceAccount;
        const projectId = process.env.PROJECT_ID;
        const storageBucket = process.env.STORAGE_BUCKET;

        if (!projectId || !storageBucket) {
          throw new Error(
            'Firebase environment variables are not properly configured',
          );
        }

        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: projectId,
          storageBucket: storageBucket,
        });

        console.log('Firebase Admin initialized successfully!');
      } catch (error) {
        console.error('Error initializing Firebase Admin: ', error);
        throw error;
      }
    } else {
      this.firebaseApp = admin.apps[0] as admin.app.App;
    }
  }

  getFirebaseAdmin(): admin.app.App {
    return this.firebaseApp;
  }

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }

  getFirestore(): admin.firestore.Firestore {
    return admin.firestore();
  }

  getStorage(): admin.storage.Storage {
    return admin.storage();
  }
}
