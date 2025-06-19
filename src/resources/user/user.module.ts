import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user/user.entity';
import { ValidationCodeRequest } from '../../entities/validation-code-request/validation-code-request.entity';
import { PasswordEncryptionService } from '../../shared/services/password-encryption.service';
import { MailService } from '../../shared/services/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ValidationCodeRequest])],
  controllers: [UserController],
  exports: [],
  providers: [UserService, PasswordEncryptionService, MailService],
})
export class UserModule {}
