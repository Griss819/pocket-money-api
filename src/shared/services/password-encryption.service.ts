import {Injectable} from "@nestjs/common";
import * as argon2 from 'argon2';

@Injectable()
export class PasswordEncryptionService {

    async hashPassword(password: string): Promise<string> {
        return argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4,
        });
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return argon2.verify(hashedPassword, password);
    }
}
