import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1742573397251 implements MigrationInterface {
    name = 'Initial1742573397251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "validation_code_request" ("id" SERIAL NOT NULL, "userEmail" character varying NOT NULL, "code" character varying NOT NULL, "expDate" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "UQ_56d5b6ae1261f026f2138468490" UNIQUE ("userEmail"), CONSTRAINT "UQ_da64bae1fdee362e60da72bdfda" UNIQUE ("code"), CONSTRAINT "PK_3b0cdbd0d87b479ea53ca8cdffe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "validation_code_request"`);
    }

}
