import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Class } from './classes.entity';
import { Enrollment } from './enrollment.entity';
import { Course } from '../courses/course.entity';
import { User } from 'src/modules/users/user.entity';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { EnrollStudentDto } from './dtos/enroll-student.dto';
import { ClassResponseDto } from './dtos/class-response.dto';
import { EnrollmentResponseDto } from './dtos/enrollment-response.dto';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private toResponse(classEntity: Class): ClassResponseDto {
    return {
      id: classEntity.id,
      name: classEntity.name,
      code: classEntity.code,
      courseId: classEntity.course.id,
      courseName: classEntity.course.name,
      semester: classEntity.semester,
      year: classEntity.year,
      status: classEntity.active,
      created_at: classEntity.created_at,
      updated_at: classEntity.updated_at,
    };
  }

  private enrollmentToResponse(enrollment: Enrollment): EnrollmentResponseDto {
    return {
      id: enrollment.id,
      userId: enrollment.user.id,
      userName: enrollment.user.name,
      userEmail: enrollment.user.email,
      classId: enrollment.class.id,
      className: enrollment.class.name,
      status: enrollment.status,
      enrolled_at: enrollment.enrolled_at,
      updated_at: enrollment.updated_at,
    };
  }

  private validateClassDate(
    courseCreatedAt: Date,
    semester: number,
    year: number,
  ): void {
    const currentYear = new Date().getFullYear();

    if (year < courseCreatedAt.getFullYear()) {
      throw new BadRequestException(
        `O ano da turma (${year}) não pode ser anterior ao ano de criação do curso (${courseCreatedAt.getFullYear()})`,
      );
    }

    if (year > currentYear) {
      throw new BadRequestException(
        `O ano da turma (${year}) não pode ser superior ao ano atual (${currentYear})`,
      );
    }

    if (semester < 1 || semester > 2) {
      throw new BadRequestException('O semestre deve ser 1 ou 2');
    }
  }

  async create(data: CreateClassDto): Promise<ClassResponseDto> {
    const course = await this.courseRepository.findOne({
      where: { id: data.courseId },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    this.validateClassDate(course.created_at, data.semester, data.year);

    const duplicate = await this.classRepository.findOne({
      where: {
        course: { id: data.courseId },
        name: data.name,
        semester: data.semester,
        year: data.year,
      },
      relations: ['course'],
    });

    if (duplicate) {
      throw new ConflictException(
        'Já existe uma turma com este nome para este curso no semestre/ano informado',
      );
    }

    const classEntity = this.classRepository.create({
      name: data.name,
      code: data.code,
      course,
      semester: data.semester,
      year: data.year,
      active: data.status ?? Status.ACTIVE,
    });

    const saved = await this.classRepository.save(classEntity);
    return this.toResponse(saved);
  }

  async findAll(): Promise<ClassResponseDto[]> {
    const classes = await this.classRepository.find({
      relations: ['course'],
    });

    return classes.map((c) => this.toResponse(c));
  }

  async findById(id: string): Promise<ClassResponseDto | null> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!classEntity) return null;

    return this.toResponse(classEntity);
  }

  async update(id: string, data: UpdateClassDto): Promise<ClassResponseDto> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!classEntity) {
      throw new NotFoundException('Turma não encontrada');
    }

    if (data.courseId) {
      const course = await this.courseRepository.findOne({
        where: { id: data.courseId },
      });

      if (!course) {
        throw new NotFoundException('Curso não encontrado');
      }

      classEntity.course = course;
    }

    if (data.name || data.semester || data.year) {
      const targetCourseId = data.courseId ?? classEntity.course.id;
      const targetSemester = data.semester ?? classEntity.semester;
      const targetYear = data.year ?? classEntity.year;

      const duplicate = await this.classRepository.findOne({
        where: {
          course: { id: targetCourseId },
          name: data.name ?? classEntity.name,
          semester: targetSemester,
          year: targetYear,
        },
        relations: ['course'],
      });

      if (duplicate && duplicate.id !== id) {
        throw new ConflictException(
          'Já existe uma turma com este nome para este curso no semestre/ano informado',
        );
      }

      if (data.year || data.semester) {
        this.validateClassDate(
          classEntity.course.created_at,
          targetSemester,
          targetYear,
        );
      }
    }

    Object.assign(classEntity, data);

    const updated = await this.classRepository.save(classEntity);
    return this.toResponse(updated);
  }

  async inactivate(id: string): Promise<ClassResponseDto> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!classEntity) {
      throw new NotFoundException('Turma não encontrada');
    }

    classEntity.active = Status.INACTIVE;

    const updated = await this.classRepository.save(classEntity);
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!classEntity) {
      throw new NotFoundException('Turma não encontrada');
    }

    await this.classRepository.remove(classEntity);
  }

  async enrollStudent(
    classId: string,
    data: EnrollStudentDto,
  ): Promise<EnrollmentResponseDto> {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['course'],
    });

    if (!classEntity) {
      throw new NotFoundException('Turma não encontrada');
    }

    if (classEntity.active !== Status.ACTIVE) {
      throw new BadRequestException(
        'Não é possível matricular alunos em uma turma inativa',
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const hasProfileAluno = user.profiles.some(
      (profile) => profile.name === 'ALUNO',
    );

    if (!hasProfileAluno) {
      throw new ConflictException('O usuário não possui perfil de aluno');
    }

    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: data.userId },
        class: { id: classId },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('Aluno já está matriculado nesta turma');
    }

    const enrollment = this.enrollmentRepository.create({
      user,
      class: classEntity,
      status: Status.ACTIVE,
    });

    const saved = await this.enrollmentRepository.save(enrollment);
    return this.enrollmentToResponse(saved);
  }

  async findEnrollmentsByClass(
    classId: string,
  ): Promise<EnrollmentResponseDto[]> {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['course'],
    });

    if (!classEntity) {
      throw new NotFoundException('Turma não encontrada');
    }

    const enrollments = await this.enrollmentRepository.find({
      where: { class: { id: classId } },
      relations: ['user', 'class'],
    });

    return enrollments.map((e) => this.enrollmentToResponse(e));
  }

  async unenrollStudent(
    classId: string,
    userId: string,
  ): Promise<EnrollmentResponseDto> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: userId },
        class: { id: classId },
      },
      relations: ['user', 'class'],
    });

    if (!enrollment) {
      throw new NotFoundException('Matrícula não encontrada');
    }

    enrollment.status = Status.INACTIVE;

    const updated = await this.enrollmentRepository.save(enrollment);
    return this.enrollmentToResponse(updated);
  }
}
