import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { CreateStudentDto } from './dtos/create-student.dto';
import { StudentResponseDto } from './dtos/student-response.dto';
import { Profile } from '../profiles/profiles.entity';
import { ProfilesService } from '../profiles/profiles.service';
import { Class } from '../catalog/classes/classes.entity';
import { Enrollment } from '../catalog/classes/enrollment.entity';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    private readonly profilesService: ProfilesService,
  ) {}

  private validateProfileCombinations(profiles: Profile[]): void {
    const names = profiles.map((p) => p.name);

    if (names.includes('ADMIN')) {
      throw new BadRequestException(
        'Não é permitido atribuir o perfil ADMIN',
      );
    }

    if (names.includes('ALUNO') && names.includes('DOCENTE')) {
      throw new BadRequestException(
        'Não é permitido criar um usuário com os perfis ALUNO e DOCENTE simultaneamente',
      );
    }
  }

  private toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profiles: user.profiles?.map((p) => p.name) || [],
    };
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const profiles = await this.profilesService.findByIds(data.profiles);

    if (!profiles.length || profiles.length !== data.profiles.length) {
      throw new BadRequestException('Um ou mais perfis são inválidos');
    }

    this.validateProfileCombinations(profiles);

    const hashedPassword: string = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      profiles,
    });

    const savedUser = await this.userRepository.save(user);

    return this.toResponse(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['profiles'],
    });

    return users.map((user) => this.toResponse(user));
  }

  async findById(id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profiles'],
    });

    if (!user) return null;

    return this.toResponse(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['profiles'],
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profiles'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: data.email },
      });

      if (existing) {
        throw new BadRequestException('Email já está em uso');
      }
    }

    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }

    if (data.profiles) {
      const profiles = await this.profilesService.findByIds(data.profiles);

      if (!profiles.length || profiles.length !== data.profiles.length) {
        throw new BadRequestException('Um ou mais perfis são inválidos');
      }

      this.validateProfileCombinations(profiles);

      user.profiles = profiles;
    }

    Object.assign(user, data);

    const updated = await this.userRepository.save(user);
    return this.toResponse(updated);
  }

  async inactivate(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profiles'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    user.status = Status.INACTIVE;

    const updated = await this.userRepository.save(user);
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profiles'],
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.userRepository.softRemove(user);
  }

  private toStudentResponse(user: User): StudentResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      registration: user.registration!,
    };
  }

  async createStudent(data: CreateStudentDto): Promise<StudentResponseDto> {
    const existingEmail = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new BadRequestException('Email já está em uso');
    }

    const existingRegistration = await this.userRepository.findOne({
      where: { registration: data.registration },
    });

    if (existingRegistration) {
      throw new BadRequestException('Matrícula já está em uso');
    }

    const alunoProfile = await this.profilesService.findOneByName('ALUNO');

    if (!alunoProfile) {
      throw new BadRequestException('Perfil ALUNO não encontrado');
    }

    const hashedPassword: string = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      registration: data.registration,
      profiles: [alunoProfile],
    });

    const savedUser = await this.userRepository.save(user);

    return this.toStudentResponse(savedUser);
  }

  async enrollStudent(studentId: string, classId: string): Promise<StudentResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: studentId },
    });

    if (!user) {
      throw new NotFoundException('Aluno não encontrado');
    }

    const hasAlunoProfile = user.profiles.some(
      (profile) => profile.name === 'ALUNO',
    );

    if (!hasAlunoProfile) {
      throw new BadRequestException('Usuário não possui perfil de aluno');
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
      relations: ['course'],
    });

    if (!classEntity) {
      throw new NotFoundException('Turma não encontrada');
    }

    if (classEntity.active !== Status.ACTIVE) {
      throw new BadRequestException('Turma não está ativa');
    }

    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        user: { id: studentId },
        class: { id: classId },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Aluno já está matriculado nesta turma');
    }

    await this.enrollmentRepository.save(
      this.enrollmentRepository.create({
        user,
        class: classEntity,
        status: Status.ACTIVE,
      }),
    );

    return this.toStudentResponse(user);
  }
}
