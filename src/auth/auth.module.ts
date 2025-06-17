import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthStrategy } from './strategies/local-auth.strategy';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [UserModule, ConfigModule, JwtModule.register({}) , PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy, JwtAuthStrategy],
})
export class AuthModule {}
