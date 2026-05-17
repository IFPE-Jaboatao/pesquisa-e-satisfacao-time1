import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Campus } from './campus.entity';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class CampusSeed {
  constructor(
    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  async run() {
    const campuses = [
      { name: 'Campus Recife', code: 'REC', address: 'Recife - PE' },
      { name: 'Campus Olinda', code: 'OLI', address: 'Olinda - PE' },
      { name: 'Campus Belo Jardim', code: 'BJ', address: 'Belo Jardim - PE' },
      { name: 'Campus Caruaru', code: 'CAR', address: 'Caruaru - PE' },
    ];

    for (const campus of campuses) {
      const exists = await this.campusRepository.findOne({
        where: { code: campus.code },
      });

      if (!exists) {
        await this.campusRepository.save({
          ...campus,
          status: Status.ACTIVE,
        });
        console.log(`Campus criado: ${campus.name}`);
      }
    }
  }
}
