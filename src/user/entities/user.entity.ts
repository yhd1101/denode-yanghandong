import { CommonEntity } from "src/common/entities/common.entity";
import { BeforeInsert, Column, Entity } from "typeorm";
import * as bcrypt from 'bcryptjs'; 
import { HttpException, HttpStatus, InternalServerErrorException } from "@nestjs/common";

@Entity()
export class User extends CommonEntity{
    @Column()
    public name: string;

    @Column({ unique: true})
    public email: string;

    @Column()
    public password: string;


    @BeforeInsert()
    async hashpassword() {
        try{
            const saltValue = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, saltValue);
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    //로그인할때 패스워드 인증
    async validatePassword(aPassword: string) {
        try {
            const isPasswordMatch = await bcrypt.compare(aPassword, this.password);
            return isPasswordMatch;
        }  catch (err) {
            console.log(err);
            throw new HttpException(err.message, HttpStatus.CONFLICT);
        }
    }
}
