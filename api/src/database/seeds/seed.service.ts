import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ProfilesSeed } from '../../modules/profiles/profiles.seed';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(private readonly profilesSeed: ProfilesSeed) {}

  async onApplicationBootstrap() {
    console.log('Seeds starting...');

    await this.profilesSeed.run();

    console.log('Seeds finished!');
  }
}
