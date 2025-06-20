import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class ResourcesModule {}
