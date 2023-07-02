import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;
    if (bearerToken == null) throw new ForbiddenException();

    const accessToken = bearerToken.substring(7, bearerToken.length);
    const user: User = await this.userService.verifyToken(accessToken);

    if (user) {
      request.user = user;
      return true;
    }
    return false;
  }
}
