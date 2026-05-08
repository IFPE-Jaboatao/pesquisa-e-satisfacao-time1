import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from './classes.entity';
import { User } from 'src/modules/users/user.entity';
import { Status } from 'src/common/enums/status.enum';

@Entity('enrollments')
@Unique(['user', 'class'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Class, (classEntity) => classEntity.enrollments)
  @JoinColumn({ name: 'class_id' })
  class!: Class;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status!: Status;

  @CreateDateColumn()
  enrolled_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
