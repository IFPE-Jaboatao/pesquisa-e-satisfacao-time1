import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AuditAction {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity('audit_logs')
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  user_id?: string;

  @Column({ type: 'enum', enum: AuditAction })
  action!: AuditAction;

  @Column()
  entity!: string;

  @Column({ nullable: true })
  entity_id!: string;

  @Column({ type: 'jsonb', nullable: true })
  old_values?: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  new_values?: Record<string, unknown>;

  @CreateDateColumn()
  created_at!: Date;
}
