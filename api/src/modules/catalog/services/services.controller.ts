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

import { ServicesService } from './services.service';
import { CreateServiceDto } from './dtos/create-service.dto';
import { UpdateServiceDto } from './dtos/update-service.dto';
import { ServiceResponseDto } from './dtos/service-response.dto';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { Roles, RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar serviço' })
  @ApiBody({ type: CreateServiceDto })
  @ApiResponse({
    status: 201,
    description: 'Serviço criado com sucesso',
    type: ServiceResponseDto,
  })
  async create(
    @Body() data: CreateServiceDto,
  ): Promise<ApiResponseDto<ServiceResponseDto>> {
    const serviceEntity = await this.servicesService.create(data);
    return new ApiResponseDto(
      true,
      'Serviço criado com sucesso',
      serviceEntity,
    );
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'GESTOR', 'TECNICO', 'DOCENTE', 'ALUNO')
  @ApiOperation({ summary: 'Listar serviços' })
  @ApiResponse({
    status: 200,
    description: 'Lista de serviços',
    type: [ServiceResponseDto],
  })
  async findAll(): Promise<ApiResponseDto<ServiceResponseDto[]>> {
    const services = await this.servicesService.findAll();
    return new ApiResponseDto(true, 'Lista de serviços', services);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'GESTOR', 'TECNICO', 'DOCENTE', 'ALUNO')
  @ApiOperation({ summary: 'Buscar serviço por ID' })
  @ApiParam({ name: 'id', example: 'uuid-aqui' })
  @ApiResponse({
    status: 200,
    description: 'Serviço encontrado',
    type: ServiceResponseDto,
  })
  async findById(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<ServiceResponseDto | null>> {
    const serviceEntity = await this.servicesService.findById(id);
    return new ApiResponseDto(true, 'Serviço encontrado', serviceEntity);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar serviço' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateServiceDto })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateServiceDto,
  ): Promise<ApiResponseDto<ServiceResponseDto>> {
    const serviceEntity = await this.servicesService.update(id, data);
    return new ApiResponseDto(
      true,
      'Serviço atualizado com sucesso',
      serviceEntity,
    );
  }

  @Patch(':id/inactivate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Inativar serviço' })
  @ApiParam({ name: 'id' })
  async inactivate(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<ServiceResponseDto>> {
    const serviceEntity = await this.servicesService.inactivate(id);
    return new ApiResponseDto(
      true,
      'Serviço inativado com sucesso',
      serviceEntity,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover serviço' })
  @ApiParam({ name: 'id' })
  async delete(@Param('id') id: string): Promise<ApiResponseDto<null>> {
    await this.servicesService.delete(id);
    return new ApiResponseDto(true, 'Serviço removido com sucesso', null);
  }
}
