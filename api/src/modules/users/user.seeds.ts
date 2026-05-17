import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ProfilesService } from 'src/modules/profiles/profiles.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class UserSeeds {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly profileService: ProfilesService,
  ) {}

  async run() {
    const profile = await this.profileService.findByNames(['ADMIN']);

    const adminUser = await this.userRepository.findOne({
      where: { email: 'admin@email.com', name: 'Admin' },
    });

    if (!adminUser) {
      const user = this.userRepository.create({
        name: 'Admin',
        email: 'admin@email.com',
        password: await bcrypt.hash('admin123', 10),
        profiles: profile,
      });

      await this.userRepository.save(user);
    }
  }
}
