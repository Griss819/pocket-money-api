import { AppDataSource } from '../config/typeorm.config';
import { User } from '../entities/user/user.entity';
import { PasswordEncryptionService } from './services/password-encryption.service';
import { UserRoleType } from './enums/user-role-type.enum';

async function seedDefaultUser() {
  await AppDataSource.initialize();

  const userRepository = AppDataSource.getRepository(User);
  const passwordEncryptionService = new PasswordEncryptionService();
  const defaultUser = await userRepository.findOne({
    where: { email: 'admin@pocketmoney.com' },
  });

  if (!defaultUser) {
    const user = new User();
    user.name = 'admin';
    user.email = 'admin@pocketmoney.com';
    user.isEmailConfirmed = true;
    user.role = UserRoleType.Admin;
    user.password = await passwordEncryptionService.hashPassword(
      'ImASkatMan33241213@lamadrequetepario.com',
    );
    await userRepository.save(user);
    console.log('Usuario por defecto creado.');
  } else {
    console.log('El usuario por defecto ya existe.');
  }

  await AppDataSource.destroy();
}

seedDefaultUser().catch((error) => console.error(error));
