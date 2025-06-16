import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from './tokenPayload.interface';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}


  async login(loginuserDto: LoginUserDto) {
    const user = await this.userService.getUserByEmail(loginuserDto.email);
    const isPasswordMatch = await user.validatePassword(loginuserDto.password);

    if (!isPasswordMatch) {
      throw new HttpException('Password do not matched',  HttpStatus.BAD_REQUEST);
    }
    user.password = undefined;
    return user;
  }



  // accesstoken 생성함수
  public generateAceessToken(userId: string) {
    const payload: TokenPayloadInterface = {userId};
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESSTOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.get('ACCESSTOKEN_EXPIRATION_TIME')}m`,
    })
    return accessToken;
  }
}
