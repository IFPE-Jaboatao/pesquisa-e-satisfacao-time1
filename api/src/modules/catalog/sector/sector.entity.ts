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

@Entity('sectors')
export class Sector {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Campus, (campus) => campus.sectors)
  @JoinColumn({ name: 'campus_id' })
  campus!: Campus;

  @Column()
  name!: string;

  @Column()
  description?: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status!: Status;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
