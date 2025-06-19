import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailConfirmedPropertyToUser1742574099943 implements MigrationInterface {
    name = 'AddEmailConfirmedPropertyToUser1742574099943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isEmailConfirmed" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isEmailConfirmed"`);
    }

}
