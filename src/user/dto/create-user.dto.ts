import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: '이름',
        default: '양한동'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: '이메일',
        default: 'smiletap.corp@gmail.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: '패스워드 최소 8자리 및 특수문자 입력해야합니다.',
        default: 'a1234567!',
      }) //swag적용
    @IsString()
    @MinLength(8) 
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)

    password?: string;


}
