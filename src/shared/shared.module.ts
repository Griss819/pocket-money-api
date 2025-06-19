import { Module } from '@nestjs/common';
import { PasswordEncryptionService } from './services/password-encryption.service';
import { MailService } from './services/mail.service';

@Module({
  providers: [PasswordEncryptionService, MailService],
})
export class SharedModule {}
