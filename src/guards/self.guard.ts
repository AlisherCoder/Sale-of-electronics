import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    let request: Request = context.switchToHttp().getRequest();
    let user = request['user'];
    let { id } = request.params;

    if (user.id == id || user.role == 'ADMIN') {
      return true;
    }
    return false;
  }
}
