import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { SectorService } from './sector.service';
import { CreateSectorDto } from './dtos/create-sector.dto';
import { UpdateSectorDto } from './dtos/update-sector.dto';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '../../auth/guards/roles.guard';

@ApiTags('Sectors')
@Controller('sectors')
export class SectorController {
  constructor(private readonly sectorService: SectorService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar setor' })
  @ApiBody({ type: CreateSectorDto })
  async create(@Body() data: CreateSectorDto) {
    const sector = await this.sectorService.create(data);
    return new ApiResponseDto(true, 'Setor criado com sucesso', sector);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({ summary: 'Listar setores' })
  async findAll() {
    const sectors = await this.sectorService.findAll();
    return new ApiResponseDto(true, 'Lista de setores', sectors);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({ summary: 'Buscar setor por ID' })
  @ApiParam({ name: 'id' })
  async findById(@Param('id') id: string) {
    const sector = await this.sectorService.findById(id);
    return new ApiResponseDto(true, 'Setor encontrado', sector);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar setor' })
  async update(@Param('id') id: string, @Body() data: UpdateSectorDto) {
    const sector = await this.sectorService.update(id, data);
    return new ApiResponseDto(true, 'Setor atualizado', sector);
  }

  @Patch(':id/inactivate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Inativar setor' })
  async inactivate(@Param('id') id: string) {
    const sector = await this.sectorService.inactivate(id);
    return new ApiResponseDto(true, 'Setor inativado', sector);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover setor' })
  async delete(@Param('id') id: string) {
    await this.sectorService.delete(id);
    return new ApiResponseDto(true, 'Setor removido', null);
  }
}
