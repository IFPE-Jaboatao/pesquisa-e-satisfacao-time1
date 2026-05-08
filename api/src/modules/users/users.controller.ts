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

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: UserResponseDto,
  })
  async create(
    @Body() data: CreateUserDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.create(data);

    return new ApiResponseDto(true, 'Usuário criado com sucesso', user);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários',
    type: [UserResponseDto],
  })
  async findAll(): Promise<ApiResponseDto<UserResponseDto[]>> {
    const users = await this.usersService.findAll();

    return new ApiResponseDto(true, 'Lista de usuários', users);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', example: 'uuid-aqui' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    type: UserResponseDto,
  })
  async findById(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<UserResponseDto | null>> {
    const user = await this.usersService.findById(id);

    return new ApiResponseDto(true, 'Usuário encontrado', user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.update(id, data);

    return new ApiResponseDto(true, 'Usuário atualizado com sucesso', user);
  }

  @Patch(':id/inactivate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Inativar usuário' })
  @ApiParam({ name: 'id' })
  async inactivate(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.usersService.inactivate(id);

    return new ApiResponseDto(true, 'Usuário inativado com sucesso', user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover usuário (soft-delete)' })
  @ApiParam({ name: 'id' })
  async delete(@Param('id') id: string): Promise<ApiResponseDto<null>> {
    await this.usersService.delete(id);

    return new ApiResponseDto(true, 'Usuário removido com sucesso', null);
  }
}
