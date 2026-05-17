import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { SeedService } from './seed.service';
import { ProfilesSeed } from '../../modules/profiles/profiles.seed';
import { Profile } from '../../modules/profiles/profiles.entity';
import { UserSeeds } from 'src/modules/users/user.seeds';
import { User } from 'src/modules/users/user.entity';
import { ProfilesModule } from 'src/modules/profiles/profiles.module';
import { CampusSeed } from 'src/modules/catalog/campus/campus.seed';
import { Campus } from 'src/modules/catalog/campus/campus.entity';
import { CourseSeed } from 'src/modules/catalog/courses/courses.seed';
import { Course } from 'src/modules/catalog/courses/course.entity';
import { ServiceSeed } from 'src/modules/catalog/services/services.seed';
import { Service } from 'src/modules/catalog/services/service.entity';
import { ClassSeed } from 'src/modules/catalog/classes/classes.seed';
import { Class } from 'src/modules/catalog/classes/classes.entity';
import { SurveySeed } from 'src/modules/surveys/surveys.seed';
import { Survey, SurveySchema } from 'src/modules/surveys/schemas/survey.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, User, Campus, Course, Service, Class]),
    MongooseModule.forFeature([{ name: Survey.name, schema: SurveySchema }]),
    ProfilesModule,
  ],
  providers: [
    SeedService,
    ProfilesSeed,
    UserSeeds,
    CampusSeed,
    CourseSeed,
    ServiceSeed,
    ClassSeed,
    SurveySeed,
  ],
})
export class SeedModule {}
