import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.userProfiles)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Profile, (profile) => profile.userProfiles)
  @JoinColumn({ name: 'profile_id' })
  profile!: Profile;
}
