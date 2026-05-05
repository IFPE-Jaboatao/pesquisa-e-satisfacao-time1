import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1777950021060 implements MigrationInterface {
    name = 'InitialMigration1777950021060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."classes_active_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "classes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "semester" integer NOT NULL, "year" integer NOT NULL, "active" "public"."classes_active_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "course_id" uuid, CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."disciplines_active_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "disciplines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "workload" integer NOT NULL, "active" "public"."disciplines_active_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "course_id" uuid, CONSTRAINT "PK_9b25ea6da0741577a73c9e90aad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."courses_active_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "active" "public"."courses_active_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "campus_id" uuid, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."campuses_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "campuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "address" character varying NOT NULL, "status" "public"."campuses_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d6a06870edd505bfc2d002cb728" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."services_active_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "active" "public"."services_active_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "campus_id" uuid, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."audit_logs_action_enum" AS ENUM('INSERT', 'UPDATE', 'DELETE')`);
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying, "action" "public"."audit_logs_action_enum" NOT NULL, "entity" character varying NOT NULL, "entity_id" character varying, "old_values" jsonb, "new_values" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_profiles" ("user_id" uuid NOT NULL, "profile_id" uuid NOT NULL, CONSTRAINT "PK_2f0bbd2659d46a1a4a86f6a5eab" PRIMARY KEY ("user_id", "profile_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6ca9503d77ae39b4b5a6cc3ba8" ON "user_profiles" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_acac04b2506d607942b566710e" ON "user_profiles" ("profile_id") `);
        await queryRunner.query(`ALTER TABLE "classes" ADD CONSTRAINT "FK_bd4c6c725acd427f07264770ceb" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "disciplines" ADD CONSTRAINT "FK_55017c53c96d6a089d0e10aa4f8" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_ef7bdde8beabe797415726e84c9" FOREIGN KEY ("campus_id") REFERENCES "campuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services" ADD CONSTRAINT "FK_bdee1f7825a30fcdf59ed166fb9" FOREIGN KEY ("campus_id") REFERENCES "campuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_acac04b2506d607942b566710e1" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_acac04b2506d607942b566710e1"`);
        await queryRunner.query(`ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_6ca9503d77ae39b4b5a6cc3ba88"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_bdee1f7825a30fcdf59ed166fb9"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_ef7bdde8beabe797415726e84c9"`);
        await queryRunner.query(`ALTER TABLE "disciplines" DROP CONSTRAINT "FK_55017c53c96d6a089d0e10aa4f8"`);
        await queryRunner.query(`ALTER TABLE "classes" DROP CONSTRAINT "FK_bd4c6c725acd427f07264770ceb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_acac04b2506d607942b566710e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ca9503d77ae39b4b5a6cc3ba8"`);
        await queryRunner.query(`DROP TABLE "user_profiles"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
        await queryRunner.query(`DROP TYPE "public"."audit_logs_action_enum"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TYPE "public"."services_active_enum"`);
        await queryRunner.query(`DROP TABLE "campuses"`);
        await queryRunner.query(`DROP TYPE "public"."campuses_status_enum"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP TYPE "public"."courses_active_enum"`);
        await queryRunner.query(`DROP TABLE "disciplines"`);
        await queryRunner.query(`DROP TYPE "public"."disciplines_active_enum"`);
        await queryRunner.query(`DROP TABLE "classes"`);
        await queryRunner.query(`DROP TYPE "public"."classes_active_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
    }

}
