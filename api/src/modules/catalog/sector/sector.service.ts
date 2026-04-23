import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Sector } from './sector.entity';
import { CreateSectorDto } from './dtos/create-sector.dto';
import { UpdateSectorDto } from './dtos/update-sector.dto';
import { SectorResponseDto } from './dtos/sector-response.dto';
import { Status } from 'src/common/enums/status.enum';
import { Campus } from '../campus/campus.entity';

@Injectable()
export class SectorService {
  constructor(
    @InjectRepository(Sector)
    private readonly sectorRepository: Repository<Sector>,

    @InjectRepository(Campus)
    private readonly campusRepository: Repository<Campus>,
  ) {}

  private toResponse(sector: Sector): SectorResponseDto {
    return {
      id: sector.id,
      name: sector.name,
      description: sector.description,
      campusId: sector.campus?.id,
      status: sector.status,
      created_at: sector.created_at,
      updated_at: sector.updated_at,
    };
  }

  async create(data: CreateSectorDto): Promise<SectorResponseDto> {
    const campus = await this.campusRepository.findOne({
      where: { id: data.campusId },
    });

    if (!campus) {
      throw new NotFoundException('Campus não encontrado');
    }

    const sector = this.sectorRepository.create({
      name: data.name,
      description: data.description,
      campus,
      status: data.status ?? Status.ACTIVE,
    });

    const saved = await this.sectorRepository.save(sector);
    return this.toResponse(saved);
  }

  async findAll(): Promise<SectorResponseDto[]> {
    const sectors = await this.sectorRepository.find({
      relations: ['campus'],
    });

    return sectors.map((s) => this.toResponse(s));
  }

  async findById(id: string): Promise<SectorResponseDto | null> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
      relations: ['campus'],
    });

    if (!sector) return null;

    return this.toResponse(sector);
  }

  async update(id: string, data: UpdateSectorDto): Promise<SectorResponseDto> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
      relations: ['campus'],
    });

    if (!sector) {
      throw new NotFoundException('Setor não encontrado');
    }

    if (data.campusId) {
      const campus = await this.campusRepository.findOne({
        where: { id: data.campusId },
      });

      if (!campus) {
        throw new NotFoundException('Campus não encontrado');
      }

      sector.campus = campus;
    }

    Object.assign(sector, data);

    const updated = await this.sectorRepository.save(sector);
    return this.toResponse(updated);
  }

  async inactivate(id: string): Promise<SectorResponseDto> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
      relations: ['campus'],
    });

    if (!sector) {
      throw new NotFoundException('Setor não encontrado');
    }

    sector.status = Status.INACTIVE;

    const updated = await this.sectorRepository.save(sector);
    return this.toResponse(updated);
  }

  async delete(id: string): Promise<void> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
    });

    if (!sector) {
      throw new NotFoundException('Setor não encontrado');
    }

    await this.sectorRepository.remove(sector);
  }
}
