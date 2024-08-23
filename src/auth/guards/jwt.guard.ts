import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    console.log('user', user);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
