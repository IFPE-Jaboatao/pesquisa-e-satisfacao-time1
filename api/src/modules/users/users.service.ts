import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly profilesService: ProfilesService,
  ) {}

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
}
