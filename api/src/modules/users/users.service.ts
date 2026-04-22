import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly profilesService: ProfilesService,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const profiles = await this.profilesService.findByNames(data.profiles);

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

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }
}
