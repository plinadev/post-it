import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import { RequestWithUser } from 'src/types/request-with-user';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(token, true);
      request.user = decodedToken;
      return true;
    } catch (err) {
      console.error('Firebase token verification failed:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
