import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Service } from './service.entity';
import { Campus } from '../campus/campus.entity';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class ServiceSeed {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  async run() {
    const campuses = await this.campusRepository.find();

    for (const campus of campuses) {
      const services = [
        { name: 'Biblioteca', description: 'Serviço de empréstimo e consulta de livros' },
        { name: 'Restaurante Acadêmico', description: 'Refeições para comunidade acadêmica' },
        { name: 'Laboratório de Informática', description: 'Acesso a computadores e softwares' },
      ];

      for (const service of services) {
        const exists = await this.serviceRepository.findOne({
          where: { name: service.name, campus: { id: campus.id } },
        });

        if (!exists) {
          await this.serviceRepository.save({
            ...service,
            campus,
            active: Status.ACTIVE,
          });
          console.log(`Serviço criado: ${service.name} - ${campus.name}`);
        }
      }
    }
  }
}
