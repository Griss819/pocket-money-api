import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    synchronize: false,
});

// export const AppDataSource = new DataSource({
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'pocketAdmin',
//     password: 'Waydims33241213',
//     database: 'pocket-money-bd',
//     entities: [__dirname + '../entities/**/*.entity{.ts,.js}'],
//     migrations: [__dirname + '/../migrations/*{.ts,.js}'],
//     synchronize: false,
// });
