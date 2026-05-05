import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { ProfilesSeed } from '../../modules/profiles/profiles.seed';
import { Profile } from '../../modules/profiles/profiles.entity';
import { UserSeeds } from 'src/modules/users/dtos/user.seeds';
import { User } from 'src/modules/users/user.entity';
import { ProfilesModule } from 'src/modules/profiles/profiles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User]), ProfilesModule],
  providers: [SeedService, ProfilesSeed, UserSeeds],
})
export class SeedModule {}
