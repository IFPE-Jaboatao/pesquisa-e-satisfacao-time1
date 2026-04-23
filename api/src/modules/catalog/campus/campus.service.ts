import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Campus } from './campus.entity';
import { CreateCampusDto } from './dtos/create-campus.dto';
import { UpdateCampusDto } from './dtos/update-campus.dto';
import { CampusResponseDto } from './dtos/campus-response.dto';
import { Status } from 'src/common/enums/status.enum';

@Injectable()
export class CampusService {
  constructor(
    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  private toResponse(campus: Campus): CampusResponseDto {
    return {
      id: campus.id,
      name: campus.name,
      code: campus.code ?? '',
      address: campus.address,
      status: campus.status,
      created_at: campus.created_at,
      updated_at: campus.updated_at,
    };
  }

  async create(data: CreateCampusDto): Promise<CampusResponseDto> {
    const campus = this.campusRepository.create({
      ...data,
      status: data.status ?? Status.ACTIVE,
    });

    const saved = await this.campusRepository.save(campus);
    return this.toResponse(saved);
  }

  async findAll(): Promise<CampusResponseDto[]> {
    const campuses = await this.campusRepository.find();
    return campuses.map((c) => this.toResponse(c));
  }

  async findById(id: string): Promise<CampusResponseDto | null> {
    const campus = await this.campusRepository.findOne({ where: { id } });

    if (!campus) return null;

    return this.toResponse(campus);
  }

  async update(id: string, data: UpdateCampusDto): Promise<CampusResponseDto> {
    const campus = await this.campusRepository.findOne({ where: { id } });

    if (!campus) {
      throw new NotFoundException('Campus não encontrado');
    }

    Object.assign(campus, data);

    const updated = await this.campusRepository.save(campus);

    return this.toResponse(updated);
  }

  async inactivate(id: string): Promise<CampusResponseDto> {
    const campus = await this.campusRepository.findOne({ where: { id } });

    if (!campus) {
      throw new NotFoundException('Campus não encontrado');
    }

    campus.status = Status.INACTIVE;

    const updated = await this.campusRepository.save(campus);

    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const campus = await this.campusRepository.findOne({ where: { id } });

    if (!campus) {
      throw new NotFoundException('Campus não encontrado');
    }

    await this.campusRepository.remove(campus);
  }
}
