import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: admin.app.App;

  onModuleInit() {
    if (!admin.apps.length) {
      try {
        const serviceAccount = JSON.parse(
          process.env.FIREBASE_ADMIN_SDK as string,
        ) as ServiceAccount;
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),

          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
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
