import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshGuard implements CanActivate {
  private refsecret = process.env.REFRESH_KEY;
  constructor(private jwtServoice: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    let request: Request = context.switchToHttp().getRequest();
    let { refreshToken } = request.body;

    if (!refreshToken) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      let data = this.jwtServoice.verify(refreshToken, {
        secret: this.refsecret,
      });
      request['user'] = data;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
