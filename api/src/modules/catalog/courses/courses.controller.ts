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
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '../../auth/guards/roles.guard';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar curso' })
  async create(@Body() data: CreateCourseDto) {
    const course = await this.coursesService.create(data);
    return new ApiResponseDto(true, 'Curso criado com sucesso', course);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({ summary: 'Listar cursos' })
  async findAll() {
    const courses = await this.coursesService.findAll();
    return new ApiResponseDto(true, 'Lista de cursos', courses);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'GESTOR')
  @ApiOperation({ summary: 'Buscar curso por ID' })
  async findById(@Param('id') id: string) {
    const course = await this.coursesService.findById(id);
    return new ApiResponseDto(true, 'Curso encontrado', course);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar curso' })
  async update(@Param('id') id: string, @Body() data: UpdateCourseDto) {
    const course = await this.coursesService.update(id, data);
    return new ApiResponseDto(true, 'Curso atualizado', course);
  }

  @Patch(':id/inactivate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Inativar curso' })
  async inactivate(@Param('id') id: string) {
    const course = await this.coursesService.inactivate(id);
    return new ApiResponseDto(true, 'Curso inativado', course);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover curso' })
  async delete(@Param('id') id: string) {
    await this.coursesService.delete(id);
    return new ApiResponseDto(true, 'Curso removido', null);
  }
}
