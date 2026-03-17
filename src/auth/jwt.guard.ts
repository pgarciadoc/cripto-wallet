/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new ForbiddenException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const token = authHeader.split(' ')[1];

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const payload = this.jwt.verify(token);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.user = payload;
      return true;
    } catch {
      throw new ForbiddenException();
    }
  }
}
