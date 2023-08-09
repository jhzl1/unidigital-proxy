import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['access-token'];

    console.log('petition');

    if (accessToken === process.env.API_ACCESS_KEY) {
      next();

      return;
    }

    throw new UnauthorizedException();
  }
}
