import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidationCodeRequest } from '../../entities/validation-code-request/validation-code-request.entity';
import { User } from '../../entities/user/user.entity';
import { PasswordEncryptionService } from '../../shared/services/password-encryption.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(ValidationCodeRequest)
    private readonly validationCodeRequestRepository: Repository<ValidationCodeRequest>,
    private readonly userService: UserService,
    private readonly passwordEncryptionService: PasswordEncryptionService,
    private readonly jwtService: JwtService,
  ) {}

  async confirmRequestValidationToken(code: string) {
    const vcr = await this.validationCodeRequestRepository.findOne({
      where: { code: code },
    });

    if (!vcr) {
      throw new NotFoundException(`Token de confirmación no encontrado`);
    }

    if (new Date() > new Date(vcr.expDate)) {
      throw new NotFoundException(`Token de confirmación expirado`);
    }

    const existingUser = await this.userService.findUserByEmail(vcr.userEmail);

    if (!existingUser) {
      throw new NotFoundException(`Token de confirmación inválido`);
    }

    existingUser.isEmailConfirmed = true;
    await this.userService.updateUser(existingUser);
    await this.validationCodeRequestRepository.delete(vcr);
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);

    if (
      user != null &&
      (await this.passwordEncryptionService.comparePassword(
        password,
        user.password,
      ))
    ) {
      return user;
    } else return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException(`Usuario o contraseña inválidos`);
    }

    const payload: PayloadDto = { email: user.email, sub: user.id };

    console.log(process.env.JWT_SECRET);

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '5m',
        secret: process.env.JWT_SECRET,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      }),
    };
  }

  refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<PayloadDto>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const newPayload: PayloadDto = {
        email: payload.email,
        sub: payload.sub,
      };
      return {
        access_token: this.jwtService.sign(newPayload, {
          expiresIn: '5m',
          secret: process.env.JWT_SECRET,
        }),
        refresh_token: this.jwtService.sign(newPayload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_SECRET,
        }),
      };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
