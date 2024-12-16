import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '../../users/entities/user.entity';
import { TokenExpiredError } from 'jsonwebtoken';
import { UsersService } from '../../users/services/users.service';
import { AuthenticationErrors } from '../enums/authentication-messages.enum';

type JwtPayload = Pick<UserEntity, 'id' | 'roles'> & {
  iat: number;
  exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.accessTokenSecret'),
    });
  }

  handleRequest(err, user, info: Error) {
    if (info instanceof TokenExpiredError) {
      // do stuff when token is expired
      console.log('token expired');
    }
    return user;
  }

  public async validate(payload: JwtPayload) {
    if (!payload.id) {
      throw new UnauthorizedException(AuthenticationErrors.INVALID_TOKEN);
    }

    return await this.userService.findByIdForAuth(payload.id);
  }
}
