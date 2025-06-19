import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUsers1743226487892 implements MigrationInterface {
    name = 'AddRoleToUsers1743226487892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "role" integer NOT NULL DEFAULT '2'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    }

}
