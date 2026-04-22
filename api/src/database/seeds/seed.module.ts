import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeedService } from './seed.service';
import { ProfilesSeed } from '../../modules/profiles/profiles.seed';
import { Profile } from '../../modules/profiles/profiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [SeedService, ProfilesSeed],
})
export class SeedModule {}
