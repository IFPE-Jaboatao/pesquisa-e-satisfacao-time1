import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from '../courses/course.entity';
import { Status } from 'src/common/enums/status.enum';

@Entity('disciplines')
export class Discipline {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Course, (course) => course.disciplines)
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @Column()
  name!: string;

  @Column()
  code?: string;

  @Column()
  workload: number = 0;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  active!: Status;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
