import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAuditLogsTable1712345678901 implements MigrationInterface {
  name = 'CreateAuditLogsTable1712345678901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "audit_logs_action_enum" AS ENUM ('INSERT', 'UPDATE', 'DELETE')
    `);

    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'action',
            type: 'enum',
            enumName: 'audit_logs_action_enum',
          },
          {
            name: 'entity',
            type: 'varchar',
          },
          {
            name: 'entity_id',
            type: 'varchar',
          },
          {
            name: 'old_values',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'new_values',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(`
      CREATE INDEX "IDX_audit_logs_user_id" ON "audit_logs" ("user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_audit_logs_entity" ON "audit_logs" ("entity")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_audit_logs_created_at" ON "audit_logs" ("created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_entity"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_user_id"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TYPE "audit_logs_action_enum"`);
  }
}