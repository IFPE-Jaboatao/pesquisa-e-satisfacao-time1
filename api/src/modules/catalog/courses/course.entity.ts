import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Campus } from '../campus/campus.entity';
import { Status } from 'src/common/enums/status.enum';
import { Class } from '../classes/classes.entity';
import { Discipline } from '../disciplines/discipline.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Campus, (campus) => campus.courses)
  @JoinColumn({ name: 'campus_id' })
  campus!: Campus;

  @Column()
  name!: string;

  @Column()
  code?: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  active!: Status;

  @OneToMany(() => Class, (c) => c.course)
  classes!: Class[];

  @OneToMany(() => Discipline, (d) => d.course)
  disciplines!: Discipline[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
