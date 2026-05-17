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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CampusService } from './campus.service';
import { CreateCampusDto } from './dtos/create-campus.dto';
import { CampusResponseDto } from './dtos/campus-response.dto';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { Roles, RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCampusDto } from './dtos/update-campus.dto';

@ApiTags('Campus')
@Controller('campus')
export class CampusController {
  constructor(private readonly campusService: CampusService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar campus' })
  @ApiBody({ type: CreateCampusDto })
  @ApiResponse({
    status: 201,
    description: 'Campus criado com sucesso',
    type: CampusResponseDto,
  })
  async create(
    @Body() data: CreateCampusDto,
  ): Promise<ApiResponseDto<CampusResponseDto>> {
    const campus = await this.campusService.create(data);

    return new ApiResponseDto(true, 'Campus criado com sucesso', campus);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'DOCENTE', 'ALUNO')
  @ApiOperation({ summary: 'Listar campus' })
  @ApiResponse({
    status: 200,
    description: 'Lista de campus',
    type: [CampusResponseDto],
  })
  async findAll(): Promise<ApiResponseDto<CampusResponseDto[]>> {
    const campuses = await this.campusService.findAll();

    return new ApiResponseDto(true, 'Lista de campus', campuses);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'DOCENTE', 'ALUNO')
  @ApiOperation({ summary: 'Buscar campus por ID' })
  @ApiParam({ name: 'id', example: 'uuid-aqui' })
  @ApiResponse({
    status: 200,
    description: 'Campus encontrado',
    type: CampusResponseDto,
  })
  async findById(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<CampusResponseDto | null>> {
    const campus = await this.campusService.findById(id);

    return new ApiResponseDto(true, 'Campus encontrado', campus);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar campus' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateCampusDto })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCampusDto,
  ): Promise<ApiResponseDto<CampusResponseDto>> {
    const campus = await this.campusService.update(id, data);

    return new ApiResponseDto(true, 'Campus atualizado com sucesso', campus);
  }

  @Patch(':id/inactivate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Inativar campus' })
  async inactivate(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<CampusResponseDto>> {
    const campus = await this.campusService.inactivate(id);

    return new ApiResponseDto(true, 'Campus inativado com sucesso', campus);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover campus (DELETE físico)' })
  async delete(@Param('id') id: string): Promise<ApiResponseDto<null>> {
    await this.campusService.delete(id);

    return new ApiResponseDto(true, 'Campus removido com sucesso', null);
  }
}
