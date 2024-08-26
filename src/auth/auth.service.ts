import { CreateUserDto } from './../user/dto/create-user.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { verify } from 'argon2';
import { Response } from 'express';

@Injectable()
export class AuthService {
  EXPIRE_DAY_REFRESH_TOKEN = 1;
  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private jwt: JwtService,
    private userService: UserService,
  ) {}

  async login(dto: AuthDto) {
    const { password, Responsible, ...user } = await this.validateUser(dto);

    if (!user.active) throw new ForbiddenException('user is not activated');

    const tokens = this.issueTokens(user.id, user.roleId, user?.responsibleId);
    return {
      user,
      ...tokens,
    };
  }

  async register(dto: CreateUserDto) {
    const isUserExist = await this.userService.getByLogin(dto.login);

    if (isUserExist) throw new BadRequestException('user already exists');

    const { password, ...user } = await this.userService.create(dto);

    const tokens = this.issueTokens(user.id, user.roleId, user?.responsibleId);

    return {
      user,
      ...tokens,
    };
  }

  private issueTokens(userId: string, roleId: number, responsibleId: string) {
    const data = { id: userId, roleId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByLogin(dto.login);

    if (!user) throw new NotFoundException('user not found');

    const isValid = await verify(user.password, dto.password);

    if (!isValid) throw new UnauthorizedException('invalid password');

    return { ...user, responsibleName: user?.Responsible?.name };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'http://10.100.4.156/',
      expires: expiresIn,
      secure: true,
      sameSite: 'none',
    });
  }

  removeRefreshTokenToResponse(res: Response) {
    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'http://10.100.4.156/',
      expires: new Date(0),
      secure: true,
      sameSite: 'none',
    });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const result = await this.jwt.verifyAsync(refreshToken);

      if (!result) throw new UnauthorizedException('Invalid refresh token');

      const { password, ...userResponse } = await this.userService.getById(
        result.id,
      );

      const tokens = this.issueTokens(
        userResponse.id,
        userResponse.roleId,
        userResponse?.responsibleId,
      );
      const { Responsible, ...user } = userResponse;
      return {
        user: {
          ...user,
          responsibleName: Responsible?.name,
        },
        ...tokens,
      };
    } catch (err) {
      throw new UnauthorizedException('invalid token ');
    }
  }
}
