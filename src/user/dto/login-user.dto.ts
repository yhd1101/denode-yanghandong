import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginUserDto{
    @ApiProperty({
        description: '이메일',
        default: 'smiletap.corp@gmail.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: '패스워드',
        default: 'a1234567!',
      })
      @IsString()
      password: string;

}