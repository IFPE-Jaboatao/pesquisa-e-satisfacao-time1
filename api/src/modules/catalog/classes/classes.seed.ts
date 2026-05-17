import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Class } from './classes.entity';
import { Course } from '../courses/course.entity';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class ClassSeed {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async run() {
    const courses = await this.courseRepository.find();

    for (const course of courses) {
      const classes = [
        { name: `Turma A - ${course.name}`, code: `${course.code}-2026-A`, semester: 1, year: 2026 },
        { name: `Turma B - ${course.name}`, code: `${course.code}-2026-B`, semester: 1, year: 2026 },
      ];

      for (const classData of classes) {
        const exists = await this.classRepository.findOne({
          where: { code: classData.code },
        });

        if (!exists) {
          await this.classRepository.save({
            ...classData,
            course,
            active: Status.ACTIVE,
          });
          console.log(`Turma criada: ${classData.name}`);
        }
      }
    }
  }
}
