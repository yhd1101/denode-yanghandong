
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from 'src/user/user.service';
import { TokenPayloadInterface } from '../tokenPayload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UserService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //토큰을 헤더이담겨줌 (bearToken)
      secretOrKey: configService.get('ACCESSTOKEN_SECRET_KEY'), //검증키 (열쇠같은거)
    });
  }

  async validate(payload: TokenPayloadInterface) {
    return this.usersService.getUserById(payload.userId);
  }
}
