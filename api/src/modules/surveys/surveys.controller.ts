import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SurveysService } from './surveys.service';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateSurveyDto } from './dtos/create-survey.dto';
import { ApiResponseDto } from 'src/common/dtos/api-response.dto';
import { AnswerSurveyDto } from './dtos/answer-survey.dto';
import { ListSurveysDto } from './dtos/list-surveys.dto';
import { UpdateSurveyDto } from './dtos/update-survey.dto';
import { SurveyResultsDto } from './dtos/survey-results.dto';

import { Request } from 'express';
import { AuthUser } from 'src/common/interfaces/auth-user.interface';
import { SurveyResponseDto } from './dtos/survey-response.dto';
import { CreateSurveyResponseDto } from './dtos/create-survey-response.dto';

@ApiTags('Surveys')
@Controller('surveys')
export class SurveysController {
  constructor(private readonly service: SurveysService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar pesquisas com filtros e paginação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pesquisas',
    type: [SurveyResponseDto],
  })
  async findAll(@Query() query: ListSurveysDto) {
    const result = await this.service.findAll(query);

    return new ApiResponseDto(true, 'Lista de pesquisas', result);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar pesquisa' })
  @ApiBody({ type: CreateSurveyDto })
  @ApiResponse({
    status: 201,
    description: 'Pesquisa criada com sucesso',
    type: CreateSurveyResponseDto,
  })
  async create(
    @Body() data: CreateSurveyDto,
  ): Promise<ApiResponseDto<CreateSurveyResponseDto>> {
    const result = await this.service.create(data);

    return new ApiResponseDto(true, 'Survey criado', result);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ALUNO', 'ADMIN')
  @ApiOperation({
    summary: 'Buscar pesquisa por ID',
  })
  @ApiParam({
    name: 'id',
  })
  @ApiResponse({
    status: 200,
    description: 'Pesquisa encontrada',
    type: SurveyResponseDto,
  })
  async findById(@Param('id') id: string) {
    const survey = await this.service.findById(id);

    return new ApiResponseDto(true, 'Survey encontrada', survey);
  }

  @Get(':id/results')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obter resultados da pesquisa' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Resultados da pesquisa',
    type: SurveyResultsDto,
  })
  async getResults(@Param('id') id: string) {
    const results = await this.service.getResults(id);

    return new ApiResponseDto(true, 'Resultados da pesquisa', results);
  }

  @Get('public/:token')
  @ApiOperation({
    summary: 'Buscar pesquisa pública por token',
  })
  @ApiParam({
    name: 'token',
    example: 'uuid-token-publico',
  })
  @ApiResponse({
    status: 200,
    description: 'Pesquisa encontrada',
    type: SurveyResponseDto,
  })
  async getPublic(@Param('token') token: string) {
    const survey = await this.service.getPublicSurvey(token);

    if (!survey) {
      throw new NotFoundException('Survey não encontrado');
    }

    return new ApiResponseDto(true, 'Survey público', survey);
  }

  @Post(':id/answer')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ALUNO')
  @ApiBody({ type: AnswerSurveyDto })
  @ApiOperation({
    summary: 'Responder pesquisa autenticada',
  })
  @ApiBody({
    type: AnswerSurveyDto,
  })
  async answerLogged(
    @Param('id') id: string,
    @Body() body: AnswerSurveyDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    const result = await this.service.answer(id, body.responses, req.user.sub);

    return new ApiResponseDto(true, 'Resposta registrada', result);
  }

  @Post('public/:token/answer')
  @ApiOperation({
    summary: 'Responder pesquisa anônima',
  })
  @ApiParam({
    name: 'token',
  })
  @ApiBody({
    type: AnswerSurveyDto,
  })
  async answerAnonymous(
    @Param('token') token: string,
    @Body() body: AnswerSurveyDto,
  ) {
    const survey = await this.service.getPublicSurvey(token);

    if (!survey) {
      throw new NotFoundException('Survey não encontrado');
    }

    const result = await this.service.answer(
      survey._id.toString(),
      body.responses,
      undefined,
    );

    return new ApiResponseDto(true, 'Resposta registrada', result);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar pesquisa' })
  async update(@Param('id') id: string, @Body() data: UpdateSurveyDto) {
    const survey = await this.service.update(id, data);

    return new ApiResponseDto(true, 'Pesquisa atualizada', survey);
  }

  @Patch(':id/inactivate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Inativar pesquisa (soft delete)' })
  async inactivate(@Param('id') id: string) {
    await this.service.softDelete(id);

    return new ApiResponseDto(true, 'Pesquisa inativada', null);
  }

  @Get(':id/anonymous-link')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({
    summary: 'Obter link anônimo da pesquisa',
  })
  async getAnonymousLink(@Param('id') id: string) {
    const result = await this.service.getAnonymousLink(id);

    return new ApiResponseDto(true, 'Link recuperado', result);
  }
}
