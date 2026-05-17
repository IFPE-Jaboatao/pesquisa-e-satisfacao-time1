import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ProfilesSeed } from '../../modules/profiles/profiles.seed';
import { UserSeeds } from 'src/modules/users/user.seeds';
import { CampusSeed } from 'src/modules/catalog/campus/campus.seed';
import { CourseSeed } from 'src/modules/catalog/courses/courses.seed';
import { ServiceSeed } from 'src/modules/catalog/services/services.seed';
import { ClassSeed } from 'src/modules/catalog/classes/classes.seed';
import { SurveySeed } from 'src/modules/surveys/surveys.seed';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly profilesSeed: ProfilesSeed,
    private readonly userSeeds: UserSeeds,
    private readonly campusSeed: CampusSeed,
    private readonly courseSeed: CourseSeed,
    private readonly serviceSeed: ServiceSeed,
    private readonly classSeed: ClassSeed,
    private readonly surveySeed: SurveySeed,
  ) {}

  async onApplicationBootstrap() {
    console.log('Seeds starting...');

    await this.profilesSeed.run();
    await this.userSeeds.run();
    await this.campusSeed.run();
    await this.courseSeed.run();
    await this.serviceSeed.run();
    await this.classSeed.run();
    await this.surveySeed.run();

    console.log('Seeds finished!');
  }
}
