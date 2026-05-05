import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Course } from './course.entity';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { CourseResponseDto } from './dtos/course-response.dto';
import { Status } from 'src/common/enums/status.enum';
import { Campus } from '../campus/campus.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  private toResponse(course: Course): CourseResponseDto {
    return {
      id: course.id,
      name: course.name,
      code: course.code ?? '',
      campusId: course.campus?.id,
      status: course.active,
      created_at: course.created_at,
      updated_at: course.updated_at,
    };
  }

  async create(data: CreateCourseDto): Promise<CourseResponseDto> {
    const campus = await this.campusRepository.findOne({
      where: { id: data.campusId },
    });

    if (!campus) {
      throw new NotFoundException('Campus não encontrado');
    }

    const course = this.courseRepository.create({
      name: data.name,
      code: data.code,
      campus,
      active: data.status ?? Status.ACTIVE,
    });

    const saved = await this.courseRepository.save(course);
    return this.toResponse(saved);
  }

  async findAll(): Promise<CourseResponseDto[]> {
    const courses = await this.courseRepository.find({
      relations: ['campus'],
    });

    return courses.map(this.toResponse);
  }

  async findById(id: string): Promise<CourseResponseDto | null> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['campus'],
    });

    if (!course) return null;

    return this.toResponse(course);
  }

  async update(id: string, data: UpdateCourseDto): Promise<CourseResponseDto> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['campus'], // Certifique-se de que o nome é 'campus' na Entity
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    if (data.campusId) {
      const campus = await this.campusRepository.findOne({
        where: { id: data.campusId },
      });

      if (!campus) {
        throw new NotFoundException('Campus não encontrado');
      }

      course.campus = campus;
    }

    Object.assign(course, data);

    const updated = await this.courseRepository.save(course);
    return this.toResponse(updated);
  }

  async inactivate(id: string): Promise<CourseResponseDto> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['campus'],
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    course.active = Status.INACTIVE;

    const updated = await this.courseRepository.save(course);
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    await this.courseRepository.remove(course);
  }
}
