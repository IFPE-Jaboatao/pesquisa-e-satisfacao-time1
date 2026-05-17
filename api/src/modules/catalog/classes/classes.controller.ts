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
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ClassesService } from './classes.service';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { ClassResponseDto } from './dtos/class-response.dto';
import { EnrollmentResponseDto } from './dtos/enrollment-response.dto';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from 'src/modules/auth/guards/roles.guard';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar turma' })
  @ApiBody({ type: CreateClassDto })
  async create(
    @Body() data: CreateClassDto,
  ): Promise<ApiResponseDto<ClassResponseDto>> {
    const classEntity = await this.classesService.create(data);
    return new ApiResponseDto(true, 'Turma criada com sucesso', classEntity);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'DOCENTE', 'ALUNO')
  @ApiOperation({ summary: 'Listar turmas' })
  async findAll(): Promise<ApiResponseDto<ClassResponseDto[]>> {
    const classes = await this.classesService.findAll();
    return new ApiResponseDto(true, 'Lista de turmas', classes);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'DOCENTE', 'ALUNO')
  @ApiOperation({ summary: 'Buscar turma por ID' })
  @ApiParam({ name: 'id', example: 'uuid-aqui' })
  async findById(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<ClassResponseDto | null>> {
    const classEntity = await this.classesService.findById(id);
    return new ApiResponseDto(true, 'Turma encontrada', classEntity);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar turma' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateClassDto })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateClassDto,
  ): Promise<ApiResponseDto<ClassResponseDto>> {
    const classEntity = await this.classesService.update(id, data);
    return new ApiResponseDto(
      true,
      'Turma atualizada com sucesso',
      classEntity,
    );
  }

  @Patch(':id/inactivate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Inativar turma' })
  @ApiParam({ name: 'id' })
  async inactivate(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<ClassResponseDto>> {
    const classEntity = await this.classesService.inactivate(id);
    return new ApiResponseDto(true, 'Turma inativada com sucesso', classEntity);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover turma' })
  @ApiParam({ name: 'id' })
  async delete(@Param('id') id: string): Promise<ApiResponseDto<null>> {
    await this.classesService.delete(id);
    return new ApiResponseDto(true, 'Turma removida com sucesso', null);
  }

  @Get(':id/students')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'DOCENTE')
  @ApiOperation({ summary: 'Listar alunos matriculados na turma' })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  async findEnrollments(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<EnrollmentResponseDto[]>> {
    const enrollments = await this.classesService.findEnrollmentsByClass(id);
    return new ApiResponseDto(
      true,
      'Lista de alunos matriculados',
      enrollments,
    );
  }

  @Delete(':id/students/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Cancelar matrícula do aluno na turma' })
  @ApiParam({ name: 'id', description: 'ID da turma' })
  @ApiParam({ name: 'userId', description: 'ID do aluno' })
  async unenrollStudent(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<ApiResponseDto<EnrollmentResponseDto>> {
    const enrollment = await this.classesService.unenrollStudent(id, userId);
    return new ApiResponseDto(
      true,
      'Matrícula cancelada com sucesso',
      enrollment,
    );
  }
}
