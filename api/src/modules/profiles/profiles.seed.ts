import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Profile } from 'src/modules/profiles/profiles.entity';

@Injectable()
export class ProfilesSeed {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async run() {
    const profiles = [
      { name: 'ALUNO', description: 'Aluno da instituição' },
      { name: 'DOCENTE', description: 'Professor' },
      { name: 'TECNICO', description: 'Servidor técnico' },
      { name: 'GESTOR', description: 'Gestor acadêmico' },
      { name: 'ADMIN', description: 'Administrador do sistema' },
    ];

    for (const profile of profiles) {
      const exists = await this.profileRepository.findOne({
        where: { name: profile.name },
      });

      if (!exists) {
        await this.profileRepository.save(profile);
        console.log(`Perfil criado: ${profile.name}`);
      }
    }
  }
}
