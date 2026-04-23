import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCampusStatus1776915442883 implements MigrationInterface {
    name = 'UpdateCampusStatus1776915442883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "campuses" RENAME COLUMN "active" TO "status"`);
        await queryRunner.query(`ALTER TYPE "public"."campuses_active_enum" RENAME TO "campuses_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."campuses_status_enum" RENAME TO "campuses_active_enum"`);
        await queryRunner.query(`ALTER TABLE "campuses" RENAME COLUMN "status" TO "active"`);
    }

}
