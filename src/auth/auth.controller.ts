import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUserInterface } from './requestWithUser.interface';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('token')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type : LoginUserDto})
  async login(@Req() req: RequestWithUserInterface) {
    const user = req.user;
    const token = await this.authService.generateAceessToken(user.id);
    return { token, user};
  }
}
