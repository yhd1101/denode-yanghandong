import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUserInterface } from './requestWithUser.interface';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('token')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: '로그인',
    description: '로그인 api입니다 로그인 성공하면 토큰을 자물쇠에 넣어주세요'
  })
  @ApiBody({ type : LoginUserDto})
  @ApiResponse({ status: 200, description: '로그인 성공' })
  @ApiResponse({ status: 400, description: '비밀번호가 일치하지 않습니다'})
  @ApiResponse({ status: 404, description: '존재하지 않는 이메일입니다' })
  async login(@Req() req: RequestWithUserInterface) {
    const user = req.user;
    const token = await this.authService.generateAceessToken(user.id);
    return { token, user};
  }
}
