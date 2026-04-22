import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Profile } from './profiles.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findAll(): Promise<Profile[]> {
    return this.profileRepository.find();
  }

  async findByNames(names: string[]): Promise<Profile[]> {
    return this.profileRepository.find({
      where: {
        name: In(names),
      },
    });
  }

  async findByIds(ids: string[]): Promise<Profile[]> {
    return this.profileRepository.findBy({
      id: In(ids),
    });
  }

  async findOneByName(name: string): Promise<Profile | null> {
    return this.profileRepository.findOne({
      where: { name },
    });
  }
}
