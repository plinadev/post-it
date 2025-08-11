import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    uid: string;
    email?: string;
  };
}
