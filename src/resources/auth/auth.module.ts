import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordEncryptionService } from '../../shared/services/password-encryption.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user/user.entity';
import { ValidationCodeRequest } from '../../entities/validation-code-request/validation-code-request.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, ValidationCodeRequest]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordEncryptionService,
    UserService,
    JwtStrategy,
    JwtService,
  ],
})
export class AuthModule {}
