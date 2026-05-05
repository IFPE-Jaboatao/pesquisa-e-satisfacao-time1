import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ProfilesSeed } from '../../modules/profiles/profiles.seed';
import { UserSeeds } from 'src/modules/users/dtos/user.seeds';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly profilesSeed: ProfilesSeed,
    private readonly userSeeds: UserSeeds,
  ) {}

  async onApplicationBootstrap() {
    console.log('Seeds starting...');

    await this.profilesSeed.run();
    await this.userSeeds.run();

    console.log('Seeds finished!');
  }
}
