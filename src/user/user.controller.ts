import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입 api입니다'
  })
  @ApiResponse({ status: 201, description: '회원가입 완료 메세지' })
  @ApiResponse({ status: 400, description: '유효성 검사 실패 (이름, 이메일, 비밀번호 등)' })
  async signup(@Body() createUserDto: CreateUserDto) {
    const newSignup = await this.userService.signup(createUserDto);
    return newSignup;
  }
}
