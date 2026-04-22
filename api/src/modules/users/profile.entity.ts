import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserProfile } from './user-profile.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => UserProfile, (up) => up.profile)
  userProfiles!: UserProfile[];
}
