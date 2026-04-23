import { Status } from 'src/common/enums/status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Course } from '../courses/course.entity';
import { Sector } from '../sector/sector.entity';
import { Service } from '../services/service.entity';

@Entity('campuses')
export class Campus {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  code?: string;

  @Column()
  address?: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status!: Status;

  @OneToMany(() => Service, (service) => service.campus)
  services?: Service[];

  @OneToMany(() => Sector, (sector) => sector.campus)
  sectors?: Sector[];

  @OneToMany(() => Course, (course) => course.campus)
  courses?: Course[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
