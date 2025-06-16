import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  // user.service.ts
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {email: createUserDto.email},
    });
    if (user) {
      throw new BadRequestException('User email exits');
    }

    const newSignup =  await this.userRepository.create(createUserDto);
    await this.userRepository.save(newSignup);
    newSignup.password = undefined;
    return newSignup;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({id});
    if (!user) {
      throw new NotFoundException('No user id');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email});
    if (!user) {
      throw new NotFoundException('No user email')
    }
    return user;
  }
}
