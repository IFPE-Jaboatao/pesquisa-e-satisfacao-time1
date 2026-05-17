import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from './course.entity';
import { Campus } from '../campus/campus.entity';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class CourseSeed {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  async run() {
    const campusRecife = await this.campusRepository.findOne({
      where: { code: 'REC' },
    });

    if (!campusRecife) return;

    const courses = [
      { name: 'Engenharia de Software', code: 'ESW', campus: campusRecife },
      { name: 'Sistemas de Informação', code: 'SIN', campus: campusRecife },
      { name: 'Análise e Desenvolvimento de Sistemas', code: 'ADS', campus: campusRecife },
      { name: 'Redes de Computadores', code: 'RDC', campus: campusRecife },
    ];

    for (const course of courses) {
      const exists = await this.courseRepository.findOne({
        where: { code: course.code },
      });

      if (!exists) {
        await this.courseRepository.save({
          ...course,
          active: Status.ACTIVE,
        });
        console.log(`Curso criado: ${course.name}`);
      }
    }
  }
}
