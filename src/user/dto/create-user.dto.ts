import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: '이름',
        default: '양한동'
    })
    @IsString({ message: '이름은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '이름을 꼭 입력해주세요.' })
    name: string;

    @ApiProperty({
        description: '이메일',
        default: 'smiletap.corp@gmail.com'
    })
    @IsEmail({}, { message: '이메일 형식 이어야 합니다.' })
    email: string;

    @ApiProperty({
        description: '패스워드 최소 8자리 및 특수문자 입력해야합니다.',
        default: 'a1234567!',
      }) //swag적용
    @IsString()
    @MinLength(8, { message: '비밀번호는 최소 8자리여야 합니다.' })
    @Matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/,
        {
          message:
            '비밀번호는 영문자, 숫자, 특수문자를 각각 최소 한 개씩 포함해야 합니다.',
        },
      )
    password?: string;


}
