import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audits')
export class Audit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column()
  action!: string;

  @Column()
  entity!: string;

  @Column()
  entity_id!: string;

  @Column({ type: 'json', nullable: true })
  old_values?: any;

  @Column({ type: 'json', nullable: true })
  new_values: any;

  @Column()
  ip?: string;

  @Column()
  user_agent?: string;

  @CreateDateColumn()
  created_at?: Date;
}
