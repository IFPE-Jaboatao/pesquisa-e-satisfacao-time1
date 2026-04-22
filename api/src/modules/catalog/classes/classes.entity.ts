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

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Course, (course) => course.classes)
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @Column()
  name!: string;

  @Column()
  code?: string;

  @Column()
  semester?: number;

  @Column()
  year?: number;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  active!: Status;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
