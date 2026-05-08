import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Service } from './service.entity';
import { Campus } from '../campus/campus.entity';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { ServiceResponseDto } from './dtos/service-response.dto';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  private toResponse(serviceEntity: Service): ServiceResponseDto {
    return {
      id: serviceEntity.id,
      name: serviceEntity.name,
      description: serviceEntity.description,
      campusId: serviceEntity.campus.id,
      campusName: serviceEntity.campus.name,
      status: serviceEntity.active,
      created_at: serviceEntity.created_at,
      updated_at: serviceEntity.updated_at,
    };
  }

  async create(data: CreateServiceDto): Promise<ServiceResponseDto> {
    const campus = await this.campusRepository.findOne({
      where: { id: data.campusId },
    });

    if (!campus) {
      throw new NotFoundException('Campus não encontrado');
    }

    const duplicate = await this.serviceRepository.findOne({
      where: {
        name: data.name,
        campus: { id: data.campusId },
      },
      relations: ['campus'],
    });

    if (duplicate) {
      throw new ConflictException(
        'Já existe um serviço com este nome para este campus',
      );
    }

    const serviceEntity = this.serviceRepository.create({
      name: data.name,
      description: data.description,
      campus,
      active: data.status ?? Status.ACTIVE,
    });

    const saved = await this.serviceRepository.save(serviceEntity);
    return this.toResponse(saved);
  }

  async findAll(): Promise<ServiceResponseDto[]> {
    const services = await this.serviceRepository.find({
      relations: ['campus'],
    });

    return services.map((s) => this.toResponse(s));
  }

  async findById(id: string): Promise<ServiceResponseDto | null> {
    const serviceEntity = await this.serviceRepository.findOne({
      where: { id },
      relations: ['campus'],
    });

    if (!serviceEntity) return null;

    return this.toResponse(serviceEntity);
  }

  async update(
    id: string,
    data: UpdateServiceDto,
  ): Promise<ServiceResponseDto> {
    const serviceEntity = await this.serviceRepository.findOne({
      where: { id },
      relations: ['campus'],
    });

    if (!serviceEntity) {
      throw new NotFoundException('Serviço não encontrado');
    }

    if (data.campusId) {
      const campus = await this.campusRepository.findOne({
        where: { id: data.campusId },
      });

      if (!campus) {
        throw new NotFoundException('Campus não encontrado');
      }

      serviceEntity.campus = campus;
    }

    if (data.name) {
      const duplicate = await this.serviceRepository.findOne({
        where: {
          name: data.name,
          campus: { id: data.campusId ?? serviceEntity.campus.id },
        },
        relations: ['campus'],
      });

      if (duplicate && duplicate.id !== id) {
        throw new ConflictException(
          'Já existe um serviço com este nome para este campus',
        );
      }
    }

    Object.assign(serviceEntity, data);

    const updated = await this.serviceRepository.save(serviceEntity);
    return this.toResponse(updated);
  }

  async inactivate(id: string): Promise<ServiceResponseDto> {
    const serviceEntity = await this.serviceRepository.findOne({
      where: { id },
      relations: ['campus'],
    });

    if (!serviceEntity) {
      throw new NotFoundException('Serviço não encontrado');
    }

    serviceEntity.active = Status.INACTIVE;

    const updated = await this.serviceRepository.save(serviceEntity);
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const serviceEntity = await this.serviceRepository.findOne({
      where: { id },
      relations: ['campus'],
    });

    if (!serviceEntity) {
      throw new NotFoundException('Serviço não encontrado');
    }

    await this.serviceRepository.remove(serviceEntity);
  }
}
