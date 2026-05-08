import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SurveysController } from './surveys.controller';
import { SurveysService } from './surveys.service';

import { Survey, SurveySchema } from './schemas/survey.schema';
import { Answer, AnswerSchema } from './schemas/answer.schema';
import { AccessToken, AccessTokenSchema } from './schemas/access-token.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../catalog/courses/course.entity';
import { Campus } from '../catalog/campus/campus.entity';
import { Service } from '../catalog/services/service.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema },
      { name: Answer.name, schema: AnswerSchema },
      { name: AccessToken.name, schema: AccessTokenSchema },
    ]),
    TypeOrmModule.forFeature([Course, Campus, Service]),
  ],
  controllers: [SurveysController],
  providers: [SurveysService],
  exports: [SurveysService], // opcional
})
export class SurveysModule {}
