import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordEncryptionService } from '../../shared/services/password-encryption.service';
import { ValidationCodeRequest } from '../../entities/validation-code-request/validation-code-request.entity';
import { UserRoleType } from '../../shared/enums/user-role-type.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ValidationCodeRequest)
    private readonly validationCodeRequestRepository: Repository<ValidationCodeRequest>,
    private readonly passwordEncryptionService: PasswordEncryptionService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ValidationCodeRequest> {
    const hashedPassword = await this.passwordEncryptionService.hashPassword(
      createUserDto.password,
    );

    const user = this.userRepository.create({
      ...createUserDto,
      role: UserRoleType.RegularUser,
      password: hashedPassword,
      isEmailConfirmed: false,
    });

    await this.userRepository.save(user);

    const now = new Date(Date.now());
    try {
      const vcr = this.validationCodeRequestRepository.create({
        userEmail: createUserDto.email,
        expDate: new Date(now.getTime() + 10 * 60 * 1000),
        code: this.generateRandomString(10),
      });
      return this.validationCodeRequestRepository.save(vcr);
    } catch {
      await this.deleteUser(user);
      throw new InternalServerErrorException();
    }
  }

  async updateUser(user: User) {
    await this.userRepository.save(user);
  }

  async deleteUser(user: User) {
    await this.userRepository.remove(user);
  }
  async deleteValidationCodeRequest(vcr: ValidationCodeRequest) {
    await this.validationCodeRequestRepository.remove(vcr);
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  private generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }

    return result;
  }
}
