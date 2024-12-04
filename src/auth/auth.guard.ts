import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const rawToken = req.headers.authorization;

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 유효하지 않습니다.');
    }

    return true;
  }
}
