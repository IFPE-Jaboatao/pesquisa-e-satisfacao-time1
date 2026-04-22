import { MigrationInterface, QueryRunner } from "typeorm";

export class AjustesTabelaUsuarioPerfil1776828336830 implements MigrationInterface {
    name = 'AjustesTabelaUsuarioPerfil1776828336830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "PK_2f0bbd2659d46a1a4a86f6a5eab" PRIMARY KEY ("user_id", "profile_id")`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_acac04b2506d607942b566710e1"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "profile_id" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_6ca9503d77ae39b4b5a6cc3ba8" ON "user_profiles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_acac04b2506d607942b566710e" ON "user_profiles" ("profile_id") `);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_acac04b2506d607942b566710e1" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_acac04b2506d607942b566710e1"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_acac04b2506d607942b566710e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ca9503d77ae39b4b5a6cc3ba8"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "profile_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_acac04b2506d607942b566710e1" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "PK_2f0bbd2659d46a1a4a86f6a5eab"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
