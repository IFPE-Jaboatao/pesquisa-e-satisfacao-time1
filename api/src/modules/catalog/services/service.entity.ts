import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Campus } from '../campus/campus.entity';
import { Status } from 'src/common/enums/status.enum';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Campus, (campus) => campus.services)
  @JoinColumn({ name: 'campus_id' })
  campus!: Campus;

  @Column()
  name!: string;

  @Column()
  description?: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  active!: Status;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
