import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Class } from './classes.entity';
import { Enrollment } from './enrollment.entity';
import { Course } from '../courses/course.entity';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Class, Enrollment, Course])],
  controllers: [ClassesController],
  providers: [ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
